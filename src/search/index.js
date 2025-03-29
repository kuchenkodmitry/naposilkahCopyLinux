// Search.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./SearchBox.css";
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками
import { fetchSuggestions as fetchSuggestionsApi } from '../api/api'; // Импортируем функцию из api.js

const Search = forwardRef(({ onChange }, ref) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation(); // Получаем текущий URL

  // Императивный метод для получения и установки значения извне
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (newValue) => setValue(newValue), // Добавляем метод setValue
  }));

  // Загрузка предложений при изменении значения
  useEffect(() => {
    if (value.trim() !== "") {
      loadSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const token = Cookies.get('auth_token'); // Предполагается, что токен хранится в куке с именем "authToken"
  if (!token) {
    throw new Error('Токен не найден');
  }

  // Функция для загрузки предложений через API
  const loadSuggestions = async (search) => {
    const apiEndpoint = location.pathname.includes("/cdek") ? "cdek" : "boxberry"; // Определяем API
    try {
      const data = await fetchSuggestionsApi(search, apiEndpoint, token);
      const filteredSuggestions = data.filter(suggestion => suggestion.address !== value);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setSuggestions([]);
    }
  };

  // Получение значения из предложения
  const getSuggestionValue = (suggestion) => suggestion.address;

  // Отображение предложения
  const renderSuggestion = (suggestion) => (
    <div className="suggestion-item">{suggestion.address}</div>
  );

  // Обработка изменения значения
  const handleChange = (event, { newValue }) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue); // Передаем новое значение во внешний компонент
    }
  };

  // Очистка предложений
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Свойства для поля ввода
  const inputProps = {
    placeholder: "Введите адрес...",
    value,
    onChange: handleChange,
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