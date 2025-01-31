import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import GoogleMapComponent from "./components/Map";

const App = () => (
  <APIProvider
    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
    onLoad={() => console.log("Maps API has loaded.")}
  >
    <GoogleMapComponent />
  </APIProvider>
);

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
