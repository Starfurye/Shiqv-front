import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            // readAsDataURL 将会调用该函数
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };
    const pickedHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            // setState不会即时更新状态，只会在引用变量时进行更新
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    return (
        <div className="form-control">
            <input
                type="file"
                ref={filePickerRef}
                id={props.id}
                style={{ display: "none" }}
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                <div
                    className="image-upload__preview"
                    onClick={pickImageHandler}
                >
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p className="preview-add-image">+</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    选取图片
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
