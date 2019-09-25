import React from 'react';
import Welcome from "./Welcome.jsx";
import ClassView from "./ClassView.jsx";
import Student from "./Student.jsx";
import AssignmentInput from "./AssignmentInput.jsx";
import NotFound from "./NotFound.jsx";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";



class ClassList extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],
      redirectURL: ''
    };

    this.getClasses = this.getClasses.bind(this);
    this.postClass = this.postClass.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.renderNewTab = this.renderNewTab.bind(this);
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
    if (event.target.children[0].value == undefined) {
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
      .then(id => {
        this.setState({ 'redirectURL': id })
      });
  }

  deleteClass() {
    const class_id = this.props.match.params.classID;
    var redirectURL = '';

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
      });
  }

  renderNewTab() {
    var newURL = this.state.redirectURL;
    this.setState({ redirectURL: '' });
    return <Redirect to={`/${newURL}`} />
  }


  render(){
    console.log('ClassList.props: ',this.props);
    if (this.state.redirectURL) {
      return this.renderNewTab();
    }

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

    const Display = () => {

      if (this.state.classes.find(classData => classData.id == this.props.match.params.classID)) {

        return (
          <React.Fragment>
            <Switch>
              <Route path="/:classID/input" render={(props) => <AssignmentInput {...props}></AssignmentInput>} />
              <Route path="/:classID/:studentID" render={(props) => <Student {...props}></Student>} />
              <Route path="/:classID" render={(props) => <ClassView {...props} deleteClass={this.deleteClass}></ClassView>} />

              {/* <Route exact path="/" render={() => (
                this.state.classes.length ? (
                  <Redirect to={`/${this.state.classes[0].id}`} />
                ) : (
                    <React.Fragment>

                      <Welcome />
                    </React.Fragment>
                  )
              )} /> */}
            </Switch>

          </React.Fragment>
        )
      } else {

        return (
          <Welcome />
        )
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

        <Display />
      </React.Fragment>
    )
  }
}

export default ClassList;
