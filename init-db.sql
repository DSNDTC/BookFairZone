-- Create additional database for security service
-- This script runs automatically on first PostgreSQL initialization

-- The default database 'reservationdb' is already created via POSTGRES_DB env var
-- We just need to create the security database

CREATE DATABASE reservation_security;
CREATE DATABASE userdb;

-- Grant privileges to the main user
GRANT ALL PRIVILEGES ON DATABASE reservation_security TO myuser;
