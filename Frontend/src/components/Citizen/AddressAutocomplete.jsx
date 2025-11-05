import React, { useState } from "react";
import axios from "axios";

export default function AddressAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) return setSuggestions([]);

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Enter address or landmark"
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border mt-1 w-full max-h-40 overflow-auto rounded-md shadow">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect({ lat: s.lat, lng: s.lon, name: s.display_name });
                setQuery(s.display_name);
                setSuggestions([]);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
