import React from "react";
import "./App.css";
import FruitList from "./components/Fruits";
import GoogleMapComponent from "./components/GoogleMap";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Review Analysis</h1>
      </header>
      <main>
        <FruitList />
        <GoogleMapComponent />
      </main>
    </div>
  );
};

export default App;
