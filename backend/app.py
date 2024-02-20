from flask import Flask
from flask_cors import CORS
from api import api
from db import init_db

from openai import OpenAI

client = OpenAI()

app = Flask(__name__)
CORS(app)

# Initialize DB
init_db(app)

# Register api blueprint
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True)