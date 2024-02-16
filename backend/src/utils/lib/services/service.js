const jwt = require("jsonwebtoken");
const axios = require("axios"); // You may need to install axios
const { jwtSecret, authHost } = require("../config/setting");
const { jwtDecode } = require("jwt-decode");

function getAppIdAndEntity(url) {
  const [pathPart] = url.split("?");
  const parts = pathPart.split("/");
  const tableIndex = parts.indexOf("table");
  if (
    tableIndex !== -1 &&
    tableIndex > 0 &&
    tableIndex < parts.length - 1 &&
    parts[tableIndex - 1] &&
    !parts[tableIndex - 1].includes("/") &&
    parts[tableIndex + 1] &&
    !parts[tableIndex + 1].includes("/")
  ) {
    const appId = parts[tableIndex - 1];
    const entity = parts[tableIndex + 1];
    return {
      app_id: appId,
      entity: entity,
    };
  } else {
    // "table" not found or doesn't have exactly one '/' on each side
    return null;
  }
}

function isemptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function createProjectionFromArray(fields) {
  const projection = {};
  fields.forEach((field) => {
    projection[field] = 1;
  });
  if (isemptyObject(projection)) {
    return (projection = "");
  } else {
    return projection;
  }
}

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

const FilterOptions = (
  sort = "updatedAt:desc",
  page,
  limit,
  filter,
  select_keys
) => {
  var arrayOfValues = {};

  var query = {};

  if (filter) {
    const filterObj = JSON.parse(filter);
    const selectKeys = select_keys;
    if (selectKeys) {
      const cleanedArray = selectKeys
        .split(",")
        .map((value) => value.replace(/'/g, ""));
      arrayOfValues = createProjectionFromArray(cleanedArray);
    }

    for (const key in filterObj) {
      query[key] = filterObj[key];
    }
  }
  let statusFilter = { status: { $ne: "INACTIVE" } };

  if (query.status != "" && query.status) {
    statusFilter = { ...statusFilter, status: query.status };
  }

  query = { ...query, ...statusFilter };

  removeEmptyKeys(query);
  var sortOptions = {};

  if (sort) {
    const [sortKey, sortOrder] = sort.split(":");
    sortOptions[sortKey] = sortOrder === "desc" ? -1 : 1;
  }

  var skip = 0;

  if (limit) {
    skip = (parseInt(page) - 1) * parseInt(limit);
  }

  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort: sortOptions,
  };
  return {
    options: options,
    query: query,
    arrayOfValues,
  };
};

const FilterOptionsSearch = (sort = "updatedAt:desc", page, limit, filter) => {
  var query = {};

  if (filter) {
    const filterObj = JSON.parse(filter);
    // const startwith = generateMatchQuery(filterObj["match"])

    delete filterObj?.["match"];
    delete filterObj?.["startwith"];

    for (const key in filterObj) {
      query[key] = filterObj[key];
    }
  }
  let statusFilter = { status: { $ne: "INACTIVE" } };

  if (query.status != "" && query.status) {
    statusFilter = { ...statusFilter, status: query.status };
  }

  query = { ...query, ...statusFilter };

  removeEmptyKeys(query);
  var sortOptions = {};

  if (sort) {
    const [sortKey, sortOrder] = sort.split(":");
    sortOptions[sortKey] = sortOrder === "desc" ? -1 : 1;
  }

  var skip = 0;

  if (limit) {
    skip = (parseInt(page) - 1) * parseInt(limit);
  }

  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort: sortOptions,
  };
  return {
    options: options,
    query: query,
  };
};

async function getLocationInfo(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return {
      ip: response.data.query,
      city: response.data.city,
      region: response.data.regionName,
      country: response.data.country,
      zip: response.data.zip,
    };
  } catch (error) {
    console.error("Error getting location info:", error);
    return {};
  }
}

// function removeEmptyKeys(obj) {
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const value = obj[key];

//       if (value === null || value === undefined || value === "") {
//         delete obj[key];
//       }
//     }
//   }
// }

function removeEmptyKeys(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === null || value === undefined || value === "") {
        delete obj[key];
      } else if (typeof value === "object" && !Array.isArray(value)) {
        // Recursively remove empty keys in nested objects
        removeEmptyKeys(value);

        // After removing empty keys, check if the nested object is now empty
        if (Object.keys(value).length === 0) {
          delete obj[key];
        }
      }
    }
  }
}

const generateMatchQuery = (query) => {
  const dynamicQuery = {};
  Object.keys(query).forEach((key) => {
    // Use RegExp only if the property exists in the query
    if (query[key]) {
      dynamicQuery[key] = new RegExp(query[key], "i");
    }
  });
  return dynamicQuery;
};

const invoke = async (endpint, param, req) => {
  const { authorization, session } = req.headers;

  const option = {
    method: param.method,
    url: authHost + endpint,
    headers: {
      authorization: authorization,
      session_id: session,
    },
    params: param.query,
    data: param.body,
  };
  let response;
  let error;
  try {
    response = await axios.request(option);
    return response?.data;
  } catch (e) {
    error = e.response.data;
    return e.response.data;
  }
};

const getUserInfo = (req) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return {};
  } else {
    const tokenValue = token.split(" ")[1];
    const decode = jwtDecode(tokenValue);
    return {
      user: decode.user_id,
      user_email: decode.email,
      username: decode.username,
    };
  }
};

module.exports = {
  decodeToken,
  FilterOptions,
  getLocationInfo,
  removeEmptyKeys,
  FilterOptionsSearch,
  getAppIdAndEntity,
  createProjectionFromArray,
  isemptyObject,
  invoke,
  getUserInfo,
};
