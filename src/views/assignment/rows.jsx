import React from "react"
import Input from "./input.jsx"

export default function({data, scores, max, handleScoreInput, error})
{
  return data.map( ({name, id}, index) => {
    return (
      <tr className="d-flex" key={index}>
        <td className="col-3"/>
        <td className="col-2">{name}</td>
        <td className="col-2"/>
        <td className="col-2"><Input studentId={id} score={scores[id]} max={max} handleScoreInput={handleScoreInput} error={error}/></td>
        <td className="col-3"></td>
      </tr>
    )
  })
}