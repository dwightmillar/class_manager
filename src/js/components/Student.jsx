import React from "react";

export default class Student extends React.Component {
  constructor() {
    super()
    this.state = {
      display: true,
    }

    this.handleMaxPointsInput = this.handleMaxPointsInput.bind(this);
    this.handleScoreInput = this.handleScoreInput.bind(this);
  }

  handleMaxPointsInput(event) {
    this.props.handleMaxPointsInput(event);
  }

  handleScoreInput(event) {
    event.preventDefault();
    this.props.handleScore(event);
  }


  render() {
    if (this.props.view !== "student" || !this.props) {
      return false
    }

    if (!this.props.data) {
      return false
    }

    console.log(this.props.data);

    var allAssignments = this.props.data.map(
      assignment =>
        <div id={assignment.id} style={{ display: 'flex', flexDirection: 'row' }} onClick={this.props.retrieveAssignments}>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{assignment.title}</div>
          <div style={{ width: 50 + '%', height: 100 + '%' }}>{assignment.score}/{assignment.totalpoints}</div>
        </div>
    )

    return (
      <React.Fragment>

        <div style={{ width: 100 + '%', height: 60 + 'px' }}>
          <div style={{ display: 'inline-block', width: 25 + '%', height: 60 + 'px' }}>
            Grade Average:
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Name</div>
            <div style={{ width: 50 + '%', height: 100 + '%' }}>Grade</div>
          </div>
          {allAssignments}
        </div>
        <button style={{ width: 20 + '%', height: 60 + 'px', marginLeft: 70 + '%' }} onClick={this.props.viewClass}>
          Back
        </button>
      </React.Fragment>
    )
  }
}
