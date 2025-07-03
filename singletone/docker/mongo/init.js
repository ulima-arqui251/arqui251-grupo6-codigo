// ===== SISTEMA ESCALABLE PARA MONGODB =====
// Script base con funciones reutilizables

db = db.getSiblingDB('music');

// ===== FUNCIONES REUTILIZABLES =====

// Función para crear un género
function createGenre(name) {
    const genreId = ObjectId();
    db.Genre.insertOne({ 
        _id: genreId,
        name: name 
    });
    return genreId;
}

// Función para crear un artista
function createArtist(name, pictureUrl, debutYear, genreName) {
    const artistId = ObjectId();
    db.Artist.insertOne({
        _id: artistId,
        name: name,
        picture_url: pictureUrl,
        debut_year: ISODate(debutYear),
        albums: [] // Se llenará cuando se agreguen álbumes
    });
    return artistId;
}

// Función para crear un álbum con sus canciones
function createAlbumWithSongs(artistId, albumData, songNames) {
    const albumId = ObjectId();
    const songIds = songNames.map(() => ObjectId());
    
    // Insertar álbum
    db.Album.insertOne({
        _id: albumId,
        title: albumData.title,
        genre: albumData.genreId,
        release_year: albumData.releaseYear,
        cover_url: albumData.coverUrl,
        songs: songIds
    });
    
    // Insertar canciones
    songNames.forEach((songName, index) => {
        db.Song.insertOne({
        _id: songIds[index],
        name: songName,
        album_id: albumId
        });
    });
    
    // Actualizar el artista agregando el álbum
    db.Artist.updateOne(
        { _id: artistId },
        { $push: { albums: albumId } }
    );
    
    return { albumId, songIds };
}

// Función para agregar un álbum a la biblioteca del usuario (sin valorar)
function addAlbumToUserLibrary(userId, artistId, albumId) {
    // Verificar si el usuario ya tiene el artista
    const existingArtistUser = db.ArtistUser.findOne({
        user_id: userId,
        artist_id: artistId
    });
    
    if (existingArtistUser) {
        // Actualizar el artista existente
        db.ArtistUser.updateOne(
        { user_id: userId, artist_id: artistId },
        { $inc: { total_albums: 1 } }
        );
    } else {
        // Crear nuevo ArtistUser
        db.ArtistUser.insertOne({
        _id: ObjectId(),
        user_id: userId,
        artist_id: artistId,
        rank_state: "to_value",
        total_albums: 1,
        completed_albums: 0
        });
    }
    
    // Crear AlbumUser en estado "to_value"
    db.AlbumUser.insertOne({
        _id: ObjectId(),
        album_id: albumId,
        user_id: userId,
        artist_id: artistId,
        rank_date: new Date(),
        rank_state: "to_value"
    });
}

// Función para valorar un álbum completo (con todas sus canciones)
function rateCompleteAlbum(userId, artistId, albumId, songIds, baseScore = 85) {
    // Actualizar AlbumUser a "valued"
    db.AlbumUser.updateOne(
        { user_id: userId, album_id: albumId },
        { 
        $set: { 
            rank_state: "valued",
            rank_date: new Date()
        }
        }
    );
    
    // Crear SongUser para cada canción con puntuaciones variadas
    songIds.forEach((songId, index) => {
        const randomVariation = Math.floor(Math.random() * 20) - 10; // -10 a +10
        const score = Math.max(1, Math.min(100, baseScore + randomVariation));
        
        db.SongUser.insertOne({
        _id: ObjectId(),
        user_id: userId,
        song_id: songId,
        album_id: albumId,
        artist_id: artistId,
        score: score
        });
    });
    
    // Actualizar ArtistUser: incrementar completed_albums
    db.ArtistUser.updateOne(
        { user_id: userId, artist_id: artistId },
        { $inc: { completed_albums: 1 } }
    );
    
    // Verificar si el usuario ha completado todos los álbumes del artista
    const artistUser = db.ArtistUser.findOne({
        user_id: userId,
        artist_id: artistId
    });
    
    if (artistUser && artistUser.completed_albums >= artistUser.total_albums) {
        // Cambiar estado del artista a "valued"
        db.ArtistUser.updateOne(
        { user_id: userId, artist_id: artistId },
        { $set: { rank_state: "valued" } }
        );
    }
}

