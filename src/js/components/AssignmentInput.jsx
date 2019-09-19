import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


export default class Assignment extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '',
      students: [],
      studentAverages: [],
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
    const class_id = this.props.match.url.split('/')[1];
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
            this.retrieveAssignments(student.id);
          }
        )
      })
  }

  retrieveAssignments(id) {
    fetch("/api/getassignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        this.setState({ 'assignments': assignments.data });
        this.handleStudentGradeAverage(id, assignments.data);
      });
  }

  handleStudentGradeAverage(id, data) {
    let studentAverage = this.state.studentAverages;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;
    let average = 0;

    if (data.length > 0) {
      data.forEach(
        grade => {
          totalPointsScored += grade.score;
          totalPointsPossible += grade.totalpoints;
        }
      )
    }

    if (totalPointsPossible !== 0) {
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    } else {
      average = 'N/A';
    }

    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage })
  }

  handleClassAverage() {
    var classAverage = 0;
    var averageIndex = 0;

    this.state.students.forEach(
      student => {
        if (this.state.studentAverages[student.id] !== 'N/A') {
          classAverage += parseFloat(this.state.studentAverages[student.id]);
          ++averageIndex;
        }
      }
    )

    if (!averageIndex) {
      classAverage = 'N/A';
    } else {
      classAverage = (classAverage / averageIndex).toFixed(2) + '%';
    }

    return classAverage;
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
    const classid = this.props.match.url.split('/')[1];
    console.log(classid);
    let scores = this.state.students.map(
      student => `('${title}', ${studentScores[student.id]}, ${totalpoints}, ${student.id}, ${classid})`
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

    var newScores = {};

    for (let studentID in this.state.scores) {
      newScores[studentID] = '';
    }

    this.setState({ newAssignment: '', maxPoints: '', scores: newScores });
    this.retrieveStudents();
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
              <input id={student.id} className="points" type="text" value={this.state.scores[student.id]} onChange={this.handleScoreInput}>
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
          <h2 className="text-center">
            Class Average: {this.handleClassAverage()}
          </h2>
          <div className="row">
            <div className="col-1"></div>
            <Link to={previousPageURL}>
              <button className="btn btn-secondary">
                Back
              </button>
            </Link>
            <div className="col-2"></div>
            <input className="center assignment" type="text" placeholder="Assignment Title" value={this.state.newAssignment} onChange={this.handleAssignmentInput} autoFocus></input>
          </div>
          <div className="row">
            <div className="col-7"></div>
            <div>Total possible points:&nbsp;</div>
            <input className="points" type="text" value={this.state.maxPoints} onChange={this.handleMaxPointsInput} ></input>
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
            <div className="col-8">
            </div>
            <button className="btn btn-success" onClick={this.addAssignment}>
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
