import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

export default function(props)
{
  let {match, disabled} = props
  if (!disabled) return <a className="dropdown-item disabled">Add Assignment</a>
  return <Link to={match.url + "/assignment"} className="dropdown-item">Add Assignment</Link>
}