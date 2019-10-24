import React from 'react';

class Modal extends React.Component {
  render() {
    return (
      <div className={this.props.renderModal().display} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Are you sure?</h5>
            </div>
            <div className="modal-body">
              <p>Deleting this will <b>permanently delete</b> all associated data. Would you like to proceed?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.renderModal().hideModal}>Back</button>
              <button autoFocus id={this.props.renderModal().deleteID ? this.props.renderModal().deleteID : undefined} type="button" className="btn btn-danger" onClick={this.props.renderModal().delete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal;
