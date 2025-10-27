from flask import Flask, request
from flask_cors import CORS

database = {}

app = Flask(__name__)

CORS(app)

@app.route("/api/student", methods=['POST'])
def student():
    name = request.form['student']
    try:
        mark = int(request.form['mark'])
        database[name] = mark
    except:
        Flask.abort(400)
    return database


@app.route("/api/studentlist", methods=['GET'])
def studentlist():
    students = []
    for student in database:
        students.append(student)
    return students

@app.route("/api/studentmark/<studentName>", methods=['GET'])
def studentmark(studentName):
    if database[studentName] != None:
        return {"mark": database[studentName]}
    else:
        Flask.abort(404)