#!/bin/bash
set -e

echo "Running init script to create additional databases..."

# Create reservation_security database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE reservation_security'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'reservation_security')\gexec
    
    GRANT ALL PRIVILEGES ON DATABASE reservation_security TO $POSTGRES_USER;
EOSQL

echo "Database initialization complete!"
