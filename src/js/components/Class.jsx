import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import { match } from "minimatch";

export default class Class extends React.Component {
  constructor() {
    super();
    this.state = {
      classAverage: '',
      newStudent: '',
      studentAverages: {},
      students: [],
      assignments: []
    }
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.addStudent = this.addStudent.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
  }

  componentDidMount() {
    this.retrieveStudents();
  }

  retrieveStudents() {
    const class_id = this.props.match.url.slice(1);
    fetch("/api/getstudents?class_id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => {
        students.data.map(
          student => this.retrieveAssignments(student.id)
        );
        this.setState({ 'students': students.data })
      });
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

  addStudent(event) {
    event.preventDefault();

    const class_id = this.props.match.url.slice(1);

    fetch("/api/addstudent", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newStudent,
        class_id: class_id
      })
    })
      .then(data => data.json())
      .then(newStudent => {
        this.setState({
          'newStudentID': newStudent.data.insertId
        });
        this.addStudentDirect(class_id);
      });
  }

  addStudentDirect(class_id) {
    const newStudentObj = [{ 'class_id': class_id, 'id': this.state.newStudentID, 'name': this.state.newStudent }];
    this.setState({ 'students': this.state.students.concat(newStudentObj) });
    this.handleStudentGradeAverage(this.state.newStudentID, []);
    this.setState({ 'newStudent': '', 'newStudentID': '' });
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
    }

    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage })
  }

  handleStudentInput(event) {
    this.setState({ 'newStudent': event.target.value })
  }

  render() {
    var classAverage = 0;
    var averageIndex = 0;

    this.state.students.forEach(
      student => {
        if (this.state.studentAverages[student.id] !== undefined) {
          classAverage += parseFloat(this.state.studentAverages[student.id]);
          ++averageIndex;
        }
      }
    )

    if(!averageIndex) {
      classAverage = 'N/A';
    } else {
      classAverage = (classAverage / averageIndex).toFixed(2) + '%';
    }


    var allStudents = this.state.students.map(
      student => {
        if(this.state.studentAverages[student.id]) {
          return (
            <Link to={this.props.match.url + `/${student.id}`} key={student.id} id={student.id} className="row">
              <div className="column">{student.name}</div>
              <div className="column">{this.state.studentAverages[student.id]}%</div>
            </Link>
          )
        } else {
          return (
            <div key={student.id} id={student.id} className="row">
              <div className="column">{student.name}</div>
              <div className="column">N/A</div>
            </div>
          )
        }
      }
    )

    return (
      <React.Fragment>
        <div style={{ width: 100 + 'vw', height: 90 + 'vh' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
            Class Average: {classAverage}
        </div>

            <Link to={this.props.match.url + "/input"} style={{ display: 'inline-block', width: 30 + '%', height: 60 + 'px', marginLeft: 40 + '%' }}>
            <button onClick={this.props.viewAssignmentInput}>
              Input Assignment
            </button>
            </Link>
          <div className="row">
            <div className="column">Name</div>
            <div className="column">Grade</div>
          </div>
          {allStudents}
          <form onSubmit={this.addStudent}>
            <input type="text" placeholder="Add student" value={this.state.newStudent} onChange={this.handleStudentInput}></input>
          </form>
        </div>
      </React.Fragment>
    )
  }
}
