import React from "react";
import ReactDOM from "react-dom";
import StudentList from "./StudentList.jsx";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <StudentList/>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;
