-- Migration number: 0001 	 2024-06-07T19:09:08.074Z

-- Drop table if exists statements
DROP TABLE IF EXISTS exhibition;
DROP TABLE IF EXISTS artwork;
DROP TABLE IF EXISTS artist;

-- Table: artist
CREATE TABLE artist (
    artistId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    about TEXT,
    socials VARCHAR(255),
    phoneNumber VARCHAR(20),
    location VARCHAR(255),
    joinDate DATE NOT NULL,
    active BOOLEAN NOT NULL
);

-- Table: artwork
CREATE TABLE artwork (
    artworkId INT AUTO_INCREMENT PRIMARY KEY,
    artistId INT,
    title VARCHAR(255) NOT NULL,
    date DATE,
    description TEXT,
    active BOOLEAN NOT NULL,
    path VARCHAR(255),
    FOREIGN KEY (artistId) REFERENCES artist(artistId)
);

-- Table: exhibition
CREATE TABLE exhibition (
    exhibitionId INT AUTO_INCREMENT PRIMARY KEY,
    artistId INT,
    artworkId INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (artistId) REFERENCES artist(artistId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
);
