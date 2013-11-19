from .attrdict import AttrDict
from ..extensions import mongo

from bson.objectid import ObjectId
from httplib import HTTPException

class User(AttrDict):
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self._id)

    # def __repr__(self):
    #     return '<User %r>' % (self.nickname)

def find_by_username(username):
    try:
        data = mongo.db.users.find_one_or_404({'username': username})
        # user = User(unicode(data['_id']), data['username'], data['password'])
        user = User(data)
        return user
    except HTTPException:
        return None

def find_by_email(email):
    try:
        data = mongo.db.users.find_one_or_404({'email': email})
        user = User(data)
        return user
    except HTTPException:
        return None


def find_by_id(userid):
    try:
        data = mongo.db.users.find_one_or_404({'_id': ObjectId(userid)})
        user = User(data)
        return user
    except HTTPException:
        return None
