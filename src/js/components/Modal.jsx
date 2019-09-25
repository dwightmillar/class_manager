import React from 'react';

class Modal extends React.Component {
  render() {
    if (this.props.displayDeleteStudent) {
      return (
        <div className="modal show" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure?</h5>

              </div>
              <div className="modal-body">
                <p>Deleting this will <b>permenantly delete</b> all associated data. Would you like to proceed?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.hideDeleteStudent}>Back</button>
                <button id={this.props.displayDeleteStudent} type="button" className="btn btn-danger" onClick={this.props.deleteStudent}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )

    } else if (this.props.displayDeleteClass) {
      return (
        <div className="modal show" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure?</h5>
              </div>
              <div className="modal-body">
                <p>Deleting this will <b>permenantly delete</b> all associated data. Would you like to proceed?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.hideDeleteClass}>Back</button>
                <button id={this.props.displayDeleteStudent} type="button" className="btn btn-danger" onClick={this.props.deleteClass}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default Modal;
