from flask import Flask
from api import api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True)