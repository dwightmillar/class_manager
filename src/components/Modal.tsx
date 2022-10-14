import React, { ReactElement } from "react";

const Modal: (prop: any) => ReactElement = (props) => {
	let { subject, deleteSubject, goBack } = props;

	return (
		<div
			style={{ display: "inline-block" }}
			className='modal'
			tabIndex={-1}
			role='dialog'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>Deleting {subject}</h5>
					</div>
					<div className='modal-body'>
						<p>
							Deleting this will <b>permanently</b> delete <b>all</b> associated
							data.
							<br />
							Are you sure you want to delete?
						</p>
					</div>
					<div className='modal-footer'>
						<button
							autoFocus
							type='button'
							className='btn btn-secondary'
							data-dismiss='modal'
							onClick={goBack}>
							Back
						</button>
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => {
								deleteSubject();
								goBack();
							}}>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
