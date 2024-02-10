import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

import LayoutRegister from '../layouts/register';
import LayoutLogin from '../layouts/login';
import BuildingList from '../layouts/buildings_list';
import BuildingMetrics from '../layouts/buildings_metrics'
import BookmarksList from "../layouts/bookmarks_list";


function App() {
  return (
    <ConfigProvider
        theme={{
            token: {
                borderRadius: 6,
                borderRadiusLG: 8,
                borderRadiusOuter: 6,
                borderRadiusSM: 6,
                borderRadiusXS: 4,
                colorPrimary: '#00A86B',
            }
        }}
    >
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route path="/bookmarks" element={<BookmarksList />} />
          <Route path="/buildings" element={<BuildingList />} />
          <Route path="/buildings/:buildingId" element={<BuildingMetrics />} />
          <Route path="/register" element={<LayoutRegister />} />
          <Route path="home" element={<LayoutRegister />} />
          <Route path="/login" element={<LayoutLogin />} />
          <Route path="/" element={<LayoutRegister />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App
