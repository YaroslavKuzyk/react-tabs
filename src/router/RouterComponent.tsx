import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeView from "views/HomeView";

const RouterComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" Component={HomeView} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
