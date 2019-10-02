import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Welcome from "./Welcome.jsx";
import ClassList from "./ClassList.jsx";
import { EventEmitter } from "events";

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
      return (
        <React.Fragment>
          <Route exact path="../" render={() => <Redirect to='/ ' />} />
          <Route path="../:classID" render={(props) => (
            <ClassList {...props}/>
          )} />

        </React.Fragment>
      )
    }
  }

export default withRouter(App);
