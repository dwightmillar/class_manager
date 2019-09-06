import React from "react";
import ReactDOM from "react-dom";
import Class from "./Class.jsx";
import Student from "./Student.jsx";
import Assignment from "./Assignment.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes : '',
      students: '',
      assignments: '',
      activeClass: '',
      newStudent: '',
      newStudentID: '',
      newAssignment: '',
      maxPoints: '',
      studentScores: {}
    };
    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.retrieveAssignments = this.retrieveAssignments.bind(this);
    this.addStudent = this.addStudent.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
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

  retrieveAssignments(event) {
    const id = event.target.id;
    fetch("/api/getassignments?id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'assignments': responseObj.data }));
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
      .then(handleErrors)
      .then(response => console.log("ok"))
      .catch(error => console.log(error));
  }

  handleErrors(response) {
    if(!response.ok) {
      throw Error(response.statusText);
    }
    return response;
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
    if (!this.state.classes) {
      return false
    }

    if (this.state.assignments) {
      var assignmentData = this.state.assignments;
      var studentAssignments = assignmentData.map(
        newAssignment => <Assignment key={newAssignment.id} id={newAssignment.id}>{newAssignment.title}</Assignment>
      )
      return (
        <React.Fragment>
          {studentAssignments}
        </React.Fragment>
      )
    } else {
      var classData = this.state.classes;
      var allClasses = classData.map(
        newClass => <Class key={newClass.id} id={newClass.id} retrieveStudents={this.retrieveStudents}>{newClass.title}</Class>
      )

      if (this.state.students){
        var studentData = this.state.students;
        var allStudents = studentData.map(
          newStudent => <Student key={newStudent.id} id={newStudent.id}
                                  score={this.state.studentScores[newStudent.id]}
                                  maxPoints={this.state.maxPoints}
                                  handleMaxPointsInput={this.handleMaxPointsInput}
                                  handleScore={this.handleScoreInput}
                                  retrieveAssignments={this.retrieveAssignments}>
                                  {newStudent.name}
                        </Student>
        )
      }

      return (
        <React.Fragment>
          <div>
            <input type="text" value={this.state.newAssignment} onChange={this.handleAssignmentInput} placeholder="Assignment Title" style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}></input>
          </div>
            {allClasses}
          <div>
            {allStudents}
            <button type="submit" onClick={this.addAssignment}>Submit</button>
          </div>
          <form onSubmit={this.addStudent}>
              <input type="text" value={this.state.newStudent} onChange={this.handleStudentInput} placeholder="Add Student" style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}></input>
          </form>
        </React.Fragment>
      );
    }
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
