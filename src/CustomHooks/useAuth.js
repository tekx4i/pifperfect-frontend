import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export async function apiPost(url, params, token) {
  try {
    const isFormData = params instanceof FormData;
    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(url, params, config);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    return response;
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage =
        error.response.data.errors[0].message || "Network error";
      toast.error(errorMessage);
    } else {
      const errorMessage = error?.response?.data.message || "Network error";
      toast.error(errorMessage);
    }
    return {
      success: false,
      // message: errorMessage,
    };
  }
}

export const apiGet = async (url, params = {}, token) => {
  if (!token) {
    toast.error("Authorization token is missing.");
    return { success: false, message: "Authorization token is required." };
  }

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.success) {
      return { success: true, data: response.payload };
    } else {
      toast.error(response.data.message || "Request failed.");
      return {
        success: false,
        message: response.data.message || "Request failed.",
      };
    }
  } catch (error) {
    // if (error.response?.data?.errors && error.response.data.errors.length > 0) {
    //   const errorMessage = error.response.data.errors[0].message || "Network error";
    //   toast.error(errorMessage);
    // } else {
    //   const errorMessage = error.response.data.message || "Network error";
    //   toast.error(errorMessage);
    // }
    console.log(error);
    return {
      success: false,
      // message: errorMessage,
    };
  }
};

export const apiGetPublic = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      params,
    });
    if (response.success) {
      return { success: true, data: response };
    } else {
      toast.error(response.data.message || "Request failed.");
      return {
        success: false,
        message: response.data.message || "Request failed.",
      };
    }
  } catch (error) {
    // if (error.response?.data?.errors && error.response.data.errors.length > 0) {
    //   const errorMessage = error.response.data.errors[0].message || "Network error";
    //   toast.error(errorMessage);
    // } else {
    //   const errorMessage = error.response.data.message || "Network error";
    //   toast.error(errorMessage);
    // }
    console.log(error);
    return {
      success: false,
      // message: errorMessage,
    };
  }
};

export async function apiPut(url, data = {}, token) {
  try {
    const isFormData = data instanceof FormData;
    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(url, data, config);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    return response;
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage =
        error.response.data.errors[0].message || "Network error";
      toast.error(errorMessage);
    } else {
      const errorMessage = error.response?.data?.message || "Network error";
      toast.error(errorMessage);
    }
    return {
      success: false,
      // message: errorMessage,
      // message:""
      message: "custom error",
    };
  }
}

export const apiDelete = async (url, token) => {
  if (!token) {
    toast.error("Authorization token is missing.");
    return { success: false, message: "Authorization token is required." };
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(url, config);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    return response;
  } catch (error) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      const errorMessage =
        error.response.data.errors[0].message || "Network error";
      toast.error(errorMessage);
    } else {
      // const errorMessage = error.response.data.message || "Network error";
      // toast.error(errorMessage);
    }
    return {
      success: false,
      // message: errorMessage,
    };
  }
};

export default {
  apiPost,
  apiGet,
  apiPut,
};
