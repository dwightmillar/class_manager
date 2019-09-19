import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

export default class Student extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      assignments: [],
      studentAverage: 0,
      studentScores: {},
    }

    this.retrieveName = this.retrieveName.bind(this);
    this.retrieveAssignments = this.retrieveAssignments.bind(this);
    this.handleUpdateScore = this.handleUpdateScore.bind(this);
    this.updateAssignmentScore = this.updateAssignmentScore.bind(this);
  }

  componentDidMount() {
    this.retrieveAssignments();
    this.retrieveName();
  }

  retrieveName() {
    const student_id = this.props.match.url.slice(3);
    fetch("/api/getstudents?id=" + student_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(student => this.setState({name: student.data[0].name}));
  }

  retrieveAssignments() {
    const student_id = this.props.match.url.slice(3);
    fetch("/api/getassignments?student_id=" + student_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        this.setState({ 'assignments': assignments.data });
        this.handleStudentGradeAverage(student_id, assignments.data);
        assignments.data.map(
          assignment => {
            let studentScores = this.state.studentScores;
            studentScores[assignment.id] = assignment.score;
            this.setState({ studentScores: studentScores });
          }
        )
      });
  }

  handleStudentGradeAverage(id, data) {
    let studentAverage = 0;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;

    data.forEach(
      grade => {
        totalPointsScored += grade.score;
        totalPointsPossible += grade.totalpoints;
      }
    )

    if (totalPointsPossible !== 0) {
      studentAverage = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    }

    this.setState({ studentAverage: studentAverage })
  }

  handleUpdateScore(event) {

    const studentID = event.target.id;
    let student = this.state.studentScores;
    let studentScore = 0;
    if (isNaN(event.target.value)) {
      return false;
    }
    if (event.target.value.length === 0) {
      studentScore = event.target.value;
    } else {
      studentScore = parseInt(event.target.value);
    }
    console.log(studentScore);
    student[studentID] = studentScore;

    this.setState({ studentScores: student });
  }

  updateAssignmentScore() {
    const scores = this.state.studentScores;
    if (scores !== {}) {
      fetch("/api/updatescore", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({
          scores: scores
        })
      })
      .then(data => data.json())
      .then(response => response);
    }
  }


  render() {
    if(!this.state.assignments) {
      return false
    }

    var allAssignments = this.state.assignments.map(
      assignment =>
        <tr key={assignment.id} className="d-flex">
          <td className="col-2"></td>
          <td className="col-4">{assignment.title}</td>
          <td className="col-2"></td>
          <td className="col-4">
            <input id={assignment.id} className="points" type="text" value={this.state.studentScores[assignment.id]} onChange={this.handleUpdateScore} placeholder={assignment.score}
              onBlur={() => {
                if (event.target.value === '') {
                  let student = this.state.studentScores;
                  student[assignment.id] = assignment.score;
                  this.setState({ studentScores : student })
                }
              }}
              >
            </input>
            /{assignment.totalpoints}
          </td>
        </tr>
    )

    const previousPageURL = "/" + this.props.match.url.split("/")[1];

    return (
      <React.Fragment>
        <header>
          <h1 className="text-center">
            {this.state.name}
          </h1>
          <h2 className="text-center">
            {this.state.studentAverage}%
          </h2>
          <div className="row">
            <div className="col-1"></div>
            <Link to={previousPageURL}>
              <button className="btn btn-secondary" onClick={this.updateAssignmentScore}>
                Back
              </button>
            </Link>
          </div>
        </header>

        <div className="container-fluid">
          <table className="table table-hover">
            <thead>
              <tr className="d-flex">
                <th className="col-2"></th>
                <th className="col-4">Name</th>
                <th className="col-2"></th>
                <th className="col-4">Grade</th>
              </tr>
            </thead>
            <tbody>
              {allAssignments}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}
