-- Migration number: 0007 	 2024-06-23T17:14:26.626Z

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
    isPublic BOOLEAN NOT NULL,
    artistFlag BOOLEAN NOT NULL,
    profilePicturePath VARCHAR(255),
    isActive BOOLEAN NOT NULL
);

-- Table: artwork
CREATE TABLE artwork (
    artworkId INTEGER PRIMARY KEY AUTOINCREMENT,
    artistId INTEGER,
    title VARCHAR(255) NOT NULL,
    uploadDate DATE,
    description TEXT,
    isActive BOOLEAN NOT NULL,
    path VARCHAR(255),
    isPublic BOOLEAN NOT NULL,
    clickCount INTEGER,
    FOREIGN KEY (artistId) REFERENCES user(userId) ON DELETE CASCADE
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
    FOREIGN KEY (artistId) REFERENCES user(userId) ON DELETE CASCADE,
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_user_userName ON user(userName);
CREATE INDEX idx_user_uid ON user(uid);
CREATE INDEX idx_artwork_artistId ON artwork(artistId);