// components/Loader.js
"use client";
import React from "react";
import styles from "./loader.module.css";


const Spinner = () => {


  return (
    <div className="loader">
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div className=" bg-transparent p-4 rounded-lg text-white z-50">
          <div
            className={`${styles.spinner}  w-14 h-14 rounded-full border-t-4 border-t-blue-500 `}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
