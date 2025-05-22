import { BASE_URL } from "../constants/constants";

export const fetchPostCall = async (
  url: string,
  bodyData: any,
  deviceId: any
) => {
  let response: any = {
    status: false,
    data: {},
    error: null,
  };
  try {
    bodyData = { ...bodyData };

    let headers: any = {
      "Content-Type": "application/json",
    };
    if (deviceId) {
      headers["apphit"] = "view360";
      headers["deviceid"] = deviceId;
    }
    const APIResponse = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bodyData),
    });

    const data = await APIResponse.json();
    if (APIResponse.ok) {
      if (data?.error === "multipleLogin") {
        response.error = data.error;
        response.status = false;
      } else {
        response.status = data.status || false;
        response.data = data.data || data;
      }
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    response.error = error;
    return response;
  }
};

export const fetchGetCall = async (
  url: string,
  deviceId: any
) => {
  let response: any = {
    status: false,
    data: {},
    error: null,
  };
  try {
    let headers: any = {
      "Content-Type": "application/json",
    };
    if (deviceId) {
      headers["apphit"] = "view360";
      headers["deviceid"] = deviceId;
    }
    const APIResponse = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: headers,
    });

    const data = await APIResponse.json();
    if (APIResponse.ok) {
      if (data?.error === "multipleLogin") {
        response.error = data.error;
        response.status = false;
      } else {
        response.status = data.status || false;
        response.data = data.data || data;
      }
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    response.error = error;
    return response;
  }
};