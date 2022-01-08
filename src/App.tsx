import React from 'react';
import { Routes, Route } from "react-router-dom";
import CreateOrder from "./views/CreateOrder";
import './App.css';
import Home from "./views/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="createorder" element={<CreateOrder />} />
      </Routes>
    </div>
  );
}

export default App;
