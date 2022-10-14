import React from "react";

export default function ({ numberOfAssignments, view, toggleView }: any) {
	if (numberOfAssignments == 0)
		return <button className='dropdown-item disabled'>View Assignments</button>;

	let text = view === "assignments" ? "View Students" : "View Assignments";
	return (
		<button className='dropdown-item' onClick={toggleView}>
			{text}
		</button>
	);
}
