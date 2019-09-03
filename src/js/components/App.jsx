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
      newStudent: ''
    };
    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.retrieveAssignments = this.retrieveAssignments.bind(this);
    this.addStudent = this.addStudent.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
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
    fetch("/api/getstudents?id=" + id, {
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
    const name = this.state.newStudent;
    const class_id = this.state.activeClass;
    console.log('name: ',name);
    console.log('class_id: ',class_id);
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
      .then(responseObj => console.log('response: ',responseObj));
  }

  handleStudentInput(event) {
    this.setState({'newStudent' : event.target.value})
  }

  render() {
    console.log(this.state.newStudent);
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
          newStudent => <Student key={newStudent.id} id={newStudent.id} retrieveAssignments={this.retrieveAssignments}>{newStudent.name}</Student>
        )
      }

      return (
        <React.Fragment>
        {allClasses}
        {allStudents}
        <form onSubmit={this.addStudent}>
            <input type="text" value={this.state.value} onChange={this.handleStudentInput} style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}></input>
        </form>
        </React.Fragment>
      );
    }
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
