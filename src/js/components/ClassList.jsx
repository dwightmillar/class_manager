import React from 'react';

class ClassList extends React.Component {
  render(){
    return(
      <ul id = "tab-list" className = "nav nav-tabs" >
      { this.props.allClasses }
      < li className = "nav-item" >
        <form className="fullheight" onSubmit={this.props.addClass}>
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
    )
  }
}

export default ClassList;
