import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, StandaloneSearchBox, useLoadScript } from "@react-google-maps/api";
import { Col, Input, Row } from "antd";

const containerStyle = {
  width: "100%",
  height: "460px",
};

function MapMain(props: { apiKey: string, center: google.maps.LatLngLiteral }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
    libraries: ["places", "geometry"],
  });

  const searchBoxRef = useRef<google.maps.places.SearchBox>();
  const mapRef = useRef<google.maps.Map>();

  const [center, setCenter] = useState(props.center);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const handleSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
    setGeocoder(new window.google.maps.Geocoder());
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();

    if (places && places.length) {
      const { geometry, formatted_address } = places[0];
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


  return isLoaded ? (
      <>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <StandaloneSearchBox onLoad={handleSearchBoxLoad} onPlacesChanged={handlePlacesChanged}>
              <Input placeholder="Search address" />
            </StandaloneSearchBox>
          </Col>
          <Col span={24}>
            {searchedAddress && <span>{searchedAddress}</span>}
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
