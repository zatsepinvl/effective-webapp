import React, { useState, useCallback, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Col, Input, Row, Switch } from "antd";
import * as geohash from "ngeohash";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

const containerStyle = {
  width: "100%",
  height: "460px",
};

const libraries: Libraries = ["places", "geometry"];

function MapMain(props: { apiKey: string, center: google.maps.LatLngLiteral }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
    libraries,
  });

  const mapRef = useRef<google.maps.Map>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const [center, setCenter] = useState(props.center);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [draggable, setDraggable] = useState(false);


  useEffect(() => {
    if (!markerPosition || !geocoder) {
      return;
    }

    geocoder.geocode({ location: markerPosition }, (results, status) => {
      if (status === "OK") {
        if (results) {
          setSearchedAddress(results[0].formatted_address);
        }
      } else {
        alert(`Geocode was not successful for the following reason: ${status}`);
      }
    });
  }, [markerPosition, geocoder]);

  useEffect(() => {
    if (!markerPosition) {
      return;
    }
    const ghash = geohash.encode(markerPosition.lat(), markerPosition.lng(), 4);
    console.log("geohash: " + ghash);
    const neighbours = geohash.neighbors(ghash);
    console.log("neighbours: " + neighbours);
  }, [markerPosition]);

  const handleMapLoaded = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleAutocompleteLoaded = (ref: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ref;
    setGeocoder(new window.google.maps.Geocoder());
  };

  const handleAutocompletePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place) {
      setPlaceId(place.place_id ?? null);
      const { geometry, formatted_address } = place;
      const location = geometry?.location;
      if (location) {
        setCenter({ lat: location.lat(), lng: location.lng() });
        setMarkerPosition(location);
      }
      if (formatted_address) {
        setSearchedAddress(formatted_address);
      }
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (draggable) {
      handleMarkerPositionChanged(event);
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    handleMarkerPositionChanged(event);
  };

  const handleMarkerPositionChanged = (event: google.maps.MapMouseEvent) => {
    setMarkerPosition(event.latLng);
    geocodeMarkerCoordinatesToPlaceId(event);
  };

  const geocodeMarkerCoordinatesToPlaceId = (event: google.maps.MapMouseEvent) => {
    geocoder?.geocode({ location: event.latLng })
      .then((response) => {
        if (response.results[0]) {
          console.log(response.results[0]);
          setSearchedAddress(response.results[0].formatted_address);
          setPlaceId(response.results[0].place_id);
        } else {
          console.warn(`Unable to make reverse geocode request for ${markerPosition?.toUrlValue()}`);
        }
      });
  };

  const handleDraggableChange = (checked: boolean) => {
    setDraggable(checked);
  };

  return isLoaded ? (
      <>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row align="middle">
              <Col span={19}>
                <Autocomplete onLoad={handleAutocompleteLoaded}
                              onPlaceChanged={handleAutocompletePlaceChanged}>
                  <Input placeholder="Search address" />
                </Autocomplete>
              </Col>
              <Col span={5}>
                <Row justify="end">
                  <Col>
                    <Switch checkedChildren="Draggable"
                            unCheckedChildren="Non-draggable"
                            checked={draggable}
                            onChange={handleDraggableChange}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <div>
              {markerPosition?.toUrlValue(4)}
            </div>
            <div>
              {searchedAddress}
            </div>
            {placeId && <div>
              <a target="_blank"
                 href={`https://www.google.com/maps/place?q=place_id:${placeId}`}
                 rel="noreferrer"
              >
                Open in Google Maps ({placeId})
              </a>
            </div>}
            <GoogleMap center={center}
                       zoom={10}
                       onClick={handleMapClick}
                       mapContainerStyle={containerStyle}
                       onLoad={handleMapLoaded}
            >
              {markerPosition &&
                <Marker position={markerPosition}
                        draggable={draggable}
                        onDragEnd={handleMarkerDragEnd}
                        animation={google.maps.Animation.DROP}
                />
              }
            </GoogleMap>
          </Col>
        </Row>
      </>
    ) :
    <>Loading map...</>;
}

export default MapMain;
