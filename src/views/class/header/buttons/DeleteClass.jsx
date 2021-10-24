import React from 'react'

export default function({showModal})
{
    return (
        <button style={{color: 'crimson'}} className="dropdown-item btn" onClick={showModal}>Delete Class</button>
    )
}