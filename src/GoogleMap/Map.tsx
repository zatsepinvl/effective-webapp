import React, { useState, useCallback, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Col, Input, Row } from "antd";
import * as geohash from "ngeohash";

const containerStyle = {
  width: "100%",
  height: "460px",
};

function MapMain(props: { apiKey: string, center: google.maps.LatLngLiteral }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
    libraries: ["places", "geometry"],
  });

  const mapRef = useRef<google.maps.Map>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const [center, setCenter] = useState(props.center);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const handleAutocompleteLoaded = (ref: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ref;
    setGeocoder(new window.google.maps.Geocoder());
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place) {
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
    setMarkerPosition(event.latLng);
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    setMarkerPosition(event.latLng);
  };

  const handleMapLoaded = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerPositionChanged = useCallback(() => {

  }, []);

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


  return isLoaded ? (
      <>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Autocomplete onLoad={handleAutocompleteLoaded}
                          onPlaceChanged={handlePlaceChanged}>
              <Input placeholder="Search address" />
            </Autocomplete>
          </Col>
          <Col span={24}>
            {markerPosition && searchedAddress &&
              <i>
                <span>{markerPosition.toUrlValue()}</span>
                <span> | </span>
                <span>{searchedAddress}</span>
              </i>
            }
            <GoogleMap center={center}
                       zoom={10}
                       onClick={handleMapClick}
                       mapContainerStyle={containerStyle}
                       onLoad={handleMapLoaded}
            >
              {markerPosition &&
                <Marker position={markerPosition}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                        onPositionChanged={handleMarkerPositionChanged}
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
