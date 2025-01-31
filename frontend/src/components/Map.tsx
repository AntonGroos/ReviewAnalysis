import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import SearchBox from "./SearchBox";

const centerCoordinates = { lat: 48.137, lng: 11.576 }; // Munich, Germany
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string;

const GoogleMapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const maps = useMapsLibrary("maps");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  useEffect(() => {
    if (!maps || !mapRef.current) return;

    const initMap = async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const newMap = new Map(mapRef.current, {
        center: centerCoordinates,
        zoom: 14,
        mapId: MAP_ID,
      });

      setMap(newMap);
    };

    initMap();
  }, [maps]);

  const handleResultsFound = async (
    places: google.maps.places.PlaceResult[]
  ) => {
    if (!map || places.length === 0) return;

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;
    const bounds = new google.maps.LatLngBounds();

    // Remove old markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    places.forEach((place) => {
      if (!place.geometry?.location) return;

      bounds.extend(place.geometry.location);
      const { lat, lng } = place.geometry.location;

      const newMarker = new AdvancedMarkerElement({
        map,
        position: { lat: lat(), lng: lng() },
        title: place.name,
      });

      setMarkers((prev) => [...prev, newMarker]);
    });

    map.fitBounds(bounds); // Adjust view to fit all markers
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SearchBox onResultsFound={handleResultsFound} />
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default GoogleMapComponent;
