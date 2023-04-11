#!/bin/bash
# sudo apt-get update
# sudo apt-get install -y python3 python3-pip
pip3 install virtualenv
python3 -m venv venv
source venv/bin/activate
pip3 install --upgrade pip
pip3 install "django>=4.0.0,<4.1.0"
pip3 install djangorestframework 
pip3 install djangorestframework-simplejwt
pip3 install pillow
pip3 install pyyaml
pip3 install requests
pip3 install django-cors-headers
pip3 install exc
cd ./restify
python3 ./manage.py makemigrations
python3 ./manage.py migrate
cd ..