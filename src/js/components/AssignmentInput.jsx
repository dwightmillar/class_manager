import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


export default class Assignment extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '',
      students: [],
      newAssignment: '',
      maxPoints: '',
      scores: {}
    }
    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
  }

  componentDidMount() {
    this.retrieveName();
    this.retrieveStudents();
  }

  retrieveName() {
    const class_id = this.props.match.url.split('/')[1];
    fetch("/api/getclasses?id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(Class => this.setState({ title: Class.data[0].title }));
  }

  retrieveStudents() {
    const class_id = this.props.match.url.slice(1, -6);
    fetch("/api/getstudents?class_id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => {
        this.setState({ 'students': students.data });
        students.data.map(
          student => {
            let studentScores = this.state.scores;
            studentScores[student.id] = '';
            this.setState({ studentScores: studentScores });
          }
        )
      })
  }

  handleAssignmentInput(event) {
    this.setState({ 'newAssignment': event.target.value })
  }

  handleMaxPointsInput(event) {
    this.setState({ 'maxPoints': event.target.value })
  }

  handleScoreInput(event) {
    let studentScore = 0;
    const studentID = event.target.id;
    let student = this.state.scores;

    if(isNaN(event.target.value)) {
      return false;
    }
    if (event.target.value.length === 0) {
      studentScore = event.target.value;
    } else {
      studentScore = parseInt(event.target.value);
    }

    student[studentID] = studentScore;
    console.log(student);

    this.setState({ scores: student });
  }

  addAssignment(event) {
    event.preventDefault();
    if (this.state.newAssignment.length < 1) {
      alert('Assignment missing title. Submit rejected.');
      return false;
    }
    const title = this.state.newAssignment;
    const totalpoints = this.state.maxPoints;
    const studentScores = this.state.scores;
    let scores = this.state.students.map(
      student => `('${title}', ${studentScores[student.id]}, ${totalpoints}, ${student.id})`
    ).toString();

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

    var newScores = {};

    for (let studentID in this.state.scores) {
      newScores[studentID] = '';
    }

    this.setState({ newAssignment: '', maxPoints: '', scores: newScores })
  }


  render() {

    if(this.state.students.length > 0) {
      var allStudents = this.state.students.map(
        student =>
          <tr key={student.id} className="d-flex">
            <td className="col-2"></td>
            <td className="col-4">{student.name}</td>
            <td className="col-2"></td>
            <td className="col-4">
              <input id={student.id} className="input" type="text" value={this.state.scores[student.id]} onChange={this.handleScoreInput}>
              </input>
            </td>
          </tr>
      )
    }

    const previousPageURL = "/" + this.props.match.url.split("/")[1];

    return (
      <React.Fragment>
        <header>
          <h1 className="text-center">
            {this.state.title}
          </h1>
          <div className="row">
            <Link to={previousPageURL} className="center">
              <button className="btn btn-secondary">
                Back
              </button>
            </Link>
          </div>
          <div className="row">
            <input className="center" type="text" placeholder="Assignment Title" value={this.state.newAssignment} onChange={this.handleAssignmentInput} autoFocus></input>
          </div>
          <div className="row">
            <input className="center" type="text" placeholder="Max Pts" value={this.state.maxPoints} onChange={this.handleMaxPointsInput} ></input>
          </div>
        </header>
        <div>
          <div className="container-fluid">
            <table className="table table-hover">
              <thead>
                <tr className="d-flex">
                  <th className="col-2"></th>
                  <th className="col-4">Name</th>
                  <th className="col-2"></th>
                  <th className="col-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {allStudents}
              </tbody>
            </table>
          </div>
          <div className="row">
            <Link to={"/1"} className="center" style={{zIndex: 1}}>
              <button className="btn btn-success">
                Submit
              </button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
