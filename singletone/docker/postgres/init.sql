CREATE TABLE UserProfile (
    profile_id INT PRIMARY KEY,
    user_id INT,
    creation_date DATE
);

CREATE TABLE UserStats (
    stats_id INT PRIMARY KEY,
    profile_id INT,
    n_songs INT,
    n_albums INT,
    n_artist INT
);

CREATE TABLE BasicData (
    data_id INT PRIMARY KEY,
    profile_id INT,
    name VARCHAR,
    last_name VARCHAR,
    nickname VARCHAR,
    mail VARCHAR,
    picture VARCHAR
);

CREATE TABLE Suscription (
    sub_id INT,
    profile_id INT PRIMARY KEY,
    type VARCHAR,
    expiration_date DATE
);

CREATE TABLE MusicLibrary (
    library_id INT,
    profile_id INT PRIMARY KEY,
    list_id VARCHAR,
);