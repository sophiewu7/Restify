#!/bin/bash
cd ./restify
python ./manage.py makemigrations
python ./manage.py migrate
python ./manage.py runserver