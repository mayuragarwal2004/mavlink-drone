import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./pages/components/Layout";
import Data from "./pages/Data";
import Plan from "./pages/Plan";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <>
    {/* <React.StrictMode> */}
      <BrowserRouter>
        <div className="home-container">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Data />} />
              <Route path="plan" element={<Plan />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      {/* </React.StrictMode> */}
    </>
  );
}

export default App;
