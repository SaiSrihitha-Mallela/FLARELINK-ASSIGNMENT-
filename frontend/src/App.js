import React from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import BinPage from "./components/BinPage";
import CompletedTask from "./components/CompletedTask";
import ImportantTasksPage from "./components/ImportantTasksPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
        <Route path="/binpage" element={<BinPage/>}/>
        <Route path="/completedtasks" element={<CompletedTask/>}/>
        <Route path="/imptasks" element={<ImportantTasksPage/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
