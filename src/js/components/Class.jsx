import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Modal from './Modal.jsx';
import { match } from "minimatch";

export default class Class extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      classAverage: '',
      newStudent: '',
      studentAverages: {},
      students: [],
      assignments: [],
      displayDeleteStudent: false,
      displayDeleteClass: false
    }
    this.getStudents = this.getStudents.bind(this);
    this.postStudent = this.postStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.showDeleteStudent = this.showDeleteStudent.bind(this);
    this.showDeleteClass = this.showDeleteClass.bind(this);
    this.hideDeleteStudent = this.hideDeleteStudent.bind(this);
    this.hideDeleteClass = this.hideDeleteClass.bind(this);
  }

  componentDidMount() {
    this.getStudents();
    this.getClass();
  }

  getClass() {
    const class_id = this.props.match.url.slice(1);
    fetch("/api/getclasses?id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(Class => {
        this.setState({ title: Class.data[0].title })
      });
  }

  getStudents() {
    const class_id = this.props.match.url.slice(1);
    fetch("/api/getstudents?class_id=" + class_id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(students => {
        students.data.map(
          student => this.getAssignments(student.id)
        );
        this.setState({ 'students': students.data })
      });
  }

  deleteStudent(event) {
    const id = event.target.id
    this.state.students.forEach(
      (student, index) => {
        if (student.id == id) {
          const currentStudentList = this.state.students;
          var newStudentList = [];

          if (currentStudentList.length > 1) {
            newStudentList = currentStudentList.slice(0, index).concat(currentStudentList.slice(index + 1, currentStudentList.length + 1));
          }

          this.setState({ students: newStudentList, displayDeleteStudent: false});
        }
      }
    )

    fetch("/api/deletestudent", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE",
      body: JSON.stringify({
        id: id,
      })
    })
    .then(data => data.json())
    .then(response => console.log(response));
  }

  getAssignments(id) {
    fetch("/api/getassignments?student_id=" + id, {
      method: "GET"
    })
      .then(data => data.json())
      .then(assignments => {
        this.setState({ 'assignments': assignments.data });
        this.handleStudentGradeAverage(id, assignments.data);
      });
  }

  postStudent(event) {
    event.preventDefault();

    const form = event.target.children.nameinput;
    form.disabled = true;

    var studentName = this.state.newStudent;
    var specCharCheck = /\W/;
    var numberCheck = /\d/;
    if (specCharCheck.test(studentName) || numberCheck.test(studentName)) {
      event.target.children[0].placeholder = 'Can only use letters';
      event.target.children[0].value = '';
      return false;
    } else if (this.state.newStudent.length < 2) {
      event.target.children[0].placeholder = 'Must be at least 2 letters';
      event.target.children[0].value = '';
      return false;
    }

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
        this.addStudentDirect(class_id, form);
      });
  }

  addStudentDirect(class_id, form) {
    const newStudentObj = [{ 'class_id': class_id, 'id': this.state.newStudentID, 'name': this.state.newStudent }];
    this.setState({ 'students': this.state.students.concat(newStudentObj) });
    this.handleStudentGradeAverage(this.state.newStudentID, []);
    this.setState({ 'newStudent': '', 'newStudentID': '' });
    form.disabled = false;
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
    } else {
      average = 'N/A';
    }

    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage })
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

    if(!averageIndex) {
      classAverage = 'N/A';
    } else {
      classAverage = (classAverage / averageIndex).toFixed(2) + '%';
    }

    return classAverage;
  }

  handleStudentInput(event) {
    this.setState({ 'newStudent': event.target.value })
  }

  showDeleteStudent(event) {
    const id = event.target.parentElement.parentElement.parentElement.id;
    this.setState({ displayDeleteStudent: id });

  }

  hideDeleteStudent() {
    this.setState({ displayDeleteStudent: false });
  }

  showDeleteClass() {
    this.setState({ displayDeleteClass: true });

  }

  hideDeleteClass() {
    this.setState({ displayDeleteClass: false });
  }

  render() {

    var inputButton = null;

    const allStudents = this.state.students.map(
      student => {
        if(this.state.studentAverages[student.id] !== 'N/A') {
          return (
            <tr key={student.id} id={student.id} className="d-flex">
              <td className="col-2"></td>
              <td className="col-4">
                {student.name}
              </td>
              <td className="col-2"></td>
              <td className="col-3">
                <Link to={this.props.match.url + `/${student.id}`} key={student.id} id={student.id}>
                  {this.state.studentAverages[student.id]}%
                </Link>
              </td>
              <td className="col-1 clickable">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.showDeleteStudent}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
            </tr>
          )
        } else {
          return (
            <tr key={student.id} id={student.id} className="d-flex">
              <td className="col-2"></td>
              <td className="col-4">{student.name}</td>
              <td className="col-2"></td>
              <td className="col-3">N/A</td>
              <td className="col-1">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.showDeleteStudent}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
            </tr>
          )
        }
      }
    )

    if(this.state.students.length) {
      inputButton =
        <Link to={this.props.match.url + "/input"}>
          <button className="btn btn-primary">
            Input Assignment
              </button>
        </Link>
    } else {
      inputButton =
      <div>
          <button className="btn btn-primary disabled hidecursor">
            Input Assignment
          </button>
      </div>
    }


    return (
      <React.Fragment>
        <header className="container-fluid">
          <h1 className="text-center">
            {this.state.title}
          </h1>
          <h2 className="text-center">
            Class Average: {this.handleClassAverage()}
          </h2>
          <div className="row">
            <div className="col-8"></div>
            {inputButton}
            <button className="btn btn-danger hidecursor" onClick={this.showDeleteClass}>
              Delete Class
            </button>
          </div>
        </header>
        <Modal displayDeleteClass={this.state.displayDeleteClass}
                displayDeleteStudent={this.state.displayDeleteStudent}
                hideDeleteClass={this.hideDeleteClass}
                hideDeleteStudent={this.hideDeleteStudent}
                deleteStudent={this.deleteStudent}
                deleteClass={this.props.deleteClass}/>
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
              {allStudents}
              <tr className="d-flex">
                <td className="col-2"></td>
                <td className="col-4">
                  <form onSubmit={this.postStudent}>
                    <input type="text" name="nameinput" placeholder="Enter Student" value={this.state.newStudent} onChange={this.handleStudentInput}></input>
                  </form>
                </td>
                <td className="col-6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}
