import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row } from "antd";
import Map from "./Map";

const STORAGE_API_KEY = "GoogleMapsApiKey";
const CAPE_TOWN_CENTER = { lat: -33.9501, lng: 18.4885 };

function MapMain() {

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_API_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyInput(storedKey);
    }
  }, []);

  const handleApiKeyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInput(event.target.value);
  };

  const changeApiKey = () => {
    localStorage.setItem(STORAGE_API_KEY, apiKeyInput);
    window.location.reload();
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={20}>
          <Input placeholder="Google Maps API key..."
                 value={apiKeyInput}
                 onChange={handleApiKeyInput}
                 onPressEnter={changeApiKey} />
        </Col>
        <Col span={4}>
          <Button type="primary"
                  style={{ width: "100%" }}
                  onClick={changeApiKey}>
            Load
          </Button>
        </Col>
        <Col span={24}>
          {apiKey && <Map apiKey={apiKey} center={CAPE_TOWN_CENTER} />}
        </Col>
      </Row>
    </>
  );
}

export default MapMain;
