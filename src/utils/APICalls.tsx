import { BASE_URL } from "../constants/constants";

export const fetchPostCall = async (url: string, bodyData: any) => {
  let response: any = {
    status: false,
    data: {},
    error: null,
  };
  try {
    bodyData = { ...bodyData };
    console.log("API URL:", `bodyData`, bodyData);
    const APIResponse = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await APIResponse.json();
    console.log("API Response:", APIResponse);
    console.log("API Data:", data);
    if (APIResponse.ok) {
      response.status = data.status || false;
      response.data = data.data || data;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    response.error = error;
    return response;
  }
};
