CREATE TABLE hunts(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'hunt id',
    userId varchar(12) NOT NULL,
    gameId varchar(50) NOT NULL,
    pokemon int NOT NULL,
    huntType varchar(100) NOT NULL,
    odds varchar(10) NOT NULL,
    encounters int DEFAULT 0,
    completed BIT(1) DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'create time'
) default charset utf8 comment '';

CREATE INDEX hunt_lookup
ON hunts (userId, is_active);

CREATE TABLE shinydex(
	id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userId varchar(12) NOT NULL,
	pokemon int NOT NULL,
	gameId varchar(50) NOT NULL
);

CREATE INDEX shinydex_lookup
ON shinydex (userId);