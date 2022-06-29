postgres=# create database cryptolottery;
CREATE DATABASE
postgres=# create user webapp with password 'cryptolotterry101!';
CREATE ROLE
postgres=# grant all privileges on database cryptolottery to webapp;
GRANT
postgres=# create user lotteryuser with password 'cryptolotterry101!';
CREATE ROLE
postgres=# grant all privileges on database cryptolottery to lotteryuser;


CREATE TABLE events (
    GAME_ID INTEGER NOT NULL,
    EV_TYPE VARCHAR NOT NULL,
    PUNTER_ADDRESS VARCHAR,
    BET_VALUE NUMERIC(78,0),
    TX_HASH VARCHAR,
    OCCURRED_AT TIMESTAMP,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT now()
);