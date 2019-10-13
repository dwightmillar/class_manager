import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


export default class Assignment extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '',
      students: [],
      classAverage: 'Calculating...',
      studentAverages: [],
      newAssignment: '',
      maxPoints: '',
      scores: {},
      inputerror: false
    }
    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleClassAverage = this.handleClassAverage.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
    this.postAssignment = this.postAssignment.bind(this);
  }

  componentDidMount() {
    this.getStudents();
  }


  getStudents() {
    const class_id = this.props.match.params.classID;
    fetch("/class_manager/api/students?class_id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => {
        console.log('students: ',students);
        this.setState({ 'students': students.data });
        students.data.map(
          student => {
            let studentScores = this.state.scores;
            studentScores[student.id] = '';
            this.setState({ studentScores: studentScores });
            this.getAssignments(student.id);
          }
        )
      })
      .then(
        this.handleClassAverage()
      );
  }

  getAssignments(id) {
    fetch("/class_manager/api/assignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        console.log('assignments: ',assignments);
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
          if (parseInt(grade.score)) {
            grade.score = parseInt(grade.score);
          }
          if (isNaN(grade.score)) {
            grade.score = 0;
          }
          totalPointsScored += grade.score;
          totalPointsPossible += grade.totalpoints;
          console.log('totalPointsScored: ',totalPointsScored);
          console.log('totalPointsPossible: ',totalPointsPossible);
        }
      )
    }

    if (totalPointsPossible !== 0) {
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    } else {
      average = 'N/A';
    }

    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage });
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

    this.setState({classAverage: classAverage});
  }

  handleAssignmentInput(event) {
    this.setState({ 'newAssignment': event.target.value })
  }

  handleMaxPointsInput(event) {
    if (isNaN(event.target.value)) {
      return false;
    }
    this.setState({ 'maxPoints': event.target.value })
  }

  handleScoreInput(event) {
    let studentScore = 0;
    const studentID = event.target.id;
    let student = this.state.scores;
    const valueCheck = /[\dM{1}]/;

    if(!valueCheck.test(event.target.value) && event.target.value !== '') {
      return false;
    }

    if(event.target.value === '') {
      studentScore = 0;
    } else if (!isNaN(event.target.value)){
      studentScore = parseInt(event.target.value);
    } else if (event.target.value.length > 1) {
        return false;
    }

    studentScore = event.target.value;

    student[studentID] = studentScore;

    this.setState({ scores: student });
  }

  postAssignment(event) {
    event.preventDefault();
    let errorCheck = false;

    if (!this.state.newAssignment.length || !this.state.maxPoints ) {
      console.log('invalid assignmentname or maxpoints');
      this.setState({ inputerror: true });
      errorCheck = true;
      alert('You need to fill out the highlighted fields');
      return false;
    }

    const title = this.state.newAssignment;
    const totalpoints = this.state.maxPoints;
    const studentScores = this.state.scores;
    const classid = this.props.match.params.classID;

    let scores = this.state.students.map(
      student => {
        if (studentScores[student.id]) {
          return `${title},${studentScores[student.id]},${totalpoints},${student.id},${classid}`
        } else {
          this.setState({ inputerror: true });
          errorCheck = true;
          alert('You need to fill out the highlighted fields');
          return false;
        }
      }
    )

    console.log('scores: ',scores);

    for (var score in scores) {
      if (score === '') {
        console.log('invalid score');
        errorCheck = true;
      }
    }

    if (!scores[scores.length - 1]) {
      return false;
    } else {
      scores = scores.toString();
    }

    if(errorCheck) {
      this.setState({inputerror: true});
      return false;
    } else {
      this.setState({inputerror: false});
    }


    fetch("/class_manager/api/assignments", {
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
      .then(data => console.log('postassignment response:', data))
      .catch(error => console.error('postassignment error: ',error))

    var newScores = {};

    for (let studentID in this.state.scores) {
      newScores[studentID] = '';
    }

    this.setState({ newAssignment: '', maxPoints: '', scores: newScores });
    this.getStudents();
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
              <input id={student.id} className={(this.state.inputerror && (this.state.scores[student.id] === '')) ? "points error" : "points"} type="text" value={this.state.scores[student.id]} onChange={this.handleScoreInput}></input>
              &nbsp;/&nbsp;{this.state.maxPoints}
            </td>
          </tr>
      )
    }

    const previousPageURL = "/class_manager/" + this.props.match.params.classID;

    return (
      <React.Fragment>
        <header>
          <h1 className="text-center">
            {this.props.title}
          </h1>
          <h2 className="text-center">
            Class Average: {this.state.classAverage}
          </h2>
          <div className="row">
            <div className="col-1"></div>
            <Link to={previousPageURL}>
              <button className="btn btn-secondary">
                Back
              </button>
            </Link>
            <div className="col-2"></div>
            <input className={(this.state.inputerror && !this.state.newAssignment) ? "center assignment error" : "center assignment"} type="text" placeholder="Assignment Title" value={this.state.newAssignment} onChange={this.handleAssignmentInput} autoFocus></input>
          </div>
          <div className="row">
            <div className="col-7"></div>
            <div>Total possible points:&nbsp;</div>
            <input type="number" min="1" msx="999" className={(this.state.inputerror && !this.state.maxPoints) ? "points error" : "points"} value={this.state.maxPoints} onChange={this.handleMaxPointsInput} ></input>
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
            <button className="btn btn-success" onClick={this.postAssignment}>
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
