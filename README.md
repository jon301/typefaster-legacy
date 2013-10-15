# TypeFaster

## Dev environment installation

### Requirements

* sudo apt-get install git python-setuptools python-dev build-essential python-pip python-virtualenv libcurl4-openssl-dev nodejs libjson-perl liblocale-po-perl
* sudo npm install -g grunt-cli bower

### Create a virtualenv (optional)

* pip install virtualenvwrapper

Add these lines in ~/.bashrc :

    export WORKON_HOME=~/envs
    source /usr/local/bin/virtualenvwrapper.sh

* source ~/.bashrc
* mkdir ~/envs; cd ~/envs;
* mkvirtualenv typefaster
* workon typefaster

### Clone repository

* git clone git@github.com:jon301/typefaster.git
* cd typefaster

### Install dependencies

####  Python packages

* pip install -r requirements.txt

####  Node packages

* bower intall & npm install

### Project commands

#### Create a development server witch SCSS & Coffeescript watch for changes
* grunt server

#### Compile project for deployment
* grunt

#### Compile PO translations
* cd /tmp
* git clone git@github.com:jon301/babel-underscore_js.git
* python setup.py install

From root project

* grunt babel
