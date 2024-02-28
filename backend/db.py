from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from gridfs import GridFS

import os
import io
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI_')
DATABASE = os.environ.get('DATABASE')


# Config PyMongo
client = MongoClient(MONGO_URI)
db = client[DATABASE]
mongo = PyMongo()

users_collection = db.users
fs = GridFS(db)

# create user 
def createUser(user_data):
    users_collection.insert_one(user_data)

# read user by googleId
def readUserByGoogleId(googleId):
    user =  users_collection.find_one({'googleId':googleId})
    if user: 
        user['_id'] = str(user['_id'])
        user['fileId'] = str(user['fileId'])
    return user

# update user
def updateUser(googleId, updates):
    print('updating user...')
    updated_data = {
        '$set':updates
    }
    users_collection.update_one({'googleId':googleId}, updated_data)

# delete user
def deleteUser(googleId):
    users_collection.delete_one({'googleId':googleId})

# upload file
def uploadFile(file, googleId):
    print("filename",file.filename)

    user = readUserByGoogleId(googleId)

    if(user['fileId'] != ''):
        deleteFile(user['fileId'], googleId)

    file_content = file.read()
    file_bytes = io.BytesIO(file_content)
    fileId = fs.put(file_bytes, filename=file.filename, contentType=file.content_type)
    updateUser(googleId, {'fileId': fileId})

# delete file
def deleteFile(fileId, googleId):
    object_id = ObjectId(fileId)
    fs.delete(object_id)

    updateUser(googleId, {'fileId': ''})

# read file by fileId
def readFileByFileId(fileId):
    object_id = ObjectId(fileId)
    file = fs.get(object_id)
    return file
    

def init_db(app):
    app.config['MONGO_URI'] = MONGO_URI

    mongo.init_app(app)
