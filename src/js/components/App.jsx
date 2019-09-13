import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
function Home() {
  return <div>Hello, from Home!</div>;
}

function About() {
  return <div>Hello, from About!</div>;
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],

      newStudent: '',
      newStudentID: '',
      newClassID: '',
      newAssignment: '',
      newClass: '',

      maxPoints: '',
    };

    this.retrieveClasses = this.retrieveClasses.bind(this);

    this.addStudent = this.addStudent.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.addClass = this.addClass.bind(this);

    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleClassInput = this.handleClassInput.bind(this);
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
      .then(classes => this.setState({ 'classes': classes.data }));
  }

  addClass (event) {
    event.preventDefault();
    fetch("/api/addclass", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newClass,
      })
    })
      .then(data => data.json())
      .then(responseObj => {
        console.log(responseObj.data.insertId);
        const newClassObj = [{ 'id': responseObj.data.insertId, 'title': this.state.newClass }];
        console.log(newClassObj);
        this.setState({ 'classes': this.state.classes.concat(newClassObj) , 'newClass': ''})
    });
  }

  addStudent(event) {
    event.preventDefault();
    fetch("/api/addstudent", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newStudent,
        class_id: this.state.viewingClass
      })
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'newStudentID': responseObj.data.insertId}));

    const newStudentObj = [{'class_id': this.state.viewingClass, 'id': this.state.newStudentID, 'name': this.state.newStudent}];
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

  handleClassInput(event) {
    this.setState({'newClass' : event.target.value})
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
    var allClasses = this.state.classes.map(
      Class =>  <Link to={`/${Class.id}`} id={Class.id} style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.props.retrieveStudents}>
                  {Class.title}
                </Link>
    )

    const Display = ({ match }) => {
      return (
        <React.Fragment>
          <div id="tab-list" style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'lightgrey' }}>
            <div id="add-class" style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.createNewTab}>+</div>
            {allClasses}
            {this.state.newTab}
          </div>
          <Route exact path={match.url} render={(props) => <Class {...props}></Class>} />
          <Route path={match.url + "/input"} render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
          <Route path={match.url + "/:studentID"} render={(props) => <Student {...props}></Student>} />
        </React.Fragment>
      )
    }

    return(
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/:classID" component={Display}/>
      </div>
    )
  }
}

export default withRouter(App);
