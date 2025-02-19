import React, { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchBoxProps {
  onResultsFound: (places: google.maps.places.PlaceResult[]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onResultsFound }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const initSearchBox = async () => {
      const { SearchBox } = (await google.maps.importLibrary(
        "places"
      )) as google.maps.places.PlacesLibrary;
      const searchBox = new SearchBox(inputRef.current!);

      searchBox.addListener("places_changed", () => {
        const results = searchBox.getPlaces();
        if (results && results.length > 0) onResultsFound(results);
      });
    };

    initSearchBox();
  }, [placesLibrary, onResultsFound]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for a place..."
      style={{
        width: "300px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
      }}
    />
  );
};

export default SearchBox;
