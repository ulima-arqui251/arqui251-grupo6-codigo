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
        songs: songIds,
        artist_id: artistId
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
        pictureUrl: "https://portalpopline.com.br/wp-content/uploads/2025/05/twenty-one-pilots-breach-novo-album.png",
        debutYear: "2009-01-01",
        genre: "Alternative Rock",
        albums: [
        {
            title: "Twenty One Pilots",
            releaseYear: "2009",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ca/7a/d0/ca7ad083-e97a-de0c-a8f2-5e144662dc87/884501253109_cover.jpg/486x486bb.png",
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
            coverUrl: "https://lastfm.freetls.fastly.net/i/u/ar0/20a1fe31863658a168cccac6b419e99f.jpg",
            songs: [
            "Guns for Hands", "Holding On to You", "Ode to Sleep",
            "Slowtown", "Car Radio", "Forest", "Glowing Eyes",
            "Kitchen Sink", "Anathema", "Lovely", "Ruby", "Trees"
            ]
        },
        {
            title: "Vessel",
            releaseYear: "2013",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/73/a7/23/73a7230c-19df-02a4-ff4e-53944024f63d/075679957924.jpg/600x600bf-60.jpg",
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
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8e/e2/89/8ee28904-0821-610d-5011-a61845f62756/075679926951.jpg/600x600bf-60.jpg",
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
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a3/c0/2b/a3c02b76-baa1-e575-dcba-247509200424/075679864789.jpg/600x600bf-60.jpg",
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
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/f2/15/24f215e3-52cc-078b-d799-d58d606feddd/075679786210.jpg/600x600bf-60.jpg",
            songs: [
            "Good 4 U", "Choker", "Shy Away", "The Outside",
            "Saturday", "Never Take It", "Mulberry Street",
            "Formidable", "Bounce Man", "No Chances", "Redecorate"
            ]
        },
        {
            title: "Clancy",
            releaseYear: "2024",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/8b/39/c6/8b39c655-00fd-1b52-52ea-a98de686f3ae/075679659729.jpg/600x600bf-60.jpg",
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
        pictureUrl: "https://cdn-images.dzcdn.net/images/artist/1ba025c23cae3dee14b51152990285fc/1900x1900-000000-80-0-0.jpg",
        debutYear: "2008-01-01",
        genre: "Pop Rock",
        albums: [
        {
            title: "Smoke + Mirrors",
            releaseYear: "2015",
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/c1/16/59/c116596f-f3fd-3499-6cc2-bcb5b4931e6e/14UMGIM61459.rgb.jpg/600x600bf-60.jpg",
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