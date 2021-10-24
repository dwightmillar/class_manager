import React from 'react'

export default function({ assignments, averages })
{
  return (
    Object.keys(averages).map((title, index) => {
        return (
            <tr className="d-flex" key={index}>
                <td className="col-3"/>
                <td className="col-2">{title}</td>
                <td className="col-1"/>
                <td className="col-1">{averages[title]}</td>
                <td className="col-2"/>
                <td className="col-3">{assignments.find(assignment => assignment.title === title)?.totalpoints}</td>
            </tr>
        )
    })
  )
}