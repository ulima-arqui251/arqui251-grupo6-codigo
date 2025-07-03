db = db.getSiblingDB('music');

// Función para crear un género
function createGenre(name) {
    const genreId = ObjectId();
    db.Genre.insertOne({ _id: genreId, name });
    return genreId;
}

// Función para crear un artista
function createArtist(name, pictureUrl, debutYear) {
    const artistId = ObjectId();
    db.Artist.insertOne({
        _id: artistId,
        name,
        picture_url: pictureUrl,
        debut_year: ISODate(debutYear),
        albums: []
    });
    return artistId;
}

// Función para crear un álbum con canciones
function createAlbumWithSongs(artistId, albumData, songNames) {
    const albumId = ObjectId();
    const songIds = songNames.map(() => ObjectId());

    db.Album.insertOne({
        _id: albumId,
        title: albumData.title,
        genre: albumData.genreId,
        release_year: albumData.releaseYear,
        cover_url: albumData.coverUrl,
        songs: songIds
    });

    songNames.forEach((songName, index) => {
        db.Song.insertOne({
            _id: songIds[index],
            name: songName,
            album_id: albumId
        });
    });

    db.Artist.updateOne(
        { _id: artistId },
        { $push: { albums: albumId } }
    );

    return { albumId, songIds };
}

// Crear artistas
function createMultipleArtists(artistsData) {
    const results = [];

    artistsData.forEach(artistData => {
        let genreId;
        const existingGenre = db.Genre.findOne({ name: artistData.genre });
        genreId = existingGenre ? existingGenre._id : createGenre(artistData.genre);

        const artistId = createArtist(artistData.name, artistData.pictureUrl, artistData.debutYear);

        const albumResults = artistData.albums.map(albumData =>
            createAlbumWithSongs(artistId, {
                title: albumData.title,
                genreId,
                releaseYear: albumData.releaseYear,
                coverUrl: albumData.coverUrl
            }, albumData.songs)
        );

        results.push({ artistId, genreId, albums: albumResults });
    });

    return results;
}

// === Datos iniciales ===
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

// Ejecutar
print("=== Cargando artistas y álbumes en MongoDB:music ===");
createMultipleArtists(artistsData);