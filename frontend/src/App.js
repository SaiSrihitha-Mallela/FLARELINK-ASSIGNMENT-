import React from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Tasks from "./components/Tasks";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
