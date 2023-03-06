import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Col, Input, Row } from "antd";

const containerStyle = {
  width: "100%",
  height: "520px",
};

function MapMain(params: { apiKey: string }) {

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: params.apiKey,
    libraries: ["places"],
  });

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco as default location
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);

  const loadMap = () => {

  };
  const handleLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
    setGeocoder(new window.google.maps.Geocoder());
  };

  const handlePlacesChanged = () => {
    const places = searchBox?.getPlaces();

    if (places && places.length) {
      const { geometry, formatted_address } = places[0];
      // @ts-ignore
      const { lat, lng } = geometry.location;
      setCenter({ lat: lat(), lng: lng() });
      setMarkerPosition({ lat: lat(), lng: lng() });
      // @ts-ignore
      setSearchedAddress(formatted_address);
    }
  };

  // @ts-ignore
  const handleMapClick = (event: google.maps.MouseEvent) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCenter({ lat, lng });
    setMarkerPosition({ lat, lng });
    console.log(`${lat},${lng}`);
  };

  // @ts-ignore
  const handleMarkerDragEnd = (event: google.maps.MouseEvent) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    console.log(`${lat},${lng}`);
  };

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
            <StandaloneSearchBox onLoad={handleLoad} onPlacesChanged={handlePlacesChanged}>
              <Input placeholder="Search address" />
            </StandaloneSearchBox>
          </Col>
          <Col span={24}>
            {searchedAddress && <p>{searchedAddress}</p>}
            <GoogleMap center={center} zoom={13} onClick={handleMapClick}
                       mapContainerStyle={containerStyle}
                       onLoad={setMap}>
              {markerPosition &&
                <Marker position={markerPosition} draggable={true} onDragEnd={handleMarkerDragEnd} />
              }
            </GoogleMap>
          </Col>
        </Row>
      </>
    ) :
    <></>;
}

export default MapMain;
