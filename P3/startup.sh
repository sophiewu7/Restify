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

npm install react
npm install react-router-dom
npm install axios redux redux-devtools-extension react-redux redux-thunk
npm install react-bootstrap bootstrap
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/react-fontawesome@latest
