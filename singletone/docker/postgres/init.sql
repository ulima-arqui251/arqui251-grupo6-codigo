CREATE TABLE UserProfile (
    profile_id INT PRIMARY KEY,
    user_id INT,
    creation_date DATE
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
    list_id VARCHAR
);

INSERT INTO UserProfile (profile_id, user_id, creation_date) VALUES
(1, 101, '2024-05-10'),
(2, 102, '2023-11-02'),
(3, 103, '2024-03-15'),
(4, 104, '2022-08-25'),
(5, 105, '2024-06-01');

INSERT INTO BasicData (data_id, profile_id, name, last_name, nickname, mail, picture) VALUES
(1, 1, 'Valentina', 'Ruiz', 'valen', 'valen@mail.com', 'https://cdn.example.com/pics/valen.jpg'),
(2, 2, 'Diego', 'Montoya', 'dieguito', 'diego@mail.com', 'https://cdn.example.com/pics/diego.jpg'),
(3, 3, 'Lucía', 'Fernández', 'luci', 'lucia@mail.com', 'https://cdn.example.com/pics/lucia.jpg'),
(4, 4, 'Javier', 'Ortega', 'javo', 'javier@mail.com', 'https://cdn.example.com/pics/javier.jpg'),
(5, 5, 'Camila', 'Soto', 'cami', 'camila@mail.com', 'https://cdn.example.com/pics/camila.jpg');

INSERT INTO Suscription (sub_id, profile_id, type, expiration_date) VALUES
(201, 1, 'premium', '2025-07-30'),
(202, 2, 'free', NULL),
(203, 3, 'premium', '2024-12-01'),
(204, 4, 'free', NULL),
(205, 5, 'premium', '2025-02-18');