#!/bin/bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip
python3 -m pip install --upgrade pip
pip install django pillow djangorestframework djangorestframework-simplejwt
