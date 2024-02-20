from datetime import datetime
from flask import request, Blueprint, jsonify
from PyPDF2 import * 
import io
import os
from dotenv import load_dotenv
from openai import OpenAI

from db import *

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

api = Blueprint('api', __name__)

# temp data storage
resume_text = ""


@api.route("/questions", methods=['GET'])
def getQuestions():
    print(resume_text)
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an Interviewer. Generate 5 technical interview questions based on the resume transcript provided. The questions should be returned in an array format. The questions should be technical questions and not be generic questions. Ensure the questions do not have more than 10 words and are in context to the resume."},
            {"role": "user", "content": resume_text}
        ]
    )

    completion_text = completion.choices[0].message.content

    return  jsonify({"questions": completion_text})


# add User
@api.route("/addUser", methods=['POST'])
def addUser():
    data = request.get_json()
    new_user = {
        'googleId':data['googleId'],
        'name':data['name'],
        'email':data['email'],
        'create_date': datetime.now()
    }
    createUser(new_user)
    return jsonify({'message':'User added successfully'})

# get user by Token
@api.route("/<string:googleId>", methods=['GET'])
def getUser(googleId):
    user = readUserByGoogleId(googleId)
    if user:
        return jsonify(user)
    return jsonify({'message': 'User does not exist'})
