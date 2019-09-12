import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { match } from "minimatch";

export default class Class extends React.Component {
  constructor() {
    super();
    this.state = {
      classAverage: '',
      studentAverages: {},
      newTab: '',
      students: [],
      assignments: [],
      classes: []
    }
    this.createNewTab = this.createNewTab.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
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

  handleStudentGradeAverage(id, data) {
    let studentAverage = this.state.studentAverages;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;
    let average = 0;

    data.forEach(
      grade => {
        totalPointsScored += grade.score;
        totalPointsPossible += grade.totalpoints;
      }
    )

    if (totalPointsPossible !== 0) {
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    }
    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage })
  }

  createNewTab() {
    this.setState({
      newTab:
      <form onSubmit={this.props.addClass}>
        <input type="text" onChange={this.props.handleClassInput}></input>
      </form>
    })
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
    classAverage = (classAverage / averageIndex).toFixed(2);


    var allStudents = this.state.students.map(
      student =>
        <div id={student.id} style={{ display: 'flex', flexDirection: 'row' }} onClick={this.props.viewStudent}>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{student.name}</div>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{this.state.studentAverages[student.id]}%</div>
        </div>
    )

    var allClasses = this.state.classes.map(
      Class =>  <Link to={`/class_${Class.id}`} id={Class.id} style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.props.retrieveStudents}>
                  {Class.title}
                </Link>
    )


    return (
      <React.Fragment>
        <div id="tab-list" style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'lightgrey' }}>
          <div id="add-class" style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.createNewTab}>+</div>
          {allClasses}
          {this.state.newTab}
        </div>
        <div style={{ width: 100 + 'vw', height: 60 + 'px' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
            Class Average: {classAverage}%
        </div>
          <button style={{ display: 'inline-block', width: 30 + '%', height: 60 + 'px', marginLeft: 40 + '%' }} onClick={this.props.viewAssignmentInput}>
            <Link to="/input">
              Input Assignment
          </Link>
          </button>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Name</div>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Grade</div>
          </div>
          {allStudents}
          <form onSubmit={this.props.addStudent}>
            <input type="text" value={this.props.studentName} onChange={this.props.handleStudentInput}></input>
          </form>
        </div>
      </React.Fragment>
    )
  }
}
