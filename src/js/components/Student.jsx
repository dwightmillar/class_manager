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
    // eslint-disable-next-line no-debugger
    debugger;
    const student_id = this.props.match.params.studentID;

    fetch("/class_manager/api/assignments?student_id=" + student_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        this.setState({ 'assignments': assignments.data });
        this.handleStudentGradeAverage(student_id, assignments.data);
        let studentScores = this.state.studentScores;
        assignments.data.map(
          assignment => {
            studentScores[assignment.id] = assignment.score;
          }
        )
        this.setState({ studentScores: studentScores });
      });
  }

  handleStudentGradeAverage(id, data) {
    let studentAverage = this.state.studentAverage;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;

    if (data.length > 0) {
      data.forEach(
        grade => {
          if (!isNaN(grade.score)) {
            totalPointsScored += parseInt(grade.score);
          }
          totalPointsPossible += grade.totalpoints;
        }
      )
    }

    if (totalPointsPossible !== 0) {
      studentAverage = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    } else {
      studentAverage = 'N/A';
    }
    this.setState({ studentAverage: studentAverage })
  }

  handleUpdateScore(event) {

    const studentID = event.target.id;
    let student = this.state.studentScores;
    let studentScore = 0;
    const valueCheck = /[\dM{1}]/;

    if(!valueCheck.test(event.target.value) && event.target.value !== '') {
      return false;
    }
    studentScore = event.target.value;
    if (!isNaN(studentScore)) {
      studentScore = parseInt(studentScore);
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
              // onBlur={() => {
              //   if (event.target.value === '') {
              //     let student = this.state.studentScores;
              //     student[assignment.id] = assignment.score;
              //     this.setState({ studentScores : student })
              //   }
              // }}
              >
            </input>
            &nbsp;/&nbsp;{assignment.totalpoints}
          </td>
        </tr>
    )

    const previousPageURL = "/" + this.props.match.params.classID;

    return (
      <React.Fragment>
        <header>
          <h1 className="text-center">
            {this.state.name}
          </h1>
          <h2 className="text-center">
            {this.state.studentAverage}%
          </h2>
          <div className="text-center">
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
