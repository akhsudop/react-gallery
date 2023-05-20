import { Component } from "react";
import PropTypes from "prop-types";

import css from "../Modal/Modal.module.css";

export class MyModal extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.closeByKey);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.closeByKey);
  }

  closeByKey = (evt) => {
    if (evt.key === "Escape") {
      return this.props.onClose();
    }
  };

  handleClose = (evt) => {
    if (evt.target.nodeName === "DIV") {
      console.log(evt.currentTarget.nodeName);
      return this.props.onClose();
    }
  };

  render() {
    return (
      <div className={css.overlay} onClick={this.handleClose}>
        <div className={css.modal}>
          <img
            src={this.props.clickedImg}
            alt="Large gallery image"
            loading="lazyload"
            width="850"
          />
        </div>
      </div>
    );
  }
}

MyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  clickedImg: PropTypes.string.isRequired,
};
