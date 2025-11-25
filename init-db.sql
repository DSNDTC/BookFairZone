-- Create additional database for security service
-- This script runs automatically on first PostgreSQL initialization

-- Create all required databases
CREATE DATABASE reservationdb;
CREATE DATABASE reservation_security;
CREATE DATABASE userdb;

-- Grant privileges to the main user
GRANT ALL PRIVILEGES ON DATABASE reservationdb TO myuser;
GRANT ALL PRIVILEGES ON DATABASE reservation_security TO myuser;
GRANT ALL PRIVILEGES ON DATABASE userdb TO myuser;
