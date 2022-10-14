import React, { MouseEventHandler } from "react";

export default function ({ showModal }: { showModal: MouseEventHandler }) {
	return (
		<button
			style={{ color: "crimson" }}
			className='dropdown-item btn'
			onClick={showModal}>
			Delete Class
		</button>
	);
}
