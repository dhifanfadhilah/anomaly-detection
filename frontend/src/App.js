import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";

function App() {
  const [uploadResult, setUploadResult] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onUploadSuccess={setUploadResult} />} />
        <Route path="/results" element={<Results data={uploadResult} />} />
      </Routes>
    </Router>
  );
}

export default App;
