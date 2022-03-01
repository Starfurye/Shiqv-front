import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            address: {
                value: "",
                isValid: false,
            },
            image: { value: null, isValid: false },
        },
        false
    );

    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            // formData.append("creator", auth.userId);
            formData.append("image", formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/places",
                "POST",
                formData,
                { Authorization: "Bearer " + auth.token }
            );
            // 重定向
            history.push("/");
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="标题"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="请输入标题"
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="描述"
                    validators={[VALIDATOR_MINLENGTH(1)]}
                    errorText="描述至少为1个字"
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    label="地址"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="请输入地址"
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="请选取一张照片"
                />
                <Button type="submit" disabled={!formState.isValid}>
                    添加
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;