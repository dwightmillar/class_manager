import React, { lazy, Suspense } from 'react'
import Input from "./input.jsx"
const Rows = lazy(() => import("./rows.jsx"))

export default function Students(props)
{
  let {classId, addStudentCallback, deleteStudentCallback, toggleModal, students, averages, assignments, sort} = props
  let {sortByName, sortByGrade} = sort
  return (
      <div className="container-fluid">
        <table className="table table-hover table-striped">
          <thead>
            <tr className="d-flex">
              <th className="col-2"/>
              <th className="col-2">Name &nbsp;<i className="fa fa-sort clickable" aria-hidden="true" onClick={sortByName}></i></th>
              <th className="col-2"/>
              <th className="col-1">Grade &nbsp;<i className="fa fa-sort clickable" aria-hidden="true" onClick={sortByGrade}></i></th>
              <th className="col-2"/>
              <th className="col-2">Options</th>
              <th className="col-1"/>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<tr className="d-flex">
                                  <td className="col-2"/>
                                  <td className="col-2">Loading...</td>
                                </tr>}>
              <Rows {...props} students={students} averages={averages} assignments={assignments} deleteStudentCallback={deleteStudentCallback} toggleModal={toggleModal}/>
              <Input {...props} addStudentCallback={addStudentCallback} classId={classId}/>
            </Suspense>
          </tbody>
        </table>
      </div>
    )
}