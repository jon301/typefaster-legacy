# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, g
from flask.ext.babel import Babel

import os

# from .config import DefaultConfig
# from .user import User, user
# from .settings import settings
# from .frontend import frontend
# from .api import api
# from .admin import admin
# from .extensions import db, mail, cache, login_manager, oid
from .extensions import mongo
# from .utils import INSTANCE_FOLDER_PATH


# For import *
# __all__ = ['create_app']

# DEFAULT_BLUEPRINTS = (
#     frontend,
#     user,
#     settings,
#     api,
#     admin,
# )

from typefaster.blueprints import root, frontend
from datetime import datetime


def create_app(app_name=None, blueprints=None, config=None):
    """Create a Flask app."""

    # if app_name is None:
    #     app_name = DefaultConfig.PROJECT
    # if blueprints is None:
    #     blueprints = DEFAULT_BLUEPRINTS

    app = Flask(app_name)

    configure_app(app, config)
    configure_hook(app)
    configure_blueprints(app, blueprints)
    configure_extensions(app)
    configure_logging(app)
    configure_template_filters(app)
    configure_template_globals(app)
    configure_error_handlers(app)

    return app


def configure_app(app, config=None):
    """Different ways of configurations."""

    # http://flask.pocoo.org/docs/api/#configuration
    # app.config.from_object(DefaultConfig)

    # http://flask.pocoo.org/docs/config/#instance-folders
    # app.config.from_pyfile('production.cfg', silent=True)

    # if config:
    #     app.config.from_object(config)

    # Use instance folder instead of env variables to make deployment easier.
    #app.config.from_envvar('%s_APP_CONFIG' % DefaultConfig.PROJECT.upper(), silent=True)

    app.config.from_object('typefaster.settings')
    app.config.from_envvar('TYPEFASTER_SETTINGS')


def configure_extensions(app):
    # flask-sqlalchemy
    # db.init_app(app)

    # flask-pymongo
    mongo.init_app(app)

    # flask-mail
    # mail.init_app(app)

    # flask-cache
    # cache.init_app(app)

    # flask-babel
    babel = Babel(app)

    @babel.localeselector
    def get_locale():
        return g.lang_code if hasattr(g, 'lang_code') else request.accept_languages.best_match(app.config['ACCEPT_LANGUAGES'].keys())

    # flask-login
    # login_manager.login_view = 'frontend.login'
    # login_manager.refresh_view = 'frontend.reauth'

    # @login_manager.user_loader
    # def load_user(id):
    #     return User.query.get(id)
    # login_manager.setup_app(app)

    # flask-openid
    # oid.init_app(app)


def configure_blueprints(app, blueprints):
    """Configure blueprints in views."""

    # for blueprint in blueprints:
    #     app.register_blueprint(blueprint)

    app.register_blueprint(root)

    app.register_blueprint(frontend, url_defaults={'lang_code': app.config['BABEL_DEFAULT_LOCALE']})
    app.register_blueprint(frontend, url_prefix='/<lang_code>')


def configure_template_filters(app):

    @app.template_filter()
    def format_date(value, format='%Y-%m-%d'):
        return value.strftime(format)


def configure_template_globals(app):
    app.jinja_env.globals.update(utcnow=datetime.utcnow())


def configure_logging(app):
    """Configure file(info) and email(error) logging."""

    if app.debug or app.testing:
        # Skip debug and test mode. Just check standard output.
        return

    import logging

    # Set info level on logger, which might be overwritten by handers.
    # Suppress DEBUG messages.
    app.logger.setLevel(logging.INFO)



def configure_hook(app):
    @app.before_request
    def before_request():
        pass


def configure_error_handlers(app):

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('errors/404.html', error=error), 404

    @app.errorhandler(500)
    def server_error(error):
        return render_template("errors/500.html", error=error), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        return render_template("errors/403.html", error=error), 403
