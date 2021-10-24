import React, { lazy, useState, useEffect, Suspense } from "react"
import controller from "../../controller.js"
import GoBack from "../../components/Back.jsx"
const Rows = lazy(() => import("./rows.jsx"))
const NotFound = lazy(() => import("../404/index.jsx"))

const digitsOrMRegex = /[\dM]/

export default function(props)
{
  let { classId, assignments, studentAverage, students, loadAssignments } = props
  let name = students.find(student => student.id == props.match.params.studentId)?.name
  if (name === undefined) return <NotFound/>
  
  const [state, setState] = useState({
    mounted: false,
    scores: {}
  })

  useEffect( () => {
    if (state.mounted) return

    let scores = {}
    assignments.map(assignment => {
      scores[assignment.id] = assignment.score
    })
    setState({...state, mounted: true, scores})
  }, [state.mounted])


  function handleScoreChange(id, score) {  
    if(!digitsOrMRegex.test(score) && score !== '') return
    
    if (!isNaN(parseInt(score))) score = parseInt(score)
    
    let scores = state.scores
    scores[id] = score
    setState({ ...state, scores })
  }

  function updateScores()
  {
    const scores = state.scores
    if (JSON.stringify(scores) !== '{}') {
      controller.assignment.update(scores)
      .then( loadAssignments )
      .catch((error) => console.error(error))
    }
  }

  return (
    <>
      <header className="container-fluid">
        <GoBack url={'/' + classId} text={"Student"}/>
        <h1 className="text-center" style={{fontSize: '3rem',fontWeight: 'bolder'}}>{name}</h1>
        <h2 className="text-center" style={{fontSize: '2rem', color: '#777'}}>{studentAverage}%</h2>
      </header>
      <div className="container-fluid">
        <table className="table table-hover">
          <thead>
            <tr className="d-flex">
              <th className="col-3"/>
              <th className="col-2">Title</th>
              <th className="col-2"/>
              <th className="col-2">Score</th>
              <th className="col-3"/>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<tr className="d-flex">
                                  <td className="col-3"/>
                                  <td className="col-2">Loading...</td>
                                </tr>}>
              <Rows assignments={assignments} scores={state.scores} handleScoreChange={handleScoreChange}/>
            </Suspense>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button className="btn btn-primary" onClick={updateScores}>Update Scores</button>
      </div>
    </>
  )
}