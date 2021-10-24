import React from "react"

export default function(props)
{
  let { studentId, score = '', max, handleScoreInput, error } = props
  return (
    <div>
      <input type="text" style={{width: '60px'}} className={(score === '' && error) ? 'error' : undefined} value={score} placeholder={"Score"} onChange={({currentTarget}) => handleScoreInput(studentId, currentTarget.value)}/>&nbsp;/&nbsp;{max}
    </div>
  )
}
