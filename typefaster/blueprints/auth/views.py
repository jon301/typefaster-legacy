# -*- coding: utf-8 -*-

from flask import Blueprint, current_app, url_for, redirect, request, session
from ...extensions import oauth_facebook

auth = Blueprint('auth', __name__, url_prefix='/oauth')

@auth.route('/')
def index():
    return redirect(url_for('.login'))


@auth.route('/login')
def login():
    return oauth_facebook.authorize(callback=url_for('.facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))

@auth.route('/logout')
def logout():
    session.pop('oauth_token', None)
    return redirect(url_for('frontend.home'))

@auth.route('/login/authorized')
@oauth_facebook.authorized_handler
def facebook_authorized(resp):
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')

    return redirect(url_for('frontend.home'))
    # me = oauth_facebook.get('/me')
    # return 'Logged in as id=%s name=%s redirect=%s' % \
    #     (me.data['id'], me.data['name'], request.args.get('next'))

@oauth_facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')
