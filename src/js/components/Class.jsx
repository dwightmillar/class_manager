import React from "react";

export default class Class extends React.Component {
  constructor() {
    super()
    this.state = {
      display: true,
    }
  }


  render() {
    if (!this.state.display) {
      return false
    } else {
      // var allStudents = this.props.retrieveStudents().map(
      //   student => <div style={{'height': 10 + 'vh', 'width': 10 + 'vw'}}>{student.name}</div>
      // )

      return (
        <button id="class" onClick={this.props.retrieveStudents} style={{ 'height': 5 + 'vh', 'width': 5 + 'vw' }}>
        {this.props.children}
        </button>
      )
    }
  }
}
