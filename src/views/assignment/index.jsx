import React, { lazy, useState, Suspense } from "react"
import controller from "../../controller.js"
import GoBack from "../../components/Back.jsx"
const Rows = lazy(() => import("./rows.jsx"))
import "./style.css"

const digitsOrMRegex = /[\dM{1}]/

export default function(props)
{
  let { title, classId, students, classAverage, assignments, loadAssignments } = props
  const defaultState = {
    assignmentTitle: '',
    maxPoints: 1,
    scores: {},
    error: false
  }
  const [state, setState] = useState({...defaultState})
  
  function handleAssignmentNameInput(assignmentTitle)
  {
    setState({...state, assignmentTitle})
  }
  
  function handleMaxPointsInput(maxPoints)
  {
    if (isNaN(maxPoints) || maxPoints > 999) return false
    setState({...state, maxPoints})
  }

  function handleScoreInput(studentId, studentScore)
  {
    if((!digitsOrMRegex.test(studentScore) && studentScore !== '') || parseInt(studentScore) > 999) {
      return false
    }
    if (!isNaN(parseInt(studentScore))){
      studentScore = parseInt(studentScore)
    } else if (studentScore.length > 1) {
      return false
    }

    let scores = {...state.scores}
    scores[studentId] = studentScore

    setState({ ...state, scores })
  }



  function checkInputFields(scores)
  {
    let errorCheck = false

    if (!state.assignmentTitle.length || !state.maxPoints ) {
      setState({ ...state, error: true })
      errorCheck = true
      alert('You need to fill out the highlighted fields')
      return false
    }

    if (assignments.find(((existingAssignment) => existingAssignment.title === state.assignmentTitle)))
    {
      alert('An assignment with this title already exists; please choose a different title.')
      return false
    }

    for (var score in scores) {
      if (score === '') {
        errorCheck = true
      }
    }

    if (!scores[scores.length - 1]) {
      return false
    } else {
      scores = scores.toString()
    }
    if(errorCheck) {
      setState({...state, error: true})
      return false
    } else {
      setState({...state, error: false})
    }
    return true
  }

  function submitScores(event)
  {
    event.preventDefault()

    let {assignmentTitle, maxPoints, scores} = state

    let inputError = false

    scores = students.map(
      student => {
        if (inputError) return

        if (scores[student.id] === 'M' || !isNaN(parseInt(scores[student.id]))) {
          if (scores[student.id] === 'M') scores[student.id] = 0 
          return `user,${assignmentTitle},${scores[student.id]},${maxPoints},${student.id},${classId}`
        } else {
          setState({ ...state, error: true })
          inputError = true
        }
      }
    )

    if (inputError) return
    inputError = !checkInputFields(assignmentTitle, scores)
    if (inputError) return

    controller.assignment.add(scores)
    .then(() => {
      setState({...defaultState})
      loadAssignments()
    })
    .catch((error) => console.error(error))
  }


  return (
    <>
      <header className="container-fluid">
        <GoBack url={'/' + classId} text={"New Assignment"}/>
        <h2 style={{color:'#777'}} className="text-center">{title}</h2>
        <h1 className="text-center" style={{boxSizing: 'border-box',padding: '.375rem .75rem', fontSize: '3rem',fontWeight: 'bolder'}}>{classAverage}</h1>
      </header>
      <div>
        <div className="container-fluid">
          <div className="text-center">
            <div style={{ 'display': 'inline-block' }}>
              <input type="text" autoFocus className={(!state.assignmentTitle && state.error) ? 'error' : undefined} value={state.assignmentTitle} placeholder={"Assignment Title"} onChange={({currentTarget}) => handleAssignmentNameInput(currentTarget.value)}/>
              out of&nbsp;
              <input id="maxPointsInput" type="number" min="1" max="999" value={state.maxPoints} onChange={({currentTarget}) => handleMaxPointsInput(parseInt(currentTarget.value))} /> points
            </div>
          </div>
          <table className="table table-hover table-striped">
            <thead>
              <tr className="d-flex">
                <th className="col-3"/>
                <th className="col-2">Name</th>
                <th className="col-2"/>
                <th className="col-2">Points</th>
                <th className="col-3"/>
              </tr>
            </thead>
            <tbody>
              <Suspense fallback={<tr className="d-flex">
                                    <td className="col-3"/>
                                    <td className="col-2">Loading...</td>
                                  </tr>}>
                <Rows data={students} scores={state.scores} max={state.maxPoints} handleScoreInput={handleScoreInput} error={state.error}/>
              </Suspense>
            </tbody>
          </table>
          <div className="text-center">
            <button className="btn btn-success" onClick={submitScores}>Submit</button>
          </div>
        </div>
      </div>
    </>
  )
}