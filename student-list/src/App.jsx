import { useEffect, useState } from 'react'
import './App.css'
import 'bulma/css/bulma.min.css'
import { url } from './constants';

function App() {

  const [studentList, setStudentList] = useState([]);
  const [name, setName] = useState("");
  const [mark, setMark] = useState("");

  // For editing
  const [editingName, setEditingName] = useState(null); // which student is being edited (using name as id)
  const [editValues, setEditValues] = useState({ mark: "" });



  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const res = await fetch(`${url}/api/studentlist`)
    const result = await res.json()
    console.log(result);

    const data = []

    for (const student of result) {
      data.push({ name: student, mark: await fetchStudentMark(student) })
    }

    setStudentList(data)

  }

  const fetchStudentMark = async (student) => {
    console.log("Student mark name:", student);

    const res = await fetch(`${url}/api/studentmark/${student}`)
    const result = await res.json();

    return result.mark
  }

  const addNewStudent = async () => {
    const data = new FormData();
    data.append("student", name);
    data.append("mark", mark)
    const res = await fetch(`${url}/api/student`, {
      method: "POST",
      body: data
    })

    console.log(res);
    fetchData()
  }

  const handleEditClick = async (student) => {
    setEditingName(student.name);
    setEditValues({ name: student.name, mark: student.mark });
  };

  const handleConfirmClick = async () => {
    
    const data = new FormData();
    data.append("mark", editValues.mark);
    const res = await fetch(`${url}/api/student/${editValues.name}`, {
      method: "PUT",
      body: data
    })
    
    console.log(res);
    setStudentList((prev) =>
      prev.map((s) =>
        s.name === editingName ? { ...s, name: editValues.name, mark: editValues.mark } : s
      )
    );
    setEditingName(null);
    fetchData();
  };

  const handleCancelEdit = () => {
    setEditingName(null);
  };

  const handleDelete = async (student) => {
    setStudentList((prev) => prev.filter((s) => s.name !== student.name));
    await fetch(`${url}/api/student/${student.name}`, {
      method: "DELETE"
    })
  };

  return (
    <div className="container is-flex is-flex-direction-column is-justify-content-center">
      <div className="field is-grouped">
        <p className="control">
          <input
            type="text"
            className="input"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Student Mark"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
          />
          <button className="button is-link" onClick={addNewStudent}>
            Add Student
          </button>
        </p>
      </div>

      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mark</th>
            <th className="has-text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {studentList &&
            studentList.map((student) => {
              const isEditing = editingName === student.name;

              return (
                <tr key={student.name + (new Date().toISOString())}>
                  {isEditing ? (
                    <>
                      <td>{student.name}</td>
                      <td>
                        <input
                          className="input is-small"
                          type="number"
                          value={editValues.mark}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, name: editingName, mark: e.target.value }))
                          }
                        />
                      </td>
                      <td className="has-text-right">
                        <button
                          className="button is-small is-success mr-2"
                          onClick={handleConfirmClick}
                        >
                          Confirm
                        </button>
                        <button
                          className="button is-small"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Read-only cells */}
                      <td>{student.name}</td>
                      <td>{student.mark}</td>
                      <td className="has-text-right">
                        <button
                          className="button is-small is-info mr-2"
                          onClick={() => handleEditClick(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="button is-small is-danger"
                          onClick={() => handleDelete(student)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  )
}

export default App
