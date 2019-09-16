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
      updatedScores: {}
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
    const studentScore = parseInt(event.target.value);
    student[studentID] = studentScore;

    this.setState({ updatedScores: student });
  }

  updateAssignmentScore() {
    const scores = this.state.updatedScores;
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
      .then(response => console.log(response));
    }
  }


  render() {
    if(!this.state.assignments) {
      return false
    }

    var allAssignments = this.state.assignments.map(
      assignment =>
        <div key={assignment.id} className="row">
          <div className="column">{assignment.title}</div>
          <div className="column">
            <input id={assignment.id} className="input" type="text" value={this.state.updatedScores[assignment.id]} onChange={this.handleUpdateScore} placeholder={assignment.score}
              onFocus={() => event.target.placeholder = ''}
              onBlur={() => event.target.placeholder = assignment.score}>
            </input>
            /{assignment.totalpoints}
          </div>
        </div>
    )

    const previousPageURL = "/" + this.props.match.url.split("/")[1];

    return (
      <React.Fragment>

        <div>
          <header>
            <h1>
              {this.state.name}'s Average Grade:
            </h1>
            <h1>
              {this.state.studentAverage}%
            </h1>
          </header>
          <div className="row">
            <h3 className="column">Name</h3>
            <h3 className="column">Grade</h3>
          </div>
          {allAssignments}
          <Link to={previousPageURL}>
            <button className="back" onClick={this.updateAssignmentScore}>
              Back
          </button>
          </Link>
        </div>
      </React.Fragment>
    )
  }
}
