import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Autosuggest from "react-autosuggest";
import "./SearchBox.css";

const Search = forwardRef((_, ref) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useImperativeHandle(ref, () => ({
    getValue: () => value,
  }));

  useEffect(() => {
    if (value.trim() !== "") {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const fetchSuggestions = async (search) => {
    try {
      const response = await fetch(`https://naposilkah.ru/api/ofice/boxberry/?search=${value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token d677468fbdc4820c3e4d5c12c0b586e534d22844"
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка сети");
      }

      const data = await response.json();
      const filteredSuggestions = data.filter(suggestion => suggestion.address !== value);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setSuggestions([]);
    }
  };

  const getSuggestionValue = (suggestion) => suggestion.address;

  const renderSuggestion = (suggestion) => <div className="suggestion-item">{suggestion.address}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Введите адрес...",
    value,
    onChange,
    className: "search-input"
  };

  return (
    <div className="search-box">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={() => { }}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={{
          container: "autosuggest-container",
          suggestionsContainer: "suggestions-container",
          suggestionsList: "suggestions-list"
        }}
      />
    </div>
  );
});

export default Search;
