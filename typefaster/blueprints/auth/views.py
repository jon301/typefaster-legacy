# -*- coding: utf-8 -*-

from flask import Blueprint, current_app, url_for, redirect, request, session
from ...extensions import oauth

auth = Blueprint('auth', __name__, url_prefix='/oauth')

facebook = oauth.remote_app(
    'facebook',
    request_token_params={'scope': 'email'},
    base_url='https://graph.facebook.com',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    app_key='OAUTH_FACEBOOK'
)

@auth.route('/')
def index():
    return redirect(url_for('.login'))


@auth.route('/login')
def login():
    return facebook.authorize(callback=url_for('.facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))


@auth.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')
    me = facebook.get('/me')
    current_app.logger.debug(me.data)
    return 'Logged in as id=%s name=%s redirect=%s' % \
        (me.data['id'], me.data['name'], request.args.get('next'))


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')
