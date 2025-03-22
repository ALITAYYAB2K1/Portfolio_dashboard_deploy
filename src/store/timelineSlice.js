import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const timelineSlice = createSlice({
  name: "timeline",
  initialState: {
    loading: false,
    timelines: [],
    error: null,
    success: false,
    message: null,
    deleteLoading: false,
  },
  reducers: {
    // Get all timelines
    getAllTimelinesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllTimelinesSuccess: (state, action) => {
      state.loading = false;
      state.timelines = action.payload;
      state.error = null;
    },
    getAllTimelinesFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add timeline
    addTimelineRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addTimelineSuccess: (state, action) => {
      state.loading = false;
      state.timelines = [...state.timelines, action.payload];
      state.success = true;
      state.message = "Timeline added successfully";
    },
    addTimelineFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Delete timeline
    deleteTimelineRequest: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteTimelineSuccess: (state, action) => {
      state.deleteLoading = false;
      state.timelines = state.timelines.filter(
        (timeline) => timeline._id !== action.payload
      );
      state.message = "Timeline deleted successfully";
    },
    deleteTimelineFailed: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },

    // Reset success state
    resetTimelineState: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearTimelineErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  getAllTimelinesRequest,
  getAllTimelinesSuccess,
  getAllTimelinesFailed,
  addTimelineRequest,
  addTimelineSuccess,
  addTimelineFailed,
  deleteTimelineRequest,
  deleteTimelineSuccess,
  deleteTimelineFailed,
  resetTimelineState,
  clearTimelineErrors,
} = timelineSlice.actions;

// Get all timelines
export const getAllTimelines = () => async (dispatch) => {
  dispatch(getAllTimelinesRequest());
  try {
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/timeline/getall",
      {
        withCredentials: true,
      }
    );

    if (data && data.data) {
      dispatch(getAllTimelinesSuccess(data.data));
    } else {
      dispatch(getAllTimelinesSuccess([]));
    }
  } catch (error) {
    let errorMessage = "Failed to fetch timelines";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(getAllTimelinesFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Add timeline
export const addTimeline = (timelineData) => async (dispatch) => {
  dispatch(addTimelineRequest());
  try {
    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/timeline/add",
      timelineData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(addTimelineSuccess(data.data));
    toast.success("Timeline added successfully");
    return true;
  } catch (error) {
    let errorMessage = "Failed to add timeline";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(addTimelineFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

// Delete timeline
export const deleteTimeline = (id) => async (dispatch) => {
  dispatch(deleteTimelineRequest());
  try {
    await axios.delete(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/timeline/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteTimelineSuccess(id));
    toast.success("Timeline deleted successfully");
  } catch (error) {
    let errorMessage = "Failed to delete timeline";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(deleteTimelineFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export default timelineSlice.reducer;
