# -*- coding: utf-8 -*-

from flask import Blueprint, render_template, redirect, url_for, session
from flask.ext.login import logout_user

root = Blueprint('root', __name__)

@root.route('/scripts/tests/')
def js_tests():
    return render_template('test_runner.html')

@root.route('/logout/')
def logout():
    session.pop('oauth_token', None)
    logout_user()
    return redirect(url_for('frontend.home'))
