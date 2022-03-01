import React from "react";

import Modal from "./Modal";
import Button from "../FormElements/Button";

const ErrorModal = (props) => {
    return (
        <Modal
            onCancel={props.onClear}
            header="出错啦"
            show={!!props.error}
            footer={<Button onClick={props.onClear}>好</Button>}
        >
            <p>{props.error}</p>
        </Modal>
    );
};

export default ErrorModal;
