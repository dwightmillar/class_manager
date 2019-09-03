import React from "react";

export default class Student extends React.Component {
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
        <div id="class" style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}>
          {this.props.children}
        </div>
      )
    }
  }
}
