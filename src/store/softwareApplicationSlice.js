import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const softwareApplicationSlice = createSlice({
  name: "softwareApplication",
  initialState: {
    loading: false,
    applications: [],
    error: null,
    success: false,
    message: null,
    deleteLoading: false,
  },
  reducers: {
    // Reducers remain the same as before
    getAllApplicationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload;
      state.error = null;
    },
    getAllApplicationsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Other reducers stay the same
    addApplicationRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addApplicationSuccess: (state, action) => {
      state.loading = false;
      state.applications = [...state.applications, action.payload];
      state.success = true;
      state.message = "Application added successfully";
    },
    addApplicationFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    deleteApplicationRequest: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteApplicationSuccess: (state, action) => {
      state.deleteLoading = false;
      state.applications = state.applications.filter(
        (app) => app._id !== action.payload
      );
      state.message = "Application deleted successfully";
    },
    deleteApplicationFailed: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },

    resetApplicationState: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
    },

    clearApplicationErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  getAllApplicationsRequest,
  getAllApplicationsSuccess,
  getAllApplicationsFailed,
  addApplicationRequest,
  addApplicationSuccess,
  addApplicationFailed,
  deleteApplicationRequest,
  deleteApplicationSuccess,
  deleteApplicationFailed,
  resetApplicationState,
  clearApplicationErrors,
} = softwareApplicationSlice.actions;

// Get all applications - FIXED URL
export const getAllApplications = () => async (dispatch) => {
  dispatch(getAllApplicationsRequest());
  try {
    // FIXED URL to match your Express route registration
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/softwareapplications/getall",
      {
        withCredentials: true,
      }
    );

    console.log("Applications response:", data);

    if (data && data.data) {
      dispatch(getAllApplicationsSuccess(data.data));
    } else {
      dispatch(getAllApplicationsSuccess([]));
    }
  } catch (error) {
    console.error("Failed to fetch applications:", error.response || error);
    let errorMessage = "Failed to fetch applications";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(getAllApplicationsFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Add application - FIXED URL
export const addApplication = (applicationData) => async (dispatch) => {
  dispatch(addApplicationRequest());
  try {
    console.log("Sending application data:", applicationData);

    // Log the form data contents
    for (let pair of applicationData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // FIXED URL to match your Express route registration
    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/softwareapplications/add",
      applicationData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds
      }
    );

    console.log("Add application response:", data);
    dispatch(addApplicationSuccess(data.data));
    toast.success("Application added successfully");
    return true;
  } catch (error) {
    console.error("Error adding application:", error.response || error);
    let errorMessage = "Failed to add application";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(addApplicationFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

// Delete application - FIXED URL
export const deleteApplication = (id) => async (dispatch) => {
  dispatch(deleteApplicationRequest());
  try {
    // FIXED URL to match your Express route registration
    await axios.delete(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/softwareapplications/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteApplicationSuccess(id));
    toast.success("Application deleted successfully");
  } catch (error) {
    let errorMessage = "Failed to delete application";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(deleteApplicationFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export default softwareApplicationSlice.reducer;
