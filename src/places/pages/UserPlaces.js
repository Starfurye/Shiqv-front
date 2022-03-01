import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

// const DUMMY_PLACES = [
//     {
//         id: "p1",
//         title: "北京市朝阳区阜通东大街6号",
//         description: "One of the most famous sky scrapers in the world!",
//         imageUrl:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//         address: "北京市朝阳区阜通东大街6号",
//         location: {
//             lat: 116.482086,
//             lng: 39.990496,
//         },
//         creator: "u1",
//     },
//     {
//         id: "p2",
//         title: "Emp. State Building",
//         description: "One of the most famous sky scrapers in the world!",
//         imageUrl:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//         address: "20 W 34th St, New York, NY 10001",
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584,
//         },
//         creator: "u2",
//     },
// ];

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;
    useEffect(() => {
        // useEffecet内的第一个参数（函数）前不要直接加async
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
        // 不仅要更新数据库还要更新state
        setLoadedPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== deletedPlaceId)
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={placeDeletedHandler}
                />
            )}
        </React.Fragment>
    );
};

export default UserPlaces;
