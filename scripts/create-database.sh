#!/bin/bash

# Create UmbracoDb database in SQL Server container
# This script is idempotent - safe to run multiple times

echo "Creating UmbracoDb database..."

docker exec umbraco-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P 'Jump2^Music$' \
  -C \
  -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'UmbracoDb') CREATE DATABASE UmbracoDb;"

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully (or already exists)"
else
    echo "✗ Failed to create database"
    exit 1
fi
