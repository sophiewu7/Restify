#!/bin/bash
# sudo apt-get update
# sudo apt-get install -y python3 python3-pip
cd ./backend
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
python3 ./manage.py flush
python3 ./manage.py makemigrations
python3 ./manage.py migrate
python3 ./manage.py loaddata data.json
cd ..

sudo apt-get install nodejs
sudo apt-get install npm

cd frontend/reactproj
npm outdated
npm update
npm install react
npm install react-router-dom
npm install react-bootstrap bootstrap
npm install react-bootstrap-icons --save
npm install react-paginate

cd ../..

