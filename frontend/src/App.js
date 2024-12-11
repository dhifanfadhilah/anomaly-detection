import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
// import SiteDetails from "./pages/SiteDetails";

function App() {
  const [uploadResult, setUploadResult] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onUploadSuccess={setUploadResult} />} />
        <Route path="/results" element={<Results data={uploadResult} />} />
        {/* <Route path="/site/:siteName" element={<SiteDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
