#!/bin/bash

# Function to wait for database to be ready
wait_for_db() {
    echo "Waiting for database to be ready..."
    until docker exec trustfund_test_db pg_isready -U postgres > /dev/null 2>&1; do
        sleep 1
    done
    echo "Database is ready!"
}

# Function to create test database
setup_test_db() {
    echo "Setting up test database..."
    docker-compose -f docker-compose.test.yml up -d
    wait_for_db
}

# Function to view database data
view_db_data() {
    echo "Connecting to database..."
    docker exec -it trustfund_test_db psql -U postgres -d trustfund_test
}

# Function to tear down test database
teardown_test_db() {
    echo "Tearing down test database..."
    docker-compose -f docker-compose.test.yml down -v
}

case "$1" in
    "up")
        setup_test_db
        ;;
    "down")
        teardown_test_db
        ;;
    "view")
        view_db_data
        ;;
    *)
        echo "Usage: $0 {up|down|view}"
        exit 1
        ;;
esac 