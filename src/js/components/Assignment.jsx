import React from "react";

export default class Assignment extends React.Component {
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
        <div id={this.props.id} style={{ 'height': 10 + 'vh', 'width': 10 + 'vw' }}>
          {this.props.children}
        </div>
      )
    }
  }
}
