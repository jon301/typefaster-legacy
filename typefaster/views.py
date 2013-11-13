# -*- coding: utf-8 -*-

from flask import Blueprint, current_app, g, render_template, request, abort

bp = Blueprint('frontend', __name__, )

@bp.url_defaults
def add_language_code(endpoint, values):
    if 'lang_code' in values or not g.lang_code:
        return
    values.setdefault('lang_code', g.lang_code)

@bp.url_value_preprocessor
def pull_lang_code(endpoint, values):
    accept_languages = current_app.config['ACCEPT_LANGUAGES'].keys()
    lang_code = None
    if values:
        lang_code = values.pop('lang_code', None)
    if lang_code not in accept_languages:
        abort(404)
    g.lang_code = lang_code

@bp.route('/')
def home():
    return render_template('home.html')

@bp.route('/about/')
def about():
    return render_template('about.html')


@bp.route('/random/<any("standard", "advanced", "digits", "disorder"):game>/')
def random(game):
    return render_template('random.html', game=game)

@bp.route('/persistent/<any("text", "alphabet", "alphabet-backwards", "pi-digits", "e-digits"):game>/')
def persistent(game):
    return render_template('persistent.html', game=game)

# @bp.route('/persistent/text/')
# @bp.route('/persistent/alphabet/')
# @bp.route('/persistent/alphabet-backwards/')
# @bp.route('/persistent/pi-digits/')
# @bp.route('/persistent/e-digits/')

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
