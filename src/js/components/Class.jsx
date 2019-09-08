import React from "react";

export default class Class extends React.Component {
  constructor() {
    super();
    this.state = {
      classAverage: '',
      newTab: ''
    }
    this.createNewTab = this.createNewTab.bind(this);
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
    if (this.props.view !== "class") {
      return false
    }

    var classAverage = 0;
    var averageIndex = 0;

    this.props.studentData.forEach(
      student => {
        if(this.props.studentAverages[student.id] !== undefined) {
          classAverage += parseFloat(this.props.studentAverages[student.id]);
          ++averageIndex;
        }
      }
    )
    classAverage = (classAverage / averageIndex).toFixed(2);



    var allClasses = this.props.classNames.map(
      Class => <div id={Class.id} style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.props.retrieveStudents}>{Class.title}</div>
    )

    var allStudents = this.props.studentData.map(
      student =>
        <div id={student.id} style={{ display: 'flex', flexDirection: 'row' }} onClick={this.props.viewStudent}>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{student.name}</div>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{this.props.studentAverages[student.id]}%</div>
        </div>
    )

    return (
      <React.Fragment>
        <div id="tab-list" style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'lightgrey' }}>
          <div id="add-class" style={{ padding: 10 + 'px', backgroundColor: 'white' }} onClick={this.createNewTab}>+</div>
          {allClasses}
          {this.state.newTab}
        </div>
        <div style={{ width: 100 + '%', height: 60 + 'px' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
            Class Average: {classAverage}%
          </div>
          <button style={{ display: 'inline-block', width: 30 + '%', height: 60 + 'px', marginLeft: 40 + '%' }} onClick={this.props.viewAssignmentInput}>
            Input Assignment
          </button>
          <div style={{ display: 'flex', flexDirection: 'row'}}>
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
