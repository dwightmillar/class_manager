import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
import { EventEmitter } from "events";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],
      newClassRedirectURL: ''
    };

    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.addClass = this.addClass.bind(this);
    this.renderNewTab = this.renderNewTab.bind(this);
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
    if(event.target.children[0].value == undefined) {
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
        this.setState({ 'classes': this.state.classes.concat(newClassObj)});
        return responseObj.data.insertId;
      })
      .then(id => {
        this.setState({ 'newClassRedirectURL': id })
      });
  }

  renderNewTab() {
    var newURL = this.state.newClassRedirectURL;
    console.log(newURL);
    this.setState({newClassRedirectURL: ''});
    return <Redirect to={`/${newURL}`}/>
  }

  render() {
    if (this.state.newClassRedirectURL) {
      return this.renderNewTab();
    }

    var allClasses = this.state.classes.map(
      Class => {
        if(this.props.location.pathname.split("/")[1] == Class.id) {
          return (
            <li className="nav-item" key={Class.id}>
              <Link to={`/${Class.id}`} id={Class.id} className="nav-link active">
                {Class.title}
              </Link>
            </li>
          )
        } else {
          return (
            <li className="nav-item" key={Class.id}>
              <Link to={`/${Class.id}`} id={Class.id} className="nav-link">
                {Class.title}
              </Link>
            </li>
          )
        }
      }
    )

    const Display = ({ match }) => {
      var output =
      <React.Fragment>
        <h1>OOPS</h1>
        <h3>The page you are looking for doesn't exist.</h3>
      </React.Fragment>;

      this.state.classes.forEach(() => {
        if (3 == match.url.split('/')[1]) {
          output =
          <React.Fragment>
            <ul id="tab-list" className="nav nav-tabs" >
              {allClasses}
              <li className="nav-item">
                <form className="fullheight" onSubmit={this.addClass}>
                  <input className="addtab" type="text" placeholder="+"
                    onFocus={() => {
                      event.target.placeholder = 'Enter Class';
                      event.target.className = 'nav-link';
                    }}
                    onBlur={() => {
                      event.target.placeholder = '+';
                      event.target.className = 'addtab';
                      event.target.value = '';
                    }}>
                  </input>
                </form>
              </li>
            </ul>
            <Switch>
              <Route exact path={match.url} render={(props) => <Class {...props}></Class>} />
              <Route exact path={match.url + "/input"} render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
              <Route path={match.url + "/:studentID"} render={(props) => <Student {...props}></Student>} />
            </Switch>
          </React.Fragment>
        }
      })

      return output;
    }

    const nonExistent = () => {
      return (
        <React.Fragment>
          <h1>OOPS</h1>
          <h3>The page you are looking for doesn't exist.</h3>
        </React.Fragment>
      )
    }

    if (!this.state.classes[0]) {
      return <div>NO CLASSES</div>
    } else {
      return (
        <React.Fragment>
          <Route exact path="/" render={() => (
            this.state.classes ? (
              <Redirect to={`/${this.state.classes[0].id}`} />
            ) : (
              {nonExistent}
            ))} />
          <Route path="/:classID" component={Display} />
        </React.Fragment>
      )
    }
  }
}

export default withRouter(App);
