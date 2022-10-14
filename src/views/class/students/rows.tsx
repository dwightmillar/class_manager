import React, { lazy } from "react";
import { Link } from "react-router-dom";
import controller from "../../../controller";
const Modal = lazy(() => import("../../../components/Modal"));

export default function ({
	match,
	students,
	averages,
	assignments,
	deleteStudentCallback,
	toggleModal,
}: any) {
	return students.map((student: any, index: any) => {
		let { name, id } = student;
		let deleteStudent = () =>
			controller.student
				.delete(id)
				.then(() => deleteStudentCallback(id))
				.catch((error) => console.error(error));
		let average = !isNaN(averages[student.id])
			? `${averages[student.id]}%`
			: "N/A";
		let studentAssignments = assignments
			.filter((assignment: any) => assignment.student_id == id)
			.sort((a: any, b: any) => a.id - b.id);
		let modal = (
			<Modal
				subject={"student"}
				deleteSubject={deleteStudent}
				goBack={() => toggleModal()}
			/>
		);
		let trendArrow;

		if (studentAssignments.length > 1) {
			let latestAssignment = studentAssignments.pop();
			let latestAssignmentPercentage =
				(latestAssignment.score / latestAssignment.totalpoints) * 100;

			let totalPointsScored = 0;
			let totalPointsPossible = 0;

			studentAssignments.forEach((assignment: any) => {
				if (!isNaN(assignment.score))
					totalPointsScored += parseInt(assignment.score);
				totalPointsPossible += parseInt(assignment.totalpoints);
				return false;
			});

			let previousAverage: any =
				totalPointsPossible !== 0
					? ((totalPointsScored / totalPointsPossible) * 100).toFixed(2)
					: "N/A";

			if (latestAssignmentPercentage < previousAverage)
				trendArrow = (
					<i
						className='fa fa-arrow-down'
						style={{ color: "red" }}
						aria-hidden='true'></i>
				);
			else if (latestAssignmentPercentage > previousAverage)
				trendArrow = (
					<i
						className='fa fa-arrow-up'
						style={{ color: "green" }}
						aria-hidden='true'></i>
				);
		}

		let assignmentsLink = studentAssignments.length ? (
			<Link to={match.url + `/${id}`}>
				<i
					className='fa fa-list-ul fa-lg clickable'
					aria-hidden='true'
					data-toggle='tooltip'
					data-placement='bottom'
					title='List Assignments'></i>
			</Link>
		) : null;

		return (
			<tr className='d-flex' key={index}>
				<td className='col-2' />
				<td className='col-2'>{name}</td>
				<td className='col-2' />
				<td className='col-1'>
					{average}
					{trendArrow}
				</td>
				<td className='col-2' />
				<td className='col-1'>{assignmentsLink}</td>
				<td className='col-1'>
					<i
						style={{ color: "crimson" }}
						className='fa fa-times fa-lg clickable'
						onClick={() => toggleModal(modal)}
						data-toggle='tooltip'
						data-placement='bottom'
						title='Delete Student'></i>
				</td>
				<td className='col-1' />
			</tr>
		);
	});
}
