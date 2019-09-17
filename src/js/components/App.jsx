import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
import { EventEmitter } from "events";

function Home() {
  return <div>Hello, from Home!</div>;
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],

      newStudent: '',
      newStudentID: '',
      newClassID: '',
      newAssignment: '',
    };

    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.addClass = this.addClass.bind(this);
  }

  componentDidMount() {
    this.retrieveClasses();
  }

  retrieveClasses() {
    fetch("/api/getclasses", {
      method: "GET"
    })
      .then(data => data.json())
      .then(classes => this.setState({ 'classes': classes.data }));
  }

  addClass (event) {
    event.preventDefault();
    if(event.target.children.value == undefined) {
      return false;
    }
    const title = event.target.children[0].value;
    event.target.children[0].value = '';
    fetch("/api/addclass", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: title,
      })
    })
      .then(data => data.json())
      .then(responseObj => {
        const newClassObj = [{ 'id': responseObj.data.insertId, 'title': title }];
        console.log(newClassObj);
        this.setState({ 'classes': this.state.classes.concat(newClassObj)})
    });
  }



  render() {
    var allClasses = this.state.classes.map(
      Class => {
        if(this.props.location.pathname.split("/")[1] == Class.id) {
          return (
            <div key={Class.id} id={Class.id} className="nav-item">
              {Class.title}
            </div>
          )
        } else {
          return (
            <Link to={`/${Class.id}`} key={Class.id} id={Class.id} className="nav-item">
              {Class.title}
            </Link>
          )
        }
      }
    )

    const Display = ({ match }) => {
      return (
        <React.Fragment>
          <div id="tab-list" className="nav nav-tabs" >
            {allClasses}
            <form className="inactive background" onSubmit={this.addClass}>
              <input className="add background" type="text" placeholder="+"
              onFocus={() => {
                event.target.placeholder = 'Enter Name';
                event.target.className = 'input';
                event.target.parentElement.className = 'tab';
                }}
              onBlur={() => {
                event.target.placeholder = '+';
                event.target.className = 'add background';
                event.target.parentElement.className = 'inactive background';
                }}>
              </input>
            </form>
          </div>
          <Switch>
            <Route exact path={match.url} render={(props) => <Class {...props}></Class>} />
            <Route exact path={match.url + "/input"} render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
            <Route path={match.url + "/:studentID"} render={(props) => <Student {...props}></Student>} />
          </Switch>
        </React.Fragment>
      )
    }

    return(
      <React.Fragment>
        <Route exact path="/" component={Home} />
        <Route path="/:classID" component={Display}/>
      </React.Fragment>
    )
  }
}

export default withRouter(App);
