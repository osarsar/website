#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn server
echo "Starting Gunicorn server..."
gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application
