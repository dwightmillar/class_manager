import React from "react";
import ReactDOM from "react-dom";
import { useAsync } from 'react-async';
import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      view : 'class',
      classes : [],
      students: [],
      assignments: '',
      activeClass: 1,
      newStudent: '',
      newStudentID: '',
      newAssignment: '',
      maxPoints: '',
      studentScores: {}
    };
    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.viewStudent = this.viewStudent.bind(this);
    this.addStudent = this.addStudent.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
    this.viewClass = this.viewClass.bind(this);
    this.viewAssignmentInput = this.viewAssignmentInput.bind(this);
  }

  componentDidMount() {
    this.retrieveClasses();
  }

  retrieveClasses() {
    fetch("/api/getclasses", {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({'classes': responseObj.data}));
  }

  retrieveStudents(event) {
    const id = event.target.id;
    fetch("/api/getstudents?class_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'activeClass': id ,'students': responseObj.data }));
  }

  viewStudent(event) {
    const id = event.target.parentElement.id;
    fetch("/api/getassignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'assignments': responseObj.data }));
    this.setState({ view: 'student' });
  }

  viewClass() {
    this.setState({ view: 'class', assignments: '' });
  }

  viewAssignmentInput() {
    this.setState({ view: 'assignmentinput'});
  }

  addStudent(event) {
    event.preventDefault();
    let newID = null;
    fetch("/api/addstudent", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newStudent,
        class_id: this.state.activeClass
      })
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'newStudentID': responseObj.data.insertId}));
    const newStudentObj = [{'class_id': this.state.activeClass, 'id': this.state.newStudentID, 'name': this.state.newStudent}];
    this.setState({'students': this.state.students.concat(newStudentObj)});
    this.setState({'newStudent': '', 'newStudentID': ''})
  }

  addAssignment(event) {
    event.preventDefault();
    const title = this.state.newAssignment;
    const totalpoints = this.state.maxPoints;
    const studentScores = this.state.studentScores;
    let scores = this.state.students.map(
      student => `('${title}', ${studentScores[student.id]}, ${totalpoints}, ${student.id})`
    ).toString();

    console.log(scores);
    fetch("/api/addassignment", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        scores: scores
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))

    this.setState({ view: 'class', newAssignment: '', maxPoints: '', studentScores: {}})
  }

  handleStudentInput(event) {
    this.setState({'newStudent' : event.target.value})
  }

  handleAssignmentInput(event) {
    this.setState({ 'newAssignment': event.target.value })
  }

  handleMaxPointsInput(event) {
    this.setState({ 'maxPoints': event.target.value })
  }

  handleScoreInput(event) {
    const studentID = event.target.id;
    let student = this.state.studentScores;
    const studentScore = parseInt(event.target.value);
    student[studentID] = studentScore;

    this.setState({ studentScores: student});
  }

  render() {
    return(
      <div>
        <Class view={this.state.view} classNames={this.state.classes} studentData={this.state.students} retrieveStudents={this.retrieveStudents} viewStudent={this.viewStudent} viewAssignmentInput={this.viewAssignmentInput}
        handleStudentInput={this.handleStudentInput} studentName={this.state.newStudent} addStudent={this.addStudent}/>
        <Student view={this.state.view} data={this.state.assignments} retrieveAssignments={this.retrieveAssignments} viewClass={this.viewClass}/>
        <AssignmentInput view={this.state.view} studentData={this.state.students} newAssignment={this.state.newAssignment} handleAssignmentInput={this.handleAssignmentInput} maxPoints={this.state.maxPoints} scores={this.state.studentScores} handleMaxPointsInput={this.handleMaxPointsInput} handleScoreInput={this.handleScoreInput} addAssignment={this.addAssignment}/>
      </div>
    )
  }
}


const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
