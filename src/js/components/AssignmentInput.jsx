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
        this.setState({ 'students': students.data });
        students.data.map(
          student => {
            let studentScores = this.state.scores;
            studentScores[student.id] = '';
            this.setState({ scores: studentScores });
            this.getAssignments(student.id);
          }
        )
      });
  }

  getAssignments(id) {
    fetch("/class_manager/api/assignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        this.handleStudentGradeAverage(id, assignments.data);
      });
  }

  handleStudentGradeAverage(id, assignments) {
    console.log('assignments: ', assignments);
    let studentAverage = this.state.studentAverages;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;
    let average = 0;

    if (assignments.length > 0) {
      assignments.forEach(
        assignment => {
          if (!isNaN(assignment.score)) {
            totalPointsScored += parseInt(assignment.score);
          }
          totalPointsPossible += assignment.totalpoints;
        }
      )
    }

    if (totalPointsPossible !== 0) {
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    } else {
      average = 'N/A';
    }

    studentAverage.push(average);

    this.setState({ studentAverages: studentAverage });

    this.handleClassAverage();
  }

  handleClassAverage() {
    var classAverage = 0;
    var averageIndex = 0;
    var studentAverages = this.state.studentAverages;

    studentAverages.forEach(
      average => {
        ++averageIndex;
        if (average !== 'N/A') {
          classAverage += parseFloat(average);
        }
      }
    )

    if (!averageIndex) {
      classAverage = 'N/A';
    } else if (isNaN(classAverage / averageIndex)) {
      return false;
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
    } else if (event.target.value > 999) {
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

    if(parseInt(event.target.value) > 999){
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
          return `user,${title},${studentScores[student.id]},${totalpoints},${student.id},${classid}`
        } else {
          this.setState({ inputerror: true });
          errorCheck = true;
          return false;
        }
      }
    )

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
      .then(()=> {
        var newScores = {};

        for (let studentID in this.state.scores) {
          newScores[studentID] = '';
        }

        this.setState({ newAssignment: '', maxPoints: '', studentAverages: [], scores: newScores });
        this.getStudents();
      })
      .catch(error => console.error('postassignment error: ',error))
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

          <div className="text-center">
            <div style={{ 'display': 'inline-block' }}>
              <Link to={previousPageURL}>
                <button className="btn btn-secondary">
                  Back
              </button>
              </Link>
            </div>
            <div style={{ 'display': 'inline-block' }}>
              <input className={(this.state.inputerror && !this.state.newAssignment) ? "center assignment error" : "center assignment"} type="text" placeholder="Assignment Title" value={this.state.newAssignment} onChange={this.handleAssignmentInput} autoFocus></input>
            </div>
          </div>

          <div className="text-center">
            <div style={{ 'display': 'inline-block' }}>
              <label for="maxPointsInput">Total possible points:&nbsp;&nbsp;&nbsp;</label>
              <input id="maxPointsInput" type="number" min="1" max="999" className={(this.state.inputerror && !this.state.maxPoints) ? "points error" : "points"} value={this.state.maxPoints} onChange={this.handleMaxPointsInput} ></input>
            </div>
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
