import React from "react";
import ReactDOM from "react-dom";
import { useAsync } from 'react-async';
import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      view : 'class',
      classes : [],
      students: [],
      assignments: '',
      viewingClass: 1,
      viewingStudent: 0,
      newStudent: '',
      newStudentID: '',
      newClassID: '',
      newAssignment: '',
      newClass: '',
      maxPoints: 0,
      studentScores: {},
      studentAverages: {}
    };
    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.retrieveAssignments = this.retrieveAssignments.bind(this);

    this.addStudent = this.addStudent.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.addClass = this.addClass.bind(this);

    this.handleAssignmentInput = this.handleAssignmentInput.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleClassInput = this.handleClassInput.bind(this);
    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
    this.handleStudentGradeAverage = this.handleStudentGradeAverage.bind(this);

    this.viewStudent = this.viewStudent.bind(this);
    this.viewClass = this.viewClass.bind(this);
    this.viewAssignmentInput = this.viewAssignmentInput.bind(this);
  }

  componentDidMount() {
    this.retrieveClasses();
    this.retrieveStudents(1);
  }

  retrieveClasses() {
    fetch("/api/getclasses", {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => this.setState({'classes': responseObj.data}));
  }

  retrieveStudents(event) {
    if (event.target){
      var id = event.target.id;
    } else {
      id = event;
    }
    fetch("/api/getstudents?class_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => {
        students.data.map(
          student => this.retrieveAssignments(student.id)
        );
        this.setState({ 'viewingClass': id, 'students': students.data })
      });

  }

  retrieveAssignments(id) {
    fetch("/api/getassignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(responseObj => {
        this.setState({ 'assignments': responseObj.data });
        this.handleStudentGradeAverage(id, responseObj.data);
      });
  }

  viewClass() {
    this.setState({ view: 'class', assignments: '' });
  }

  viewStudent(event) {
    const id = event.target.parentElement.id;
    const student = this.state.students.filter(
      student => student.id == id
    )[0];
    this.retrieveAssignments(id);
    this.setState({ view: 'student',
                    'viewingStudent': student.name });
  }

  viewAssignmentInput() {
    this.setState({ view: 'assignmentinput'});
  }

  addClass (event) {
    event.preventDefault();
    fetch("/api/addclass", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newClass,
      })
    })
      .then(data => data.json())
      .then(responseObj => {
        console.log(responseObj.data.insertId);
        const newClassObj = [{ 'id': responseObj.data.insertId, 'title': this.state.newClass }];
        console.log(newClassObj);
        this.setState({ 'classes': this.state.classes.concat(newClassObj) , 'newClass': ''})
    });
  }

  addStudent(event) {
    event.preventDefault();
    fetch("/api/addstudent", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: this.state.newStudent,
        class_id: this.state.viewingClass
      })
    })
      .then(data => data.json())
      .then(responseObj => this.setState({ 'newStudentID': responseObj.data.insertId}));

    const newStudentObj = [{'class_id': this.state.viewingClass, 'id': this.state.newStudentID, 'name': this.state.newStudent}];
    this.setState({'students': this.state.students.concat(newStudentObj)});
    this.setState({'newStudent': '', 'newStudentID': ''})
  }

  addAssignment(event) {
    event.preventDefault();
    const title = this.state.newAssignment;
    const totalpoints = this.state.maxPoints;
    const studentScores = this.state.studentScores;
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

    this.setState({ view: 'class', newAssignment: '', maxPoints: '', studentScores: {}})
  }

  handleClassInput(event) {
    this.setState({'newClass' : event.target.value})
  }

  handleStudentInput(event) {
    this.setState({'newStudent' : event.target.value})
  }

  handleAssignmentInput(event) {
    this.setState({ 'newAssignment': event.target.value })
  }

  handleMaxPointsInput(event) {
    this.setState({ 'maxPoints': event.target.value })
  }

  handleScoreInput(event) {
    const studentID = event.target.id;
    let student = this.state.studentScores;
    const studentScore = parseInt(event.target.value);
    student[studentID] = studentScore;

    this.setState({ studentScores: student});
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

    if(totalPointsPossible !== 0){
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    }
    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage})
  }

  render() {
    return(
      <div>
        <Class view={this.state.view} classNames={this.state.classes} studentData={this.state.students} retrieveStudents={this.retrieveStudents} viewStudent={this.viewStudent}
        viewAssignmentInput={this.viewAssignmentInput} handleStudentInput={this.handleStudentInput} studentName={this.state.newStudent} addStudent={this.addStudent}
        studentAverages={this.state.studentAverages} handleClassInput={this.handleClassInput} className={this.state.newClass} addClass={this.addClass}/>

        <Student view={this.state.view} name={this.state.viewingStudent} data={this.state.assignments} retrieveAssignments={this.retrieveAssignments} viewClass={this.viewClass}/>

        <AssignmentInput view={this.state.view} studentData={this.state.students} newAssignment={this.state.newAssignment} handleAssignmentInput={this.handleAssignmentInput}
        maxPoints={this.state.maxPoints} scores={this.state.studentScores} handleMaxPointsInput={this.handleMaxPointsInput} handleScoreInput={this.handleScoreInput}
        addAssignment={this.addAssignment}/>
      </div>
    )
  }
}


const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
