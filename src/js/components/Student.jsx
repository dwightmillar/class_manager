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
    if (!this.state.display) {
      return false
    } else {

      return (
        <div>
          <div
            onClick={this.props.retrieveAssignments}
            style={{'display': 'inline-block',
                    'height': 10 + 'vh',
                    'width': 5 + 'vw' }}>
            {this.props.children}
          </div>
          <div
            style={{'display': 'inline-block',
                    'height': 3 + 'vh',
                    'width': 5 + 'vw' }}>
              <input
                type="text"
                id={this.props.id}
                value={this.props.score}
                onChange={this.handleScoreInput}
                style={{
                  'display': 'inline-block',
                  'height': 3 + 'vh',
                  'width': 2 + 'vw'
                }}>
              </input>/
            <input
              type="text"
              value={this.props.maxPoints}
              onChange={this.handleMaxPointsInput}
              style={{'display': 'inline-block',
                      'height': 3 + 'vh',
                      'width': 2 + 'vw' }}>
            </input>
          </div>
        </div>
      )
    }
  }
}
