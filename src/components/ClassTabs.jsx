import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import controller from '../controller.js'

export default function(props)
{
  let {classes, setClasses} = props

  return (
    <nav>
      <ul id="tab-list" className="nav nav-tabs" >
        { classes ? 
          <>
            <NavTabs {...props} classes={classes}/>
            <AddClassTab key="tab-0" setClasses={setClasses}/>
          </>
          :
          null}
      </ul >
    </nav>
  )
}

function NavTabs(props)
{
  return props.classes.map((data, index, array) => <NavTab {...props} data={data} key={'tab-'+(array.length - index)}/>)
}

function NavTab({ data })
{
    let { id, title } = data
    let destination = '/' + id
    return (
        <li className="nav-item">
            <NavLink to={destination} className="nav-link" activeClassName="nav-link active">
                {title}
            </NavLink>
        </li>
    )
}

function AddClassTab({setClasses})
{
    const [state, setState] = useState({
      placeholder: '+',
      className: 'addtab',
      value: ''
    })

    let showInput = () => {
      setState({
        ...state,
        placeholder: 'Enter Class',
        className: 'nav-link'
      })
    }

    let showIcon = () => {
      setState({
        ...state,
        placeholder: '+',
        className: 'addtab'
      })
    }

    let updateValue = ({currentTarget}) => {
      setState({
        ...state,
        value: currentTarget.value
      })
    }

    let submitHandler = (event) => {
      event.preventDefault()
      controller.class.add(state.value)
      .then(({data}) => {
        setClasses({'data': {'title': state.value, 'id': data.insertId}})
        setState({
          ...state,
          value: ''
        })
      })
      .catch(error => console.error(error))
    }

    return (
      <li className="nav-item">
        <form className="fullheight" onSubmit={submitHandler}>
          <input id="add-class" type="text"
            style={{display: 'inline-block', border: 'none', cursor: 'pointer', padding: '0.1em 0 0 1em', height: '40px', width: 'fit-content' }}
            className={state.className}
            placeholder={state.placeholder}
            value={state.value}
            onChange={updateValue}
            onFocus={showInput}
            onBlur={showIcon}
          />
        </form>
      </li>
    )
}