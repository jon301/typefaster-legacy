from flask import Flask, g, render_template, request, redirect, url_for
from flask.ext.babel import Babel

app = Flask(__name__)
app.config.from_object('typefaster.settings')
app.config.from_envvar('TYPEFASTER_SETTINGS')

babel = Babel(app)

@babel.localeselector
def get_locale():
    return g.lang_code if hasattr(g, 'lang_code') else request.accept_languages.best_match(app.config['ACCEPT_LANGUAGES'].keys())

@app.errorhandler(404)
def page_not_found(error):
    return render_template('errors/404.html', error=error), 404

@app.errorhandler(500)
def server_error(error):
    return render_template("errors/500.html", error=error), 500

from typefaster.views import bp
app.register_blueprint(bp, url_defaults={'lang_code': app.config['BABEL_DEFAULT_LOCALE']})
app.register_blueprint(bp, url_prefix='/<lang_code>')