// Función para el flujo completo: agregar álbum y valorarlo
function addAndRateAlbum(userId, artistId, albumId, songIds, baseScore = 85) {
    addAlbumToUserLibrary(userId, artistId, albumId);
    rateCompleteAlbum(userId, artistId, albumId, songIds, baseScore);
}

// Función para crear datos múltiples de artistas
function createMultipleArtists(artistsData) {
    const results = [];
    
    artistsData.forEach(artistData => {
        // Crear género si no existe
        let genreId;
        const existingGenre = db.Genre.findOne({ name: artistData.genre });
        if (existingGenre) {
        genreId = existingGenre._id;
        } else {
        genreId = createGenre(artistData.genre);
        }
        
        // Crear artista
        const artistId = createArtist(
        artistData.name,
        artistData.pictureUrl,
        artistData.debutYear,
        artistData.genre
        );
    
        // Crear álbumes del artista
        const albumResults = [];
        artistData.albums.forEach(albumData => {
        const result = createAlbumWithSongs(artistId, {
            title: albumData.title,
            genreId: genreId,
            releaseYear: albumData.releaseYear,
            coverUrl: albumData.coverUrl
        }, albumData.songs);
        
        albumResults.push(result);
        });
        
        results.push({
        artistId,
        genreId,
        albums: albumResults
        });
    });
    
    return results;
}

// ===== DATOS INICIALES =====

// Definir datos de artistas
const artistsData = [
    {
        name: "Twenty One Pilots",
        pictureUrl: "http://example.com/twenty-one-pilots.jpg",
        debutYear: "2009-01-01",
        genre: "Alternative Rock",
        albums: [
        {
            title: "Twenty One Pilots",
            releaseYear: "2009",
            coverUrl: "http://example.com/top-self-titled.jpg",
            songs: [
            "Implicit Demand for Proof", "Fall Away", "The Pantaloon",
            "Addict With a Pen", "Friend, Please", "March to the Sea",
            "Johnny Boy", "Oh Ms Believer", "Air Catcher",
            "Trapdoor", "A Car, a Torch, a Death", "Taxi Cab",
            "Before You Start Your Day", "Isle of Flightless Birds"
            ]
        },
        {
            title: "Regional at Best",
            releaseYear: "2011",
            coverUrl: "http://example.com/regional-at-best.jpg",
            songs: [
            "Guns for Hands", "Holding On to You", "Ode to Sleep",
            "Slowtown", "Car Radio", "Forest", "Glowing Eyes",
            "Kitchen Sink", "Anathema", "Lovely", "Ruby", "Trees"
            ]
        },
        {
            title: "Vessel",
            releaseYear: "2013",
            coverUrl: "http://example.com/vessel.jpg",
            songs: [
            "Ode to Sleep", "Holding On to You", "Migraine",
            "House of Gold", "Car Radio", "Semi-Automatic",
            "Screen", "The Run and Go", "Fake You Out",
            "Guns for Hands", "Trees", "Truce"
            ]
        },
        {
            title: "Blurryface",
            releaseYear: "2015",
            coverUrl: "http://example.com/blurryface.jpg",
            songs: [
            "Heavydirtysoul", "Stressed Out", "Ride", "Fairly Local",
            "Tear in My Heart", "Lane Boy", "The Judge", "Doubt",
            "Polarize", "We Don't Believe What's on TV", "Message Man",
            "Hometown", "Not Today", "Goner"
            ]
        },
        {
            title: "Trench",
            releaseYear: "2018",
            coverUrl: "http://example.com/trench.jpg",
            songs: [
            "Jumpsuit", "Levitate", "Morph", "My Blood",
            "Chlorine", "Smithereens", "Neon Gravestones",
            "The Hype", "Nico and the Niners", "Cut My Lip",
            "Bandito", "Pet Cheetah", "Legend", "Leave the City"
            ]
        },
        {
            title: "Scaled and Icy",
            releaseYear: "2021",
            coverUrl: "http://example.com/scaled-and-icy.jpg",
            songs: [
            "Good 4 U", "Choker", "Shy Away", "The Outside",
            "Saturday", "Never Take It", "Mulberry Street",
            "Formidable", "Bounce Man", "No Chances", "Redecorate"
            ]
        },
        {
            title: "Clancy",
            releaseYear: "2024",
            coverUrl: "http://example.com/clancy.jpg",
            songs: [
            "Overcompensate", "Next Semester", "Backslide",
            "Midwest Indigo", "Routines In The Night", "Vignette",
            "The Craving (Jenna's Version)", "Lavish", "Navigating",
            "Snap Back", "Oldies Station", "At The Risk Of Feeling Dumb",
            "Paladin Strait"
            ]
        }
        ]
    },
    {
        name: "Imagine Dragons",
        pictureUrl: "http://example.com/imagine-dragons.jpg",
        debutYear: "2008-01-01",
        genre: "Pop Rock",
        albums: [
        {
            title: "Smoke + Mirrors",
            releaseYear: "2015",
            coverUrl: "http://example.com/smoke-mirrors.jpg",
            songs: [
            "Shots", "Gold", "Smoke and Mirrors", "I'm So Sorry",
            "I Bet My Life", "Polaroid", "Friction", "It Comes Back to You",
            "Dream", "Trouble", "Summer", "Hopeless Opus", "The Fall"
            ]
        }
        ]
    }
];

