# -*- coding: utf-8 -*-

from flask import Blueprint, current_app, g, render_template, request, abort
from ...extensions import mongo, oauth_facebook

frontend = Blueprint('frontend', __name__)

@frontend.url_defaults
def add_language_code(endpoint, values):
    if 'lang_code' in values or not hasattr(g, 'lang_code') or not g.lang_code:
        return
    values.setdefault('lang_code', g.lang_code)

@frontend.url_value_preprocessor
def pull_lang_code(endpoint, values):
    accept_languages = current_app.config['ACCEPT_LANGUAGES'].keys()
    lang_code = None
    if values:
        lang_code = values.pop('lang_code', None)
    if lang_code not in accept_languages:
        abort(404)
    g.lang_code = lang_code

@frontend.route('/')
def home():
    me = oauth_facebook.get('/me')
    current_app.logger.debug(me.data)
    return render_template('home.html')

@frontend.route('/about/')
def about():
    return render_template('about.html')


@frontend.route('/random/<any("standard", "advanced", "digits", "disorder"):game>/')
def random(game):
    return render_template('random.html', game=game)

@frontend.route('/persistent/<any("text", "alphabet", "alphabet-backwards", "pi-digits", "e-digits"):game>/')
def persistent(game):
    return render_template('persistent.html', game=game)

# @frontend.route('/persistent/text/')
# @frontend.route('/persistent/alphabet/')
# @frontend.route('/persistent/alphabet-backwards/')
# @frontend.route('/persistent/pi-digits/')
# @frontend.route('/persistent/e-digits/')

# /
# /random/standard/
# /random/advanced/
# /random/digits/
# /random/disorder/
# /persistent/text/
# /persistent/alphabet/
# /persistent/alphabet-backwards/
# /persistent/pi-digits/
# /persistent/e-digits/
# /multiplayer

# /<username>

# /login
# /logout
# /reset-password
