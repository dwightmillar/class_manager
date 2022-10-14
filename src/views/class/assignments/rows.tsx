import React, { ReactElement } from "react";

const Rows: ({
	assignments,
	averages,
}: {
	assignments: any;
	averages: any;
}) => ReactElement = ({ assignments, averages }) => {
	return (
		<>
			{Object.keys(averages).map((title, index) => {
				return (
					<tr className='d-flex' key={index}>
						<td className='col-3' />
						<td className='col-2'>{title}</td>
						<td className='col-1' />
						<td className='col-1'>{averages[title]}</td>
						<td className='col-2' />
						<td className='col-3'>
							{
								assignments.find(
									(assignment: any) => assignment.title === title
								)?.totalpoints
							}
						</td>
					</tr>
				);
			})}
		</>
	);
};

export default Rows;
