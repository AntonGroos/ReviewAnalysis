import React, { useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { sendReviewsToBackend } from "../services/api";

const centerCoordinates = { lat: 48.137, lng: 11.576 }; // Munich, Germany
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string;

const GoogleMapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  // Ensure the library is available before using `google.maps`
  const placesLibrary = useMapsLibrary("places");
  const mapsLibrary = useMapsLibrary("maps");
  const markerLibrary = useMapsLibrary("marker");

  useEffect(() => {
    if (!mapsLibrary || !markerLibrary || !mapRef.current) return;

    const initMap = async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const newMap = new Map(mapRef.current, {
        center: centerCoordinates,
        zoom: 14,
        mapId: MAP_ID,
      });

      setMap(newMap);
    };

    initMap();
  }, [mapsLibrary, markerLibrary]); // Run only when libraries are available

  const fetchPlacesAndReviews = async () => {
    if (!placesLibrary || !map) return;

    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const service = new PlacesService(map);

    const request = {
      query: searchQuery,
      fields: ["place_id", "name", "geometry", "reviews"],
    };

    service.textSearch(request, async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;
        const reviewsToSend = [];

        // Remove old markers
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);

        for (const place of results) {
          if (!place.geometry?.location) continue;

          const placeDetails = new placesLibrary.Place({ id: place.place_id });
          await placeDetails.fetchFields({ fields: ["reviews"] });

          if (placeDetails.reviews) {
            const formattedReviews = placeDetails.reviews.map((review) => ({
              author: review.authorAttribution?.displayName || "Unknown",
              rating: review.rating,
              text: review.text,
              timestamp: review.publishedAt,
              place_id: place.place_id,
            }));

            reviewsToSend.push(...formattedReviews);
          }

          // Add new marker
          const marker = new AdvancedMarkerElement({
            map,
            position: place.geometry.location,
            title: place.name,
          });

          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        }

        if (reviewsToSend.length > 0) {
          try {
            await sendReviewsToBackend(reviewsToSend);
            console.log("Reviews sent to backend");
          } catch (error) {
            console.error("Error sending reviews:", error);
          }
        }
      }
    });
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchPlacesAndReviews()}
        placeholder="Search for places..."
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "300px",
        }}
      />

      {/* Google Map Container */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default GoogleMapComponent;
