import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
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

    };

    this.retrieveClasses = this.retrieveClasses.bind(this);

    this.addStudent = this.addStudent.bind(this);
    this.addClass = this.addClass.bind(this);

    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleClassInput = this.handleClassInput.bind(this);
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

  handleClassInput(event) {
    this.setState({'newClass' : event.target.value})
  }

  handleStudentInput(event) {
    this.setState({'newStudent' : event.target.value})
  }

  render() {
    var allClasses = this.state.classes.map(
      Class =>  <Link to={`/${Class.id}`} key={Class.id} id={Class.id} style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.props.retrieveStudents}>
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
          <Switch>
            <Route exact path={match.url} render={(props) => <Class {...props}></Class>} />
            <Route path={match.url + "/input"} render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
            <Route path={match.url + "/:studentID"} render={(props) => <Student {...props}></Student>} />
          </Switch>
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
