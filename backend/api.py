from datetime import datetime
import json
from flask import request, Blueprint, jsonify, send_file
from PyPDF2 import * 
import io
import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
import re

from db import *

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

api = Blueprint('api', __name__)

@api.route("/<string:googleId>/resume/<string:fileId>/questions", methods=['GET'])
def getQuestions(googleId,fileId):
    file = readFileByFileId(fileId)
    reader = PdfReader(io.BytesIO(file.read()))
    text = reader.pages[0].extract_text()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an Interviewer. Generate 5 technical interview questions based on the resume transcript provided. The questions should be returned in an array format. The questions should be technical questions and not be generic questions. Ensure the questions do not have more than 10 words and are in context to the resume."},
            {"role": "user", "content": text}
        ]
    )

    completion_text = completion.choices[0].message.content
    questions = re.findall(r'"([^"]*)"', ''.join(completion_text))
    print(questions)

    return  jsonify({"questions": questions})

@api.route("/<string:fileId>/analyzeResponse", methods=['POST'])
def analyzeResponse(fileId):
    req = request.get_json()
    file = readFileByFileId(fileId)
    reader = PdfReader(io.BytesIO(file.read()))
    resume_transcript = reader.pages[0].extract_text()
    data = {
        'questions':req['questions'],
        'response':req['answers'],
        'resume_transcript': resume_transcript
    }
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are conducting an interview. After asking the provided questions, evaluate the candidate's response provided and provide detailed feedback for each answer. Ensure the feedback is specific and constructive, and return it in an array format corresponding to the questions. Make sure you only return the feedback."},
            {"role": "user", "content": json.dumps(data)}
        ]
    )

    completion_text = completion.choices[0].message.content
    response = re.findall(r'"([^"]*)"', ''.join(completion_text))
    print(response)

    return jsonify({"feedback": response})


# add User
@api.route("/addUser", methods=['POST'])
def addUser():
    data = request.get_json()
    new_user = {
        'googleId':data['googleId'],
        'name':data['name'],
        'email':data['email'],
        'fileId': '',
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

# upload resume
@api.route("/<string:googleId>/resume", methods=['POST'])
def uploadResume(googleId):
    file = request.files['file']
    uploadFile(file, googleId)
    
    return jsonify({'message': 'Resume uploaded successfully'})

# delete resume
@api.route("/<string:googleId>/resume/<string:fileId>", methods=['DELETE'])
def deleteResume(googleId, fileId):
    try:
        deleteFile(fileId, googleId)
        return jsonify({'message': 'Resume deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# get resume
@api.route("/<string:googleId>/resume/<string:fileId>", methods=['GET'])
def getResume(googleId,fileId):
    try:
        file = readFileByFileId(fileId)
        if file:
            filename = file.filename
            file_content = base64.b64encode(file.read()).decode('utf-8')

            return jsonify({'filename': filename, 'content': file_content})
        else:
            return jsonify({'message': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500