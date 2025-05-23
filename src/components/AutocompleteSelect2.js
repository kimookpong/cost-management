// components/AutocompleteSelect2.jsx
import { useState, useRef, useEffect } from "react";

const AutocompleteSelect2 = ({
  name,
  options = [],
  value,
  onSelect,
  placeholder = "เลือก",
  error,
  touched,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    setInputValue(selected ? selected.label : "");
  }, [value, options]);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (item) => {
    setInputValue(item.label);
    setShowDropdown(false);
    onSelect(name, item);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        className={`border p-2 pr-10 rounded w-full text-gray-900 dark:text-gray-300 ${
          touched && error ? "border-red-500" : ""
        }`}
      />

      {/* ▼ ไอคอนสามเหลี่ยมขวา */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
        ▼
      </div>

      {/* × ปุ่มล้างค่า */}
      {inputValue && (
        <button
          type="button"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          onClick={() => {
            setInputValue("");
            onSelect(name, { value: "", label: "" }); // รีเซ็ตค่า
          }}>
          ×
        </button>
      )}

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded max-h-40 overflow-y-auto shadow">
          {filtered.map((item) => (
            <li
              key={item.value}
              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-900 dark:text-gray-300"
              onMouseDown={() => handleSelect(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {touched && error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AutocompleteSelect2;
