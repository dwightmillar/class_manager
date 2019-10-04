import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NotFound from "./NotFound.jsx";
import history from '../../history.js';


export default class Student extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      assignments: [],
      studentAverage: 0,
      studentScores: {},
    }

    this.getClass = this.getClass.bind(this);
    this.getAssignments = this.getAssignments.bind(this);
    this.handleUpdateScore = this.handleUpdateScore.bind(this);
    this.patchAssignmentScore = this.patchAssignmentScore.bind(this);
  }

  componentDidMount() {
    this.getAssignments();
    this.getClass();
  }

  getClass() {
    const student_id = this.props.match.params.studentID;
    fetch("/class_manager/api/students?id=" + student_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(student => this.setState({name: student.data[0].name}));
  }

  getAssignments() {
    const student_id = this.props.match.params.studentID;
    fetch("/class_manager/api/assignments?student_id=" + student_id, {
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
    student[studentID] = studentScore;

    this.setState({ studentScores: student });
  }

  patchAssignmentScore() {
    const scores = this.state.studentScores;
    if (scores !== {}) {
      fetch("/class_manager/api/assignments", {
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
    console.log(this.props);
    if(!this.state.assignments[0]) {
      return <NotFound />
    }
    if (!(this.props.match.params.classID == this.state.assignments[0].class_id)) {
      history.replace('/' + this.state.assignments[0].class_id + '/' + this.state.assignments[0].student_id)
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
            &nbsp;/&nbsp;{assignment.totalpoints}
          </td>
        </tr>
    )

    const previousPageURL = "/class_manager/" + this.props.match.params.classID;

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
              <button className="btn btn-secondary" onClick={this.patchAssignmentScore}>
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
