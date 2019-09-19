import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import Class from "./Class.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
import ClassList from "./ClassList.jsx";
import NotFound from "./NotFound.jsx";
import Welcome from "./Welcome.jsx";
import { EventEmitter } from "events";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],
      redirectURL: ''
    };

    this.retrieveClasses = this.retrieveClasses.bind(this);
    this.addClass = this.addClass.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
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
        this.setState({ 'redirectURL': id })
      });
  }

  deleteClass() {
    const class_id = this.props.location.pathname.slice(1);
    var redirectURL = '';

    this.state.classes.forEach(
      (Class, index) => {
        if (Class.id == class_id) {
          const currentClassList = this.state.classes;
          var newClassList = [];

          if (currentClassList.length > 1) {
            newClassList = currentClassList.slice(0, index).concat(currentClassList.slice(index + 1, currentClassList.length + 1));
          }

          if (newClassList[index]) {
            redirectURL = newClassList[index].id;
          } else if (this.state.classes.length > 1) {
            redirectURL = newClassList[index - 1].id;
          }

          this.setState({ 'classes': newClassList, 'redirectURL': redirectURL });
        }
      }
    )

    fetch("/api/deleteclass", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE",
      body: JSON.stringify({
        id: class_id,
      })
    })
      .then(data => data.json())
      .then(response => console.log(response));
  }

  renderNewTab() {
    var newURL = this.state.redirectURL;
    console.log(newURL);
    this.setState({redirectURL: ''});
    return <Redirect to={`/${newURL}`}/>
  }

  render() {
    if (this.state.redirectURL) {
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
      console.log('outside if:',this.props.location);
      console.log('outside if:', match.url.split('/')[1]);
      console.log(this.state.classes);

      if (this.state.classes.find(classData => classData.id == match.url.split('/')[1])) {

        console.log('inside if:',this.props.location);

        return (
          <React.Fragment>

             <ClassList allClasses={allClasses} addClass={this.addClass} />

             <Switch>
               <Route exact path={match.url} render={(props) => <Class {...props} deleteClass={this.deleteClass}></Class>} />
               <Route exact path={match.url + "/input"} render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
               <Route path={match.url + "/:studentID"} render={(props) => <Student {...props}></Student>} />
             </Switch>

           </React.Fragment>
        )
      }
      else {

        return (
          <React.Fragment>
            <ClassList allClasses={allClasses} addClass={this.addClass} />
          </React.Fragment>
        )
      }
    }
      return (
        <React.Fragment>
          <Route exact path="/" render={() => (
            this.state.classes.length ? (
              <Redirect to={`/${this.state.classes[0].id}`} />
            ) : (
              <React.Fragment>
                  <ClassList allClasses={allClasses} addClass={this.addClass}/>
                  <Welcome />
              </React.Fragment>
            )
          )} />
          <Route path="/:classID" component={Display} />
        </React.Fragment>
      )
    }
  }
// }

export default withRouter(App);
