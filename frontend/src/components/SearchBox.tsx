import React, { useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchBoxProps {
  onResultsFound: (places: google.maps.places.PlaceResult[]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onResultsFound }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const maps = useMapsLibrary("places");
  const [service, setService] =
    useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!maps || !inputRef.current) return;

    const autoCompleteInstance = new maps.Autocomplete(inputRef.current);
    autoCompleteInstance.addListener("place_changed", () => {
      const place = autoCompleteInstance.getPlace();
      if (place && place.geometry?.location) {
        onResultsFound([place]); // Send single place as an array
      }
    });

    setService(new maps.PlacesService(document.createElement("div")));
  }, [maps]);

  const handleSearch = () => {
    if (!service || !inputRef.current?.value) return;

    service.textSearch({ query: inputRef.current.value }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        onResultsFound(results); // Send multiple search results
      }
    });
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search places..."
        className="search-box"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBox;
