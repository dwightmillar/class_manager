import React from 'react';

class Welcome extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="text-center">Welcome</h1>
        <h2 className="text-center">to Class Manager</h2>
        <p className="text-center">This app was developed to allow the user to keep track of classes with ease,
          using a clean and simple layout. To get started, click the + in the top left corner
          to add a class.
        </p>
      </React.Fragment>
    )
  }
}

export default Welcome;
