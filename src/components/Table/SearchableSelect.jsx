import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchableSelect = ({
  options,
  onChange,
  name,
  placeholder = "",
  allOption = true,
  disabled = false,
  defaultOption = "",
}) => {
  // console.log(
  // 	name,
  // 	options.filter(option => option.value == defaultOption)
  // );
  const queryParamOption = options.filter(
    (option) => option.value === parseInt(defaultOption)
  )[0];
  const { i18n, t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (!option) {
      setSelectedOption("");

      onChange(name, "", name, "static");

      setShowDropdown(false); // Close the dropdown after selection
      setSearchTerm(""); // Reset the search term
    } else {
      setSelectedOption(option);
      onChange(name, option.value, name, "static");
      setShowDropdown(false); // Close the dropdown after selection
      setSearchTerm(""); // Reset the search term
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="searchable-select"
      ref={dropdownRef} // Attach ref to the wrapper
      style={{
        position: "relative",
        // width: '200px'
      }}
    >
      {/* Search Input with Dropdown Arrow */}
      <input
        type="text"
        value={
          selectedOption?.label || searchTerm || queryParamOption?.label || ""
        }
        placeholder={placeholder}
        // onChange={e => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="filter-select"
        style={{
          // width: '100%',
          padding: "8px",
          paddingRight: "30px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "16px",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        disabled={disabled}
        readOnly
      />

      {/* Dropdown */}
      {showDropdown && (
        <ul
          className="dropdown"
          style={{
            position: "absolute",
            // width: '100%',
            maxHeight: "180px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "white",
            zIndex: 10,
            padding: 0,
            margin: 0,
            listStyleType: "none",
          }}
        >
          <div className="m-2">
            <input
              type="text"
              value={searchTerm}
              placeholder={placeholder}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-select"
              style={{
                width: "90%",
                padding: "8px",
                boxSizing: "border-box",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          {allOption && (
            <li
              key={"all"}
              onClick={() => handleSelect(false)}
              className="dropdown-item"
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {t("All")}
            </li>
          )}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="dropdown-item"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li
              style={{
                padding: "8px",
                color: "#999",
              }}
            >
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
