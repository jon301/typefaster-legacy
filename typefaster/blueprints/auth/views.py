# -*- coding: utf-8 -*-

from flask import Blueprint, current_app, url_for, redirect, request, session
from flask.ext.login import login_user

from ...extensions import mongo, oauth_facebook
from ...models.user import User, find_by_email

auth = Blueprint('auth', __name__, url_prefix='/oauth')

@auth.route('/')
def index():
    return redirect(url_for('.login'))


@auth.route('/login/')
def login():
    return oauth_facebook.authorize(callback=url_for('.facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))


@auth.route('/login/authorized/')
@oauth_facebook.authorized_handler
def facebook_authorized(resp):
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')

    # Get user information from Facebook
    me = oauth_facebook.get('/me')

    # Create user if nonexistent
    data = mongo.db.users.find_and_modify(
        query={ 'email': me.data['email'] },
        update={ '$setOnInsert': me.data },
        upsert=True,
        new=True
    )

    user = User(data)
    login_user(user)

    return redirect(url_for('frontend.home'))
    # return 'Logged in as id=%s name=%s redirect=%s' % \
    #     (me.data['id'], me.data['name'], request.args.get('next'))

@oauth_facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')
