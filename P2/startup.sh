#!/bin/bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip
pip install virtualenv
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install "django>=4.0.0,<4.1.0"
pip install djangorestframework 
pip install djangorestframework-simplejwt
pip install pillow
pip install pyyaml
pip install requests
pip install django-cors-headers
cd ./restify/restify
python ./manage.py makemigrations
python ./manage.py migrate