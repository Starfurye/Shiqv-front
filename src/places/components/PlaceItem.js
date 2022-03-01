import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";

const PlaceItem = (props) => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            props.onDelete(props.id);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={15} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="确定删除？"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>
                            取消
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            删除
                        </Button>
                    </React.Fragment>
                }
            >
                <p>确认删除？该操作不能撤销。</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverLay />}
                    <div className="place-item__image">
                        <img
                            src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                            alt={props.title}
                        />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            看看地图
                        </Button>
                        {auth.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>编辑</Button>
                        )}
                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                删除
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;
