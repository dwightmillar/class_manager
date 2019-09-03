import React from "react";
import ReactDOM from "react-dom";
import Class from "./Class.jsx";
import Student from "./Student.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes : '',
      students: ''
    };
    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
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

  retrieveStudents() {
    fetch("/api/getstudents", {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'students': responseObj.data }));
  }

  render() {
    if (!this.state.classes) {
      return false
    } else {
      var classData = this.state.classes;
      var allClasses = classData.map(
        newClass => <Class key={newClass.id} retrieveStudents={this.retrieveStudents} students={this.state.students}>{newClass.title}</Class>
      )

      if (this.state.students){
        var studentData = this.state.students;
        var allStudents = studentData.map(
          newStudent => <Student key={newStudent.id}>{newStudent.name}</Student>
        )
        console.log(allStudents);
      }

      return (
        <React.Fragment>
        {allClasses}
        {allStudents}
        </React.Fragment>
      );
    }
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
