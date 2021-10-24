import React from 'react'

export default function({assignments, handleScoreChange, scores})
{
  return (
    assignments.map(({id, title, totalpoints}) => {
        scores[id] = !isNaN(parseInt(scores[id])) ? scores[id] : ''
        return (
            <tr key={id} className="d-flex">
                <td className="col-3"/>
                <td className="col-2">{title}</td>
                <td className="col-2"/>
                <td className="col-2"><input style={{width: '60px'}} className="points" type="text" value={scores[id]} placeholder={scores[id]} onChange={({currentTarget})=>handleScoreChange(id, currentTarget.value)}/>&nbsp;/&nbsp;{totalpoints}</td>
                <td className="col-3"/>
            </tr>
        )
    })
  )
}