// utils/axiosApi.js
// import axios from "axios";

import axios from "axios";


import { parseCookies } from "nookies";

import { baseurl } from "@/config/setting";
import { getTokenFromCookies } from "../service";
import { notifySuccess, notifyerror, notifyinfo } from "@/utils/notify/notice";

// axios.defaults.withCredentials=true


export const get = async (endpint, query) => {
 
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];
  // let reqUrl = undefined;
  // if (id) {
  //   reqUrl = baseURL + endpint + `/${id}`;
  // }
  // if (!id) {
  //   reqUrl = baseURL + endpint;
  // }
  const option = {
    method: "get",
    url: baseurl + endpint,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: query,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);

    if (!endpint.includes("session")) {
      notifySuccess(response.data.message, 2000);
    }
  } catch (e) {
    error = e.response.data;
    if (!endpint.includes("session")) {
      notifyerror(e.response.data.message, 2000);
    }

    throw new Error(JSON.stringify(e.response.data));
  }
  return response?.data ? response?.data : error; // or set initial value
};

export const getsingle = async (endpint, query, id) => {
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];

  const option = {
    method: "get",
    url: baseurl + endpint + `/${id}`,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: query,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);

    if (!endpint.includes("session")) {
      notifySuccess(response.data.message, 2000);
    }
  } catch (e) {
    error = e.response.data;
    if (!endpint.includes("session")) {
      notifyerror(e.response.data.message, 2000);
    }

    throw new Error(JSON.stringify(e.response.data));
  }
  return response?.data ? response?.data : error; // or set initial value
};

export const getServerSingle = async (endpint, query, id) => {
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];

  const option = {
    method: "get",
    url: baseurl + endpint + `/${id}`,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: query,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);

    if (!endpint.includes("session")) {
      notifySuccess(response.data.message, 2000);
    }
  } catch (e) {
    error = e.response.data;
    if (!endpint.includes("session")) {
      notifyerror(e.response.data.message, 2000);
    }

    throw new Error(JSON.stringify(e.response.data));
  }
  return response?.data ? response?.data : error; // or set initial value
};

export const post = async (endpint, data) => {
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];
  const option = {
    method: "post",
    url: baseurl + endpint,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: {},
    data: data,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);
    if (!endpint.includes("session")) {
      notifySuccess(response.data.message, 2000);
    }
  } catch (e) {
    error = e.response.data;
    if (!endpint.includes("session")) {
      notifyerror(e.response.data.message, 2000);
    }
    throw new Error(JSON.stringify(e.response.data));
  }

  // if success return value
  return response?.data ? response?.data : error; // or set initial value
};

// export const put = async (endpint, id, data) => {
//   const option = {
//     method: "put",
//     url: baseURL + endpint + `/${id}`,
//     headers: {
//       Authorization: token,
//       session_id: session,
//     },
//     params: {},
//     data: data,
//   };
//   let response;
//   let error;
//   try {
//     response = await axios.request(option);
//     notifySuccess(response.data.message, 2000);
//   } catch (e) {
//     error = e.response.data;
//     notifyerror(e.response.data.message, 2000);
//     throw new Error(JSON.stringify(e.response.data));
//   }
//   return response?.data ? response?.data : error; // or set initial value
// };

export const patch = async (endpint, data, id) => {
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];
  const option = {
    method: "patch",
    url: baseurl + endpint + `/${id}`,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: {},
    data: data,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);
    notifySuccess(response.data.message, 2000);
  } catch (e) {
    error = e.response.data;
    notifyerror(e.response.data.message, 2000);
    throw new Error(JSON.stringify(e.response.data));
  }
  return response?.data ? response?.data : error; // or set initial value
};

export const del = async (endpint, id) => {
  const cookies = parseCookies();
  const token = getTokenFromCookies()
  const session = cookies["session"];

  const option = {
    method: "delete",
    url: baseurl + endpint + `/${id}`,
    headers: {
      Authorization: token,
      session_id: session,
    },
    params: {},
    data: {},
  };
  let response;
  let error;
  try {
    response = await axios.request(option);
    notifyinfo(response.data.message, 2000);
  } catch (e) {
    error = e.response.data;
    notifyerror(e.response.data.message, 2000);
    throw new Error(JSON.stringify(e.response.data));
  }
  return response?.data ? response?.data : error; // or set initial value
};

