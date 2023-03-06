#!/bin/bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip
pip3 install virtualenv
virtualenv venv
source venv/bin/activate
pip3 install django pillow djangorestframework djangorestframework-simplejwt
