#!/bin/bash

# Start Django backend
cd backend/
python3 ./manage.py runserver &

# Start React frontend
cd ../frontend/reactproj
npm start
