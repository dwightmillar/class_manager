import React from "react";
import controller from "../../../controller";
import Modal from "../../../components/Modal";
import AddAssignment from "./buttons/AddAssignment";
import ToggleClassView from "./buttons/ToggleClassView";
import DeleteClass from "./buttons/DeleteClass";

export default function (props: any) {
	let {
		view,
		title,
		classId,
		assignmentAverages,
		classAverage,
		students,
		toggleView,
		toggleModal,
		setClasses,
	} = props;
	let deleteClass = () =>
		controller.class
			.delete(classId)
			.then(() => setClasses({ data: { id: classId } }))
			.catch((error) => console.error(error));

	let modal = (
		<Modal
			subject={"class"}
			deleteSubject={deleteClass}
			goBack={() => toggleModal()}
		/>
	);

	let numberOfStudents = students.length,
		numberOfAssignments: any = Object.keys(assignmentAverages).length;

	let listLength =
		view === "assignments"
			? `No. of Assignments: ${numberOfAssignments}`
			: `Class Size: ${numberOfStudents}`;

	return (
		<header className='container-fluid'>
			<div style={{ display: "inline-block", height: "40px" }} />
			<div style={{ textAlign: "center" }}>
				<div className='btn-group dropend'>
					<button
						style={{ fontSize: "3rem" }}
						type='button'
						className='btn dropdown-toggle'
						data-bs-toggle='dropdown'
						aria-expanded='false'>
						{title}
					</button>
					<ul className='dropdown-menu'>
						<li>
							<ToggleClassView
								view={view}
								numberOfAssignments={numberOfAssignments}
								toggleView={toggleView}
							/>
						</li>
						<li>
							<AddAssignment {...props} disabled={Boolean(students.length)} />
						</li>
						<li>
							<hr className='dropdown-divider' />
						</li>
						<li>
							<DeleteClass
								showModal={() => {
									toggleModal(modal);
								}}
							/>
						</li>
					</ul>
				</div>
				<h2>{listLength}</h2>
				<h3 style={{ color: "#777" }}>Average Grade: {classAverage}</h3>
			</div>
		</header>
	);
}
