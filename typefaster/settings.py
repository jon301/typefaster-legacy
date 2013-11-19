# -*- coding: utf-8 -*-

DEBUG = False
TESTING = False

# i18n
ACCEPT_LANGUAGES = {
    'fr': u'Français',
    'en': u'English'
}
BABEL_DEFAULT_LOCALE = 'en'
BABEL_DEFAULT_TIMEZONE = 'UTC'

SECRET_KEY = 'W\xd0\xcbE\xde\x90\xaeDl[\x12\xb7\xc4^\xdcJ\xe6\x05\xab\xfah;\xc5@'

JSLOGGER_LEVEL = 'WARN'

# DB
MONGO_DBNAME = 'typefaster-dev'

# FACEBOOK
OAUTH_FACEBOOK = {
    'consumer_key': '518674384895969',
    'consumer_secret': '6fbc90c00a3506012a085d65727e61f0',
    'request_token_params': {'scope': 'email'},
    'base_url': 'https://graph.facebook.com',
    'request_token_url': None,
    'access_token_url': '/oauth/access_token',
    'authorize_url': 'https://www.facebook.com/dialog/oauth',
}
