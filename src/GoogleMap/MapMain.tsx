import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row } from "antd";
import Map from "./Map";

let STORAGE_API_KEY = "GoogleMapsApiKey";

function MapMain() {

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_API_KEY);
    console.log(storedKey);
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyInput(storedKey);
    }
  }, []);

  const handleApiKeyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInput(event.target.value);
  };

  const changeApiKey = () => {
    setApiKey(apiKeyInput);
    localStorage.setItem(STORAGE_API_KEY, apiKeyInput);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={20}>
          <Input placeholder="Google Maps API key..." value={apiKeyInput} onChange={handleApiKeyInput} />
        </Col>
        <Col span={4}>
          <Button type="primary" style={{ width: "100%" }} onClick={changeApiKey}>Load</Button>
        </Col>
        <Col span={24}>
          {apiKey && <Map apiKey={apiKey} />}
        </Col>
      </Row>
    </>
  );
}

export default MapMain;
