import React, { lazy, useState, useEffect, Suspense } from "react"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import controller from "../../controller.js"
import Header from "./header/index.jsx"
const ViewStudents = lazy(() => import("./students/index.jsx"))
const ViewAssignments = lazy(() => import("./assignments/index.jsx"))
const StudentView = lazy(() => import("../student/index.jsx"))
const AssignmentInput = lazy(() => import("../assignment/index.jsx"))
const NotFound = lazy(() => import("../404/index.jsx"))

export default function(props)
{
  let { match, title, toggleModal, setClasses } = props
  const defaultState = {
    mounted: false,
    view: 'students',
    students: [],
    studentAverages: {},
    assignments: [],
    assignmentAverages: {},
    classAverage: 'Calculating...',
  }
  const [ state, setState ] = useState({...defaultState}),
  classId = match.params.classId
  if (title === null) title = 'Loading...'

  useEffect( () => {
    if (!state.mounted) setState({...state, mounted: true})
  }, [state.mounted])

  useEffect( () => {
    if (state.mounted && classId !== " ") {
      loadStudents()
    }
  }, [classId, state.mounted])

  useEffect( () => {
    if (state.students.length) {
      loadAssignments()
    }
  }, [state.students.length])

  useEffect( () => {
    if (state.assignments.length) calculateStudentAverages()
  }, [state.assignments])

  useEffect( () => {
    if (Object.keys(state.studentAverages).length) calculateClassAverage()
  }, [state.studentAverages])

  useEffect( () => {
    if (state.classAverage !== 'Calculating...') calculateAssignmentAverages()
  }, [state.classAverage])

  if (title === undefined) return <NotFound/>


  function loadStudents()
  {
    controller.student.load(classId)
    .then(({data}) => {
      setState({
        ...state,
        view: 'students',
        students: data,
        classAverage: data.length ? 'Calculating...' : 'N/A'
      })
    })
    .catch((error) => console.error(error))
  }

  function loadAssignments()
  {
    controller.assignment.load(classId)
    .then(({data}) => {
      setState({
        ...state,
        assignments: data,
        classAverage: !data.length ? 'N/A' : 'Calculating...'
      })
    })
    .catch((error) => console.error(error))

  }

  
  function calculateStudentAverages()
  {
    let studentAverages = {}
    let assignments = [...state.assignments]
    state.students.forEach( (student) => {
      let totalPointsScored = 0
      let totalPointsPossible = 0
      
      assignments = assignments.filter((assignment) => {
        if (assignment.student_id != student.id) return true
        if (!isNaN(assignment.score)) totalPointsScored += parseInt(assignment.score)
        totalPointsPossible += parseInt(assignment.totalpoints)
        return false
      })

      let average = totalPointsPossible !== 0 ? (totalPointsScored / totalPointsPossible * 100).toFixed(2) : 'N/A' 

      studentAverages[student.id] = average
    })

    setState({...state,studentAverages})
  }

  
  function calculateClassAverage() {
    var totalPercentage = 0
    var numberOfPercentages = 0
  
    for(let studentAverage in state.studentAverages) {
      if (state.studentAverages[studentAverage] !== 'N/A') {
        totalPercentage += parseFloat(state.studentAverages[studentAverage])
        ++numberOfPercentages
      }
    }
  
    if (!numberOfPercentages) {
      totalPercentage = 'N/A'
    } else if (isNaN(totalPercentage / numberOfPercentages)) return false
    
    totalPercentage = (totalPercentage / numberOfPercentages).toFixed(2) + '%'
  
    setState({...state,classAverage: totalPercentage})
  }

  function calculateAssignmentAverages()
  {
    let assignments = {}
    // same assignment for each student, need to select same assignment
    state.assignments.forEach(assignment => {
      assignments[assignment.title] = true
    })

    Object.keys(assignments).forEach(title => {
      let givenAssignment = state.assignments.filter(assignment => assignment.title === title)
      let totalPoints = 0
      let scoredPoints = 0

      givenAssignment.forEach(assignment => {
        totalPoints += parseInt(assignment.totalpoints)
        scoredPoints += parseInt(assignment.score)
      })
      assignments[title] = (scoredPoints/totalPoints * 100).toFixed(2) + '%'
    })

    setState({...state,assignmentAverages: assignments})
  }


  function sortByName()
  {
    let students = [...state.students]
    
    let beforeSort = JSON.stringify({students})
    students.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
    let afterSort = JSON.stringify({students})
    
    if (beforeSort === afterSort)
    {
      students.sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1)
    }
    setState({...state, students})
  }


  function sortByGrade()
  {
    let students = [...state.students]
    let beforeSort = JSON.stringify({students})
    students.sort((a,b) => {
      if (isNaN(parseFloat(state.studentAverages[a.id]))) return false
      if (isNaN(parseFloat(state.studentAverages[b.id]))) return true
      return parseFloat(state.studentAverages[a.id]) > parseFloat(state.studentAverages[b.id]) ? 1 : -1
    })
    let afterSort = JSON.stringify({students})

    if (beforeSort === afterSort)
    students.sort((a,b) => {
      if (isNaN(parseFloat(state.studentAverages[b.id]))) return false
      if (isNaN(parseFloat(state.studentAverages[a.id]))) return true
      return parseFloat(state.studentAverages[a.id]) < parseFloat(state.studentAverages[b.id]) ? 1 : -1
    })
    setState({...state, students})
  }

  function toggleView()
  {
    if (state.view === 'assignments') return setState({...state, view:'students'})
    setState({...state, view:'assignments'})
  }

  function deleteStudentCallback(studentId)
  {
    const students = state.students.filter(student => student.id !== studentId)
    setState({...state, students})
  }

  function addStudentCallback(data, name)
  {
    const newStudentObj = {'id': data.insertId, name }
    const students = [...state.students]
    students.push(newStudentObj)
    setState({...state,students})
  }
  return (
    <Switch>
      <Route exact path={`/${classId}`} render={(props) => 
          <>
            <Header {...props} view={state.view} title={title} classId={classId} assignmentAverages={state.assignmentAverages} classAverage={state.classAverage} students={state.students} setClasses={setClasses} toggleView={toggleView} toggleModal={toggleModal}/>
            {
              state.view === 'students' ?
              <Suspense fallback={<div>Loading...</div>}>
                <ViewStudents {...props} classId={classId} students={state.students} assignments={state.assignments} averages={state.studentAverages} toggleModal={toggleModal} addStudentCallback={addStudentCallback} deleteStudentCallback={deleteStudentCallback} sort={{sortByName, sortByGrade}}/>
              </Suspense> :
              <Suspense fallback={<div>Loading...</div>}>
                <ViewAssignments {...props} assignments={state.assignments} averages={state.assignmentAverages}/>
              </Suspense>
            }
          </>
      } />
      <Route exact path={`/${classId}/assignment`} render={(props) =>
          <Suspense fallback={<div>Loading...</div>}>
            <AssignmentInput {...props} assignments={state.assignments} loadAssignments={loadAssignments} students={state.students} studentAverages={state.studentAverages} classAverage={state.classAverage} classId={classId} title={title}/>
          </Suspense>}
      />
      <Route path={`/${classId}/:studentId`} render={(props) =>
          <Suspense fallback={<div>Loading...</div>}>
            <StudentView {...props} students={state.students} classId={classId} title={title} loadAssignments={loadAssignments} studentAverage={state.studentAverages[props.match.params.studentId]} assignments={state.assignments.filter(assignment => assignment.student_id == props.match.params.studentId)} />
          </Suspense>}
      />
    </Switch>
  )
}