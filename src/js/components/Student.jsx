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

      return (
        <div id={this.props.id} onClick={this.props.retrieveAssignments} style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}>
          {this.props.children}
        </div>
      )
    }
  }
}
