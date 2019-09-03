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
      return (
        <button id={this.props.id} onClick={this.props.retrieveStudents} style={{ 'height': 5 + 'vh', 'width': 5 + 'vw' }}>
        {this.props.children}
        </button>
      )
    }
  }
}
