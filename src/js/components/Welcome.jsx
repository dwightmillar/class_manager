import React from 'react';

class Welcome extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Welcome</h1>
        <h2>to Class Manager</h2>
        <p>This app was developed to allow the user to keep track of classes with ease,
          with a clean and simple layout. To get started, click the + in the top left corner
          to add a class.
        </p>
      </React.Fragment>
    )
  }
}

export default Welcome;
