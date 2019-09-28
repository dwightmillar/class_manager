import React from 'react';
import ClassView from "./ClassView.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
import NotFound from "./NotFound.jsx";
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import history from '../../history.js';
import Welcome from './Welcome.jsx';


class ClassList extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: []
    };

    this.getClasses = this.getClasses.bind(this);
    this.postClass = this.postClass.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
  }

  componentDidMount() {
    this.getClasses();
  }

  getClasses() {
    fetch("/api/getclasses", {
      method: "GET"
    })
      .then(data => data.json())
      .then(classes => this.setState({ 'classes': classes.data }));
  }

  postClass(event) {
    event.preventDefault();
    console.log(event.target.children[0].value);
    if (event.target.children[0].value === '') {
      console.log('entered postclass');
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
        this.setState({ 'classes': this.state.classes.concat(newClassObj) });
        return responseObj.data.insertId;
      })
      .then(id => {history.push('/' + id)});
  }

  deleteClass() {
    const class_id = this.props.match.params.classID;
    const class_index = this.state.classes.findIndex(
      Class => Class.id == class_id
    );

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
      .then(response => {
        if (response.success) {
          this.setState({
            classes: this.state.classes.filter(
              Class => {
                if (Class.id != class_id) return Class
              }
            ),
            displayDeleteClass: false
          })
        } else {
          console.error('FAILED TO DELETE: ', response)
        }
      })
      .then(() => {
        var new_class_id = '';
        if (this.state.classes[class_index]) {
          new_class_id = this.state.classes[class_index].id;
        } else if (this.state.classes[class_index - 1]){
          new_class_id = this.state.classes[class_index - 1].id;
        } else {
          new_class_id = 'welcome';
        }
        history.replace('/' + new_class_id);
      });
  }


  render(){

    var allClasses = this.state.classes.map(
      Class => {
          return (
            <li className="nav-item" key={Class.id}>
              <Link to={`/${Class.id}`} id={Class.id}
              className={this.props.match.params.classID == Class.id ? 'nav-link active' : 'nav-link'}>
                {Class.title}
              </Link>
            </li>
          )
      }
    )

    let currentClassTitle = this.state.classes.find(Class => Class.id == this.props.match.params.classID);

    if(currentClassTitle){
      currentClassTitle = currentClassTitle.title;
    }

    const Display = () => {

      if (this.state.classes.find(classData => classData.id == this.props.match.params.classID)) {

        return (
          <React.Fragment>
            <Switch>
              <Route path="/:classID/input" render={(props) => <AssignmentInput {...props} title={currentClassTitle}></AssignmentInput>} />
              <Route path="/:classID/:studentID" render={(props) => <Student {...props}></Student>} />
              <Route path="/:classID" render={(props) => <ClassView {...props} deleteClass={this.deleteClass} title={currentClassTitle}></ClassView>} />
            </Switch>

          </React.Fragment>
        )
      } else {
          if (this.state.classes.length) {
            history.replace('/' + this.state.classes[0].id);
          } else {
            history.replace('/welcome');
          }
           return null
      }
    }

    return(
      <React.Fragment>
        <ul id="tab-list" className="nav nav-tabs" >
          {allClasses}
          < li className="nav-item" >
            <form className="fullheight" onSubmit={this.postClass}>
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
        </ul >

        <Switch>
          <Route path="/welcome" render={() => <Welcome />} />
          <Route path={this.props.match.url} render={() => <Display />} />
        </Switch>
      </React.Fragment>
    )
  }
}

export default ClassList;
