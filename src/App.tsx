import React from "react";
import { Layout, Menu, theme } from "antd";
import MapMain from "./GoogleMap/MapMain";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const locationToHeaderMap: Record<string, string> = {
  "/google-maps": "Google Maps",
};

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ height: 32, margin: 16, color: "white" }}>
          Features
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1">
            <span>Google Maps</span>
            <Link to="/google-maps" />
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <span style={{ fontSize: "18px", margin: "22px" }}>{locationToHeaderMap[location.pathname]}</span>
        </Header>
        <Content style={{ margin: "10px 16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Routes>
              <Route path="/google-maps" element={<MapMain />} />
              <Route path="*" element={<Navigate to={"/google-maps"} />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;