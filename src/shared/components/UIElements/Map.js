import React, { useEffect } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

import "./Map.css";

const Map = (props) => {
    useEffect(() => {
        let map;
        AMapLoader.load({
            key: process.env.REACT_APP_AMAP_JSAPI_KEY,
            version: "2.0",
            plugins: ["AMap.ToolBar"],
        })
            .then((AMap) => {
                map = new AMap.Map("map-container", {
                    viewMode: "2D",
                    zoom: props.zoom,
                    center: [props.center.lat, props.center.lng],
                });
                map.add(
                    new AMap.Marker({
                        position: map.getCenter(),
                    })
                );
            })
            .catch((e) => {
                console.log(e);
            });
    }, [props]);

    return (
        <div
            id="map-container"
            className="map"
            style={{ height: "400px" }}
        ></div>
    );
};

export default Map;
