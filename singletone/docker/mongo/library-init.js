db = db.getSiblingDB('library');

// Agregar álbum a biblioteca
function addAlbumToUserLibrary(userId, artistId, albumId) {
    const existing = db.ArtistUser.findOne({ user_id: userId, artist_id: artistId });

    if (existing) {
        db.ArtistUser.updateOne(
            { user_id: userId, artist_id: artistId },
            { $inc: { total_albums: 1 } }
        );
    } else {
        db.ArtistUser.insertOne({
            _id: ObjectId(),
            user_id: userId,
            artist_id: artistId,
            rank_state: "to_value",
            total_albums: 1,
            completed_albums: 0
        });
    }

    db.AlbumUser.insertOne({
        _id: ObjectId(),
        album_id: albumId,
        user_id: userId,
        artist_id: artistId,
        rank_date: new Date(),
        rank_state: "to_value"
    });
}

// Valorar álbum completo
function rateCompleteAlbum(userId, artistId, albumId, songIds, baseScore = 85) {
    db.AlbumUser.updateOne(
        { user_id: userId, album_id: albumId },
        {
            $set: {
                rank_state: "valued",
                rank_date: new Date()
            }
        }
    );

    songIds.forEach(songId => {
        const variation = Math.floor(Math.random() * 20) - 10;
        const score = Math.max(1, Math.min(100, baseScore + variation));

        db.SongUser.insertOne({
            _id: ObjectId(),
            user_id: userId,
            song_id: songId,
            album_id: albumId,
            artist_id: artistId,
            score
        });
    });

    db.ArtistUser.updateOne(
        { user_id: userId, artist_id: artistId },
        { $inc: { completed_albums: 1 } }
    );

    const artistUser = db.ArtistUser.findOne({ user_id: userId, artist_id: artistId });
    if (artistUser.completed_albums >= artistUser.total_albums) {
        db.ArtistUser.updateOne(
            { user_id: userId, artist_id: artistId },
            { $set: { rank_state: "valued" } }
        );
    }
}

// Flujo completo
function addAndRateAlbum(userId, artistId, albumId, songIds, baseScore = 85) {
    addAlbumToUserLibrary(userId, artistId, albumId);
    rateCompleteAlbum(userId, artistId, albumId, songIds, baseScore);
}

// === SIMULACIÓN DE USUARIOS ===
// ⚠ Para pruebas manuales. El frontend o el backend real serán quienes invoquen estas funciones con los datos reales.
print("Listo. Puedes usar addAndRateAlbum(...) o addAlbumToUserLibrary(...) desde cliente o pruebas.");