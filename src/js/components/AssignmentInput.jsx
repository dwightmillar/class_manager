import React from "react";

export default class Assignment extends React.Component {
  constructor() {
    super()

  }


  render() {
    if (this.props.view !== 'assignmentinput') {
      return false
    }
    console.log(this.props.scores);

    var allStudents = this.props.studentData.map(
      student =>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{student.name}</div>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>
            <input id={student.id} type="text" value={this.props.scores[student.id]} onChange={this.props.handleScoreInput} style={{ display: 'inline-block', width: 2 + '%', height: 20 + 'px' }}>
            </input>/
            <input type="text" value={this.props.maxPoints} onChange={this.props.handleMaxPointsInput} style={{ display: 'inline-block', width: 2 + '%', height: 20 + 'px' }}>
            </input>
          </div>
        </div>
    )

    return (
      <React.Fragment>
        <div style={{ width: 100 + '%', height: 60 + 'px' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
          </div>
          <input type="text" value={this.props.newAssignment} onChange={this.props.handleAssignmentInput} style={{ display: 'inline-block', width: 30 + '%', height: 60 + 'px', marginLeft: 40 + '%' }}></input>
          <button style={{ width: 7 + '%', height: 30 + 'px' }} onClick={this.props.addAssignment}>
            Submit
        </button>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Name</div>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Grade</div>
          </div>
          {allStudents}
        </div>
      </React.Fragment>
    )
  }
}
