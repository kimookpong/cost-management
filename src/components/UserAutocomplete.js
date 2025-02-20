import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";

const UserAutocomplete = ({ formik, label }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchInitialValue = async () => {
      if (formik.values[label]) {
        try {
          const response = await axios.get(
            `/api/user/find?q=${formik.values[label]}`
          );
          if (response.data?.success && response.data.data.length > 0) {
            const user = response.data.data[0];
            const defaultUser = {
              label: user.fullname,
              value: user.personId,
            };
            setSelectedUser(defaultUser);
          }
        } catch (error) {
          console.error("Error fetching default user:", error);
        }
      }
    };

    fetchInitialValue();
  }, [formik.values[label]]);

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await axios.get(`/api/user/find?q=${inputValue}`);
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data.map((user) => ({
          label: user.fullname,
          value: user.personId,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  return (
    <div className="relative">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        placeholder="ค้นหาผู้ใช้..."
        onChange={(selectedOption) => {
          setSelectedUser(selectedOption);
          formik.setFieldValue(label, selectedOption.value);
        }}
        value={selectedUser}
        className="border rounded-md"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? "white" : "transparent",
            color: state.isFocused ? "black" : "inherit",
            borderWidth: "1px",
            borderColor:
              formik.touched[label] && formik.errors[label]
                ? "#ef4444"
                : state.isFocused
                ? "#60a5fa"
                : "#d1d5db",
            "&:hover": {
              borderColor:
                formik.touched[label] && formik.errors[label]
                  ? "#dc2626"
                  : "#60a5fa",
            },
          }),
        }}
      />
    </div>
  );
};

export default UserAutocomplete;
