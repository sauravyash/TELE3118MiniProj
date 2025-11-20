from flask import Flask, abort, request
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
        abort(400)
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
        abort(404)
        
### EXTRA
@app.route("/api/student/<studentName>", methods=['PUT'])
def edit_student(studentName):
    if studentName not in database:
        abort(404)
    try:
        mark = int(request.form['mark'])
        database[studentName] = mark
        print("edited:", studentName, mark)
    except (KeyError, ValueError) as e:
        print(e)
        abort(400)

    database[studentName] = mark
    return {"name": studentName, "mark": database[studentName]}

@app.route("/api/student/<studentName>", methods=['DELETE'])
def delete_student(studentName):
    if studentName not in database:
        abort(404)

    deleted_mark = database.pop(studentName)
    return {"name": studentName, "deleted": True, "mark": deleted_mark}
        
        
if __name__ == "__main__":
    # host="127.0.0.1" means localhost only
    # port=3000 starts the server on port 3000
    app.run(host="127.0.0.1", port=3000, debug=True)