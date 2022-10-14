import React, { FormEventHandler, useState } from "react";
import controller from "../../../controller";

var lettersOnlyRegex = /[^-A-Za-z\s]/;

export default function ({ addStudentCallback, classId }: any) {
	const defaultState = {
		placeholder: "New Student",
		input: "",
		isDisabled: false,
	};
	const [state, setState] = useState({ ...defaultState });

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		if (!checkStudentName(state.input)) return;

		controller.student
			.add(state.input, classId)
			.then(({ data }) => addStudentCallback(data, state.input))
			.catch((error) => console.error(error));
		setState({ ...defaultState });
	};

	function checkStudentName(studentName: any) {
		let placeholder: any = false;
		if (lettersOnlyRegex.test(studentName))
			placeholder = "Can only use letters";
		else if (studentName.length < 2) placeholder = "Too short";

		if (placeholder) {
			setState({
				...defaultState,
				placeholder,
			});
			return false;
		}
		return true;
	}

	return (
		<tr className='d-flex input'>
			<td className='col-2' />
			<td className='col-2'>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						style={{ width: "100%" }}
						autoFocus
						name='nameinput'
						placeholder={state.placeholder}
						value={state.input}
						onChange={({ currentTarget }) =>
							setState({ ...state, input: currentTarget.value })
						}
						disabled={state.isDisabled}></input>
				</form>
			</td>
			<td className='col-8' />
		</tr>
	);
}
