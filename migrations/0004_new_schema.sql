-- Migration number: 0004 	 2024-06-23T10:59:48.864Z

DROP TABLE IF EXISTS exhibition;
DROP TABLE IF EXISTS artwork;
DROP TABLE IF EXISTS user;

-- Table: user
CREATE TABLE user (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    userName VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL,
    lastLoginDate DATE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    about TEXT,
    socials VARCHAR(255),
    phoneNumber VARCHAR(20),
    location VARCHAR(255),
    joinDate DATE NOT NULL,
    artistFlag BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL
);

-- Table: artwork
CREATE TABLE artwork (
    artworkId INTEGER PRIMARY KEY AUTOINCREMENT,
    artistId INTEGER,
    title VARCHAR(255) NOT NULL,
    date DATE,
    description TEXT,
    active BOOLEAN NOT NULL,
    path VARCHAR(255),
    FOREIGN KEY (artistId) REFERENCES user(userId)
);

-- Table: exhibition
CREATE TABLE exhibition (
    exhibitionId INTEGER PRIMARY KEY AUTOINCREMENT,
    artistId INTEGER,
    artworkId INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (artistId) REFERENCES artist(artistId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
);
