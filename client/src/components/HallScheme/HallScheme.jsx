import React, { useContext, useEffect, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { useCallback } from "react";
import { Stage, Circle, Layer, Image as ImageConva } from "react-konva";
import { Button } from "react-bootstrap";
import { ApplContext } from "../../utils/Contexts/ApplContext";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="d-flex flex-column position-absolute top-50 end-0 z-3">
      <Button
        variant="outline-secondary"
        style={{
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontWeight: "bold",
          fontSize: 25,
          padding: 0,
          marginBottom: 10,
        }}
        onClick={() => zoomIn()}
      >
        +
      </Button>
      <Button
        variant="outline-secondary"
        style={{
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontWeight: "bold",
          fontSize: 25,
          padding: 0,
        }}
        onClick={() => zoomOut()}
      >
        -
      </Button>
    </div>
  );
};

export default function HallScheme({
  hall,
  places,
  selectedPlace,
  setSelectedPlaces,
  color,
  service,
  ordersScheme,
}) {
  const [scheme, setScheme] = useState(null);
  const [size, setSize] = useState({});
  const appl = useContext(ApplContext);
  useEffect(() => {
    if (!hall.scheme) return;
    const image = new Image();
    image.src = "/api/assets/halls_schemes/" + hall.scheme;
    setScheme(image);
    fetch("/api/assets/halls_schemes/" + hall.scheme)
      .then((response) => response.text())
      .then((text) => {
        const viewBox = text.match(
          /viewBox\=\"([0-9.]*)\s([0-9.]*)\s([0-9.]*)\s([0-9.]*)\"/
        );
        setSize({
          width: Number(viewBox[3]),
          height: Number(viewBox[4]),
        });
      });
  }, [hall]);

  const selectPlace = (place) => {
    if ((selectedPlace?.length >= appl.config["orders.max_tickets"]) & !service)
      appl.setError("Превышено максимальное количество билетов в заказе");
    else setSelectedPlaces([...selectedPlace, place]);
  };

  return (
    <TransformWrapper initialScale={1}>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <Stage width={size.width} height={size.height}>
              <Layer>
                <ImageConva
                  image={scheme}
                  x={0}
                  y={0}
                  width={size.width}
                  height={size.height}
                />
              </Layer>
              <Layer>
                {places?.map((place) => (
                  <Circle
                    key={place._id}
                    x={Number(place.coordinate.cx)}
                    y={Number(place.coordinate.cy)}
                    radius={Number(place.coordinate.r)}
                    fill={
                      place?.order.is_scanned
                        ? place?.order.is_entered
                          ? "#FF0000"
                          : "#FFFF00"
                        : place.is_booked
                        ? "#3b3b3b"
                        : selectedPlace
                        ? selectedPlace.includes(place._id)
                          ? color
                            ? color
                            : "#02bd24"
                          : place.color
                          ? place.color
                          : "#b5b5b5"
                        : "#b5b5b5"
                    }
                    onTouchStart={() => {
                      if (!setSelectedPlaces) return;
                      if (place.is_booked & !ordersScheme) return;
                      if (ordersScheme === true && !place.is_booked) return;
                      if ((place.tariff === null) & !Boolean(service)) return;
                      if (selectedPlace.includes(place._id))
                        setSelectedPlaces(
                          selectedPlace.filter((el) => el !== place._id)
                        );
                      else selectPlace(place._id);
                    }}
                    onClick={() => {
                      if (!setSelectedPlaces) return;
                      if (place.is_booked & !ordersScheme) return;
                      if (ordersScheme === true && !place.is_booked) return;
                      if ((place.tariff === null) & !Boolean(service)) return;
                      if (selectedPlace.includes(place._id))
                        setSelectedPlaces(
                          selectedPlace.filter((el) => el !== place._id)
                        );
                      else selectPlace(place._id);
                    }}
                  />
                ))}
              </Layer>
            </Stage>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
