#!/bin/bash
cd ./restify/restify
python ./manage.py makemigrations
python ./manage.py migrate
python ./manage.py runserver