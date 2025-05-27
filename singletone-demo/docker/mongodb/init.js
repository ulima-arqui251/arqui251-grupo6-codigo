// Conectar a la base de datos
db = db.getSiblingDB('singletone_music');

// Crear colecciones e insertar datos de prueba

// Artistas
db.artists.insertMany([
    {
        _id: ObjectId(),
        name: "Queen",
        genre: ["Rock", "Pop Rock"],
        country: "United Kingdom",
        formed_year: 1970,
        biography: "British rock band formed in London in 1970.",
        image_url: "https://example.com/queen.jpg",
        spotify_id: "1dfeR4HaWDbWqFHLkxsg1d",
        popularity: 95,
        followers: 28500000,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: ObjectId(),
        name: "The Beatles",
        genre: ["Rock", "Pop", "Psychedelic Rock"],
        country: "United Kingdom", 
        formed_year: 1960,
        biography: "English rock band formed in Liverpool in 1960.",
        image_url: "https://example.com/beatles.jpg",
        spotify_id: "3WrFJ7ztbogyGnTHbHJFl2",
        popularity: 98,
        followers: 21500000,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: ObjectId(),
        name: "Led Zeppelin",
        genre: ["Rock", "Hard Rock", "Heavy Metal"],
        country: "United Kingdom",
        formed_year: 1968,
        biography: "English rock band formed in London in 1968.",
        image_url: "https://example.com/ledzeppelin.jpg",
        spotify_id: "36QJpDe2go2KgaRleHCDTp",
        popularity: 87,
        followers: 15200000,
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Álbumes
db.albums.insertMany([
    {
        _id: ObjectId(),
        title: "A Night at the Opera",
        artist_name: "Queen",
        artist_id: db.artists.findOne({name: "Queen"})._id,
        release_date: new Date("1975-11-21"),
        genre: ["Rock", "Pop Rock"],
        total_tracks: 12,
        duration_ms: 2583000,
        image_url: "https://example.com/night-opera.jpg",
        spotify_id: "1TSZDcvlPAgetBzWduYm0P",
        popularity: 89,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: ObjectId(),
        title: "Abbey Road",
        artist_name: "The Beatles",
        artist_id: db.artists.findOne({name: "The Beatles"})._id,
        release_date: new Date("1969-09-26"),
        genre: ["Rock", "Pop"],
        total_tracks: 17,
        duration_ms: 2917000,
        image_url: "https://example.com/abbey-road.jpg",
        spotify_id: "0ETFjACtuP2ADo6LFhL6HN",
        popularity: 94,
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Canciones
db.songs.insertMany([
    {
        _id: ObjectId(),
        title: "Bohemian Rhapsody",
        artist_name: "Queen",
        artist_id: db.artists.findOne({name: "Queen"})._id,
        album_title: "A Night at the Opera",
        album_id: db.albums.findOne({title: "A Night at the Opera"})._id,
        track_number: 11,
        duration_ms: 355000,
        genre: ["Rock", "Pop Rock"],
        spotify_id: "4u7EnebtmKWzUH433cf5Qv",
        popularity: 96,
        preview_url: "https://example.com/bohemian-preview.mp3",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: ObjectId(),
        title: "Come Together",
        artist_name: "The Beatles",
        artist_id: db.artists.findOne({name: "The Beatles"})._id,
        album_title: "Abbey Road",
        album_id: db.albums.findOne({title: "Abbey Road"})._id,
        track_number: 1,
        duration_ms: 260000,
        genre: ["Rock", "Blues Rock"],
        spotify_id: "2EqlS6tkEnglzr7tkKAAYD",
        popularity: 88,
        preview_url: "https://example.com/come-together-preview.mp3",
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Biblioteca de usuarios (relaciones usuario-artista/álbum)
db.user_library.insertMany([
    {
        _id: ObjectId(),
        user_id: 1, // ID del usuario desde PostgreSQL
        artist_id: db.artists.findOne({name: "Queen"})._id,
        artist_name: "Queen",
        status: "valorado", // agregado, valorado
        date_added: new Date(),
        rating: 4.5,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: ObjectId(),
        user_id: 1,
        artist_id: db.artists.findOne({name: "The Beatles"})._id,
        artist_name: "The Beatles", 
        status: "agregado",
        date_added: new Date(),
        rating: null,
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Valoraciones de álbumes y canciones
db.ratings.insertMany([
    {
        _id: ObjectId(),
        user_id: 1,
        item_type: "album", // album, song
        item_id: db.albums.findOne({title: "A Night at the Opera"})._id,
        item_name: "A Night at the Opera",
        artist_name: "Queen",
        rating: 4.5,
        review: "Masterpiece of rock music",
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Recomendaciones
db.recommendations.insertMany([
    {
        _id: ObjectId(),
        user_id: 1,
        type: "artist", // artist, album
        recommended_item_id: db.artists.findOne({name: "Led Zeppelin"})._id,
        recommended_item_name: "Led Zeppelin",
        similarity_score: 0.87,
        reason: "Basado en tu gusto por Queen",
        algorithm: "collaborative_filtering",
        created_at: new Date(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    }
]);

// Crear índices para optimización
db.artists.createIndex({ "name": "text", "genre": 1 });
db.albums.createIndex({ "title": "text", "artist_name": 1 });
db.songs.createIndex({ "title": "text", "artist_name": 1, "album_title": 1 });
db.user_library.createIndex({ "user_id": 1, "status": 1 });
db.ratings.createIndex({ "user_id": 1, "item_type": 1 });
db.recommendations.createIndex({ "user_id": 1, "expires_at": 1 });

print("MongoDB initialized with demo data successfully!");