// ===== EJECUCIÓN =====

// Crear todos los artistas y sus álbumes
print("=== Creando artistas y álbumes ===");
const results = createMultipleArtists(artistsData);

// Crear usuarios que valoren álbumes
print("=== Creando usuarios y valoraciones ===");
const userId1 = "user123";
const userId2 = "user456";
const userId3 = "user789";

// Usuario 1: Agrega y valora Clancy (Twenty One Pilots)
const topArtist = results.find(r => r.artistId);
if (topArtist && topArtist.albums.length > 0) {
    const clancyAlbum = topArtist.albums[topArtist.albums.length - 1]; // Último álbum (Clancy)
    addAndRateAlbum(userId1, topArtist.artistId, clancyAlbum.albumId, clancyAlbum.songIds, 87);
}

// Usuario 2: Agrega múltiples álbumes de Twenty One Pilots pero solo valora algunos
if (topArtist && topArtist.albums.length >= 3) {
    // Agregar 3 álbumes a la biblioteca
    addAlbumToUserLibrary(userId2, topArtist.artistId, topArtist.albums[0].albumId); // Twenty One Pilots
    addAlbumToUserLibrary(userId2, topArtist.artistId, topArtist.albums[1].albumId); // Regional at Best
    addAlbumToUserLibrary(userId2, topArtist.artistId, topArtist.albums[2].albumId); // Vessel
    
    // Solo valorar 2 de los 3 álbumes (artista quedará en "to_value")
    rateCompleteAlbum(userId2, topArtist.artistId, topArtist.albums[0].albumId, topArtist.albums[0].songIds, 83);
    rateCompleteAlbum(userId2, topArtist.artistId, topArtist.albums[1].albumId, topArtist.albums[1].songIds, 85);
}

// Usuario 3: Agrega y valora Smoke + Mirrors (Imagine Dragons)
const idArtist = results.find(r => r.artistId && artistsData.some(a => a.name === "Imagine Dragons"));
if (idArtist && idArtist.albums.length > 0) {
    const smokeAlbum = idArtist.albums[0];
    addAndRateAlbum(userId3, idArtist.artistId, smokeAlbum.albumId, smokeAlbum.songIds, 82);
}

// ===== VERIFICACIÓN =====
print("\n=== RESUMEN DE DATOS INSERTADOS ===");
print("Géneros:", db.Genre.countDocuments());
print("Artistas:", db.Artist.countDocuments());
print("Álbumes:", db.Album.countDocuments());
print("Canciones:", db.Song.countDocuments());
print("ArtistUser:", db.ArtistUser.countDocuments());
print("AlbumUser:", db.AlbumUser.countDocuments());
print("SongUser:", db.SongUser.countDocuments());

print("\n=== ARTISTAS CREADOS ===");
db.Artist.find({}, {name: 1, _id: 0}).forEach(artist => {
    const albumCount = db.Album.countDocuments({_id: {$in: artist.albums || []}});
    print(`- ${artist.name} (${albumCount} álbumes)`);
});

print("\n=== EJEMPLO DE ÁLBUMES ===");
db.Album.find({}, {title: 1, release_year: 1, _id: 0}).limit(5).forEach(album => {
    print(`- ${album.title} (${album.release_year})`);
});

print("\n=== ESTADÍSTICAS DE USUARIOS ===");
print("Total de valoraciones de canciones:", db.SongUser.countDocuments());
print("Usuarios únicos que han valorado:", db.SongUser.distinct("user_id").length);

print("\n¡Script escalable ejecutado exitosamente!");
print("Ahora puedes agregar más datos usando las funciones creadas.");