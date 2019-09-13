import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


export default class Assignment extends React.Component {
  constructor() {
    super()
    this.state = {
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
    this.retrieveStudents();
  }

  retrieveStudents() {
    const class_id = this.props.match.url.slice(1, -6);
    fetch("/api/getstudents?class_id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => this.setState({ 'students': students.data }));
  }

  handleAssignmentInput(event) {
    this.setState({ 'newAssignment': event.target.value })
  }

  handleMaxPointsInput(event) {
    this.setState({ 'maxPoints': event.target.value })
  }

  handleScoreInput(event) {
    const studentID = event.target.id;
    let student = this.state.scores;
    const studentScore = parseInt(event.target.value);
    student[studentID] = studentScore;

    this.setState({ scores: student });
  }

  addAssignment(event) {
    event.preventDefault();
    const title = this.state.newAssignment;
    const totalpoints = this.state.maxPoints;
    const studentScores = this.state.scores;
    let scores = this.state.students.map(
      student => `('${title}', ${studentScores[student.id]}, ${totalpoints}, ${student.id})`
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

    this.setState({ view: 'class', newAssignment: '', maxPoints: '', scores: {} })
  }


  render() {

    if(this.state.students.length > 0) {
      var allStudents = this.state.students.map(
        student =>
          <div key={student.id} style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>{student.name}</div>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>
              <input id={student.id} type="text" value={this.state.scores[student.id]} onChange={this.handleScoreInput} style={{ display: 'inline-block', width: 4 + '%', height: 20 + 'px' }}>
              </input>
            </div>
          </div>
      )
    }


    return (
      <React.Fragment>
        <div style={{ width: 100 + '%', height: 60 + 'px' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
          </div>
          <input type="text" value={this.state.newAssignment} onChange={this.handleAssignmentInput} style={{ display: 'inline-block', width: 10 + '%', height: 30 + 'px', marginLeft: 40 + '%' }}></input>
          <input type="text" value={this.state.maxPoints} onChange={this.handleMaxPointsInput} style={{ display: 'inline-block', width: 3 + '%', height: 30 + 'px', marginLeft: 70 + '%' }}></input>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Name</div>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Score</div>
          </div>
          {allStudents}
          <button style={{ width: 7 + '%', height: 30 + 'px', marginLeft: 50 + '%' }} onClick={this.addAssignment}>
            Submit
          </button>
        </div>
      </React.Fragment>
    )
  }
}
