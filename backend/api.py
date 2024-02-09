from flask import request, Blueprint
from PyPDF2 import * 
import io

api = Blueprint('api', __name__)

@api.route("/resume", methods=['POST'])
def uploadFile():
    file = request.data
    reader = PdfReader(io.BytesIO(file))
    text = reader.pages[0].extract_text()
    return text;