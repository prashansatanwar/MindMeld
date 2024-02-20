from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.objectid import ObjectId

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI_')
DATABASE = os.environ.get('DATABASE')

# Config PyMongo
client = MongoClient(MONGO_URI)
db = client[DATABASE]
mongo = PyMongo()
users_collection = db.users

# create user 
def createUser(user_data):
    
    users_collection.insert_one(user_data)

# read user by authToken
def readUserByGoogleId(googleId):
    user =  users_collection.find_one({'googleId':googleId})
    if user: 
        user['_id'] = str(user['_id'])
    return user

# update 
def updateUser(googleId, updates):
    updated_data = {
        '$set':updates
    }
    users_collection.update_one({'googleId':googleId}, updated_data)

# delete user
def deleteUser(googleId):
    users_collection.delete_one({'googleId':googleId})

def init_db(app):
    app.config['MONGO_URI'] = MONGO_URI

    mongo.init_app(app)
