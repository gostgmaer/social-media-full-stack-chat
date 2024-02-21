import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({ label, type, additionalAttrs, classes, icon, id }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="block">
        <span className=" block text-sm capitalize font-semibold  mb-1.5">
          {label} :{" "}
        </span>
        <span
          className={`flex items-center peer  w-full transition duration-200  rounded-md bg-transparent focus:ring-[0.6px]  ${
            icon && "border pl-3.5 h-10 leading-[40px]"
          }  ${type === "password" && "border h-10 leading-[40px]"}`}
        >
          {icon && <button className="  pr-1">{icon}</button>}
          <input
            className={` rounded w-full  leading-tight focus:outline-none  border px-3.5 h-10 ${
              type === "password" && "pr-0"
            }  ${classes && classes}`}
            type={showPassword && type ==="password" ? "text" : type}
            name={id ? id : label.trim().replace(/\s+/g, "_").toLowerCase()}
            id={id ? id : label.trim().replace(/\s+/g, "_").toLowerCase()}
            {...additionalAttrs} // Spread additional attributes/props
          />
          {type === "password" && (
            <>
              {" "}
              <button
                className="px-2"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash
                    className=" w-5 h-5"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="w-5 h-5"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </button>
            </>
          )}
        </span>
      </label>
    </div>
  );
};

export default Input;
