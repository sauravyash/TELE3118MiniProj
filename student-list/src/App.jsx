import { useEffect, useState } from 'react'
import './App.css'
import 'bulma/css/bulma.min.css'
import { url } from './constants';

function App() {

  const [studentList, setStudentList] = useState([]);

  const [name, setName] = useState("");

  const [mark, setMark] = useState("");

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await fetch(`${url}/api/studentlist`)
    const result = await res.json()
    console.log(result);

    const data = []

    for (const student of result) {
      data.push({name: student, mark: await fetchStudentMark(student)})
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

  return (
    <div className='container'>
      <div className="field is-grouped">
        <p className="control">
          <input type="text" className="input" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" className="input" placeholder="Student Mark" value={mark} onChange={(e) => setMark(e.target.value)}/>
          <button className="button is-link" onClick={() => addNewStudent()}>Add Student</button>
        </p>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody>
          {
            studentList && studentList.map(student => {
              return (
                <tr key={student.name}>
                  <td>{student.name}</td>
                  <td>{student.mark}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default App
