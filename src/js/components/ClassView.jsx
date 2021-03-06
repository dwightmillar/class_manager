import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Modal from './Modal.jsx';
import { match } from "minimatch";

export default class ClassView extends React.Component {
  constructor() {
    super();
    this.state = {
      classAverage: 'Calculating...',
      newStudent: '',
      studentAverages: {},
      students: [],
      assignments: [],
      displayDeleteStudent: false,
      displayDeleteClass: false,
      disableForm: false,
      inputPlaceholder: 'Enter Student'
    }
    this.getStudents = this.getStudents.bind(this);
    this.postStudent = this.postStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.showDeleteStudent = this.showDeleteStudent.bind(this);
    this.showDeleteClass = this.showDeleteClass.bind(this);
    this.hideDeleteStudent = this.hideDeleteStudent.bind(this);
    this.hideDeleteClass = this.hideDeleteClass.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.handleClassAverage = this.handleClassAverage.bind(this);
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
        students.data.map(
          student => this.getAssignments(student.id)
        );
        if (students.data.length) {
          this.setState({ 'students': students.data });
        } else {
          this.setState({'classAverage': 'N/A'})
        }
      })
  }

  deleteStudent(event) {
    const id = parseInt(event.target.id);
    fetch("/class_manager/api/students", {
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
      .then(response => {
        if(!response.success) {
          console.error('FAILED TO DELETE: ', response)
        }
        else {
          let studentAverages = this.state.studentAverages;
          console.log('studentAverages before delete: ', studentAverages);
          delete studentAverages[id];
          console.log('studentAverages after delete: ', studentAverages);

          this.setState({
            students: this.state.students.filter(
              student => {
                if (student.id !== id) return student
              }
            ),
            studentAverages: studentAverages,
            displayDeleteStudent: false
          });
          this.handleClassAverage();
        }
      });
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

  postStudent(event) {
    event.preventDefault();
    console.log('posting student');

    this.setState({disableForm: true});

    var studentName = this.state.newStudent;
    var lettersOnlyCheck = /[^-A-Za-z\s]/;
    if (lettersOnlyCheck.test(studentName)) {
      this.setState({ inputPlaceholder: 'Can only use letters',
                      newStudent: '' ,
                      disableForm: false });
      return false;
    } else if (this.state.newStudent.length < 2) {
      this.setState({ inputPlaceholder: 'Too short',
                      newStudent: '' ,
                      disableForm: false });
      return false;
    }

    const class_id = this.props.match.params.classID;

    fetch("/class_manager/api/students", {
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
    .then(response => {
      if (response.success){
        this.setState({
          'newStudentID': response.data.insertId
        });
        this.handleClassAverage();
        this.addStudentDirect(class_id);
      } else {
        console.error('FAILED TO ADD: ', response);
      }
    });
  }

  addStudentDirect(class_id) {
    const newStudentObj = [{ 'class_id': class_id, 'id': this.state.newStudentID, 'name': this.state.newStudent }];
    this.setState({ 'students': this.state.students.concat(newStudentObj) });
    this.handleStudentGradeAverage(this.state.newStudentID, []);
    this.setState({ 'newStudent': '', 'newStudentID': '' });
    this.setState({disableForm: false});
  }

  handleStudentGradeAverage(id, data) {
    let studentAverage = this.state.studentAverages;
    let totalPointsScored = 0;
    let totalPointsPossible = 0;
    let average = 0;

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
      average = (totalPointsScored / totalPointsPossible * 100).toFixed(2);
    } else {
      average = 'N/A';
    }

    studentAverage[id] = average;

    this.setState({ studentAverages: studentAverage });

    this.handleClassAverage();
  }

  handleClassAverage() {
    var classAverage = 0;
    var averageIndex = 0;

    for(let studentAverage in this.state.studentAverages) {
      if (this.state.studentAverages[studentAverage] !== 'N/A') {
        classAverage += parseFloat(this.state.studentAverages[studentAverage]);
        ++averageIndex;
      }
    }

    if (!averageIndex) {
      classAverage = 'N/A';
    } else if (isNaN(classAverage / averageIndex)) {
      return false;
    } else {
      classAverage = (classAverage / averageIndex).toFixed(2) + '%';
    }

    this.setState({classAverage: classAverage});
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

  renderModal() {
    if(this.state.displayDeleteClass) {
      return {
        display: 'modal show',
        delete: this.props.deleteClass,
        hideModal: this.hideDeleteClass
      }
    } else if (this.state.displayDeleteStudent) {
      return {
        display: 'modal show',
        delete: this.deleteStudent,
        hideModal: this.hideDeleteStudent,
        deleteID: this.state.displayDeleteStudent
      }
    } else {
      return {
        display: 'modal'
      }
    }
  }

  render() {

    var inputButton = null;
    var input = null;

    const allStudents = this.state.students.map(
      student => {
        if(!isNaN(this.state.studentAverages[student.id])) {
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
                  <div>&times;</div>
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
                  <div>&times;</div>
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

    input =
      <input type="text" autoFocus name="nameinput"
      placeholder={this.state.inputPlaceholder}
      value={this.state.newStudent} onChange={this.handleStudentInput}
      disabled={this.state.disableForm}>
      </input>


    return (
      <React.Fragment>
        <header className="container-fluid">
          <h1 className="text-center">
            {this.props.title}
          </h1>
          <h2 className="text-center">
            Class Average: {this.state.classAverage}
          </h2>
          <div className="row">
            <div className="col-6">
              <div className="text-center">
                {inputButton}
              </div>
            </div>
            <div className="col-6">
              <div className="text-center">
                <button className="btn btn-danger" onClick={this.showDeleteClass}>
                  Delete Class
              </button>
              </div>
            </div>
          </div>
        </header>
        <Modal renderModal={this.renderModal}/>
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
              <tr className="d-flex input">
                <td className="col-2"></td>
                <td className="col-4">
                  <form onSubmit={this.postStudent} onFocusOut={this.postStudent}>
                    {input}
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
