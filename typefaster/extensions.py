# -*- coding: utf-8 -*-

from flask.ext.pymongo import PyMongo
mongo = PyMongo()

from flask_oauthlib.client import OAuth
oauth = OAuth()
oauth_facebook = oauth.remote_app('facebook',
    request_token_params={'scope': 'email'},
    app_key='OAUTH_FACEBOOK'
)

# from flask.ext.sqlalchemy import SQLAlchemy
# db = SQLAlchemy()

# from flask.ext.mail import Mail
# mail = Mail()

# from flask.ext.cache import Cache
# cache = Cache()

from flask.ext.login import LoginManager
login_manager = LoginManager()

# from flask.ext.openid import OpenID
# oid = OpenID()
