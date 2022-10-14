import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

const BackButton: ({
	url,
	text,
}: {
	url: string;
	text: string;
}) => ReactElement = function ({ url, text }) {
	return (
		<div style={{ padding: "1em 0 0 2em" }}>
			<Link
				to={url}
				style={{ textDecoration: "none", color: "grey", fontWeight: "bolder" }}>
				<i className='fa fa-chevron-left' aria-hidden='true' />
				&nbsp;&nbsp;&nbsp;{text}
			</Link>
		</div>
	);
};

export default BackButton;
