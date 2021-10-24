import React, { lazy, Suspense } from 'react'
const Rows = lazy(() => import("./rows.jsx"))

export default function Assignments({ assignments, averages })
{
    return (
        <div className="container-fluid">
            <table className="table table-hover table-striped">
                <thead>
                    <tr className="d-flex">
                        <th className="col-3"/>
                        <th className="col-2">Title</th>
                        <th className="col-1"/>
                        <th className="col-1">Average</th>
                        <th className="col-2"/>
                        <th className="col-3">Points</th>
                    </tr>
                </thead>
                <tbody>
                    <Suspense fallback={<tr className="d-flex">
                                            <td className="col-3"/>
                                            <td className="col-2">Loading...</td>
                                        </tr>}>
                        <Rows assignments={assignments} averages={averages}/>
                    </Suspense>
                </tbody>
            </table>
        </div>
    )
}