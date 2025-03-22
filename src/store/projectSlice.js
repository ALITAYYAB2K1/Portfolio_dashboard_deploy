import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    loading: false,
    projects: [],
    project: null,
    error: null,
    success: false,
    message: null,
    deleteLoading: false,
    updateLoading: false,
  },
  reducers: {
    // Get all projects
    getAllProjectsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllProjectsSuccess: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
      state.error = null;
    },
    getAllProjectsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get single project
    getProjectRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProjectSuccess: (state, action) => {
      state.loading = false;
      state.project = action.payload;
      state.error = null;
    },
    getProjectFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add project
    addProjectRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addProjectSuccess: (state, action) => {
      state.loading = false;
      state.projects = [...state.projects, action.payload];
      state.success = true;
      state.message = "Project added successfully";
    },
    addProjectFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Update project
    updateProjectRequest: (state) => {
      state.updateLoading = true;
      state.error = null;
      state.success = false;
    },
    updateProjectSuccess: (state, action) => {
      state.updateLoading = false;
      state.projects = state.projects.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );
      state.project = action.payload;
      state.success = true;
      state.message = "Project updated successfully";
    },
    updateProjectFailed: (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Delete project
    deleteProjectRequest: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteProjectSuccess: (state, action) => {
      state.deleteLoading = false;
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
      state.message = "Project deleted successfully";
    },
    deleteProjectFailed: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },

    // Reset state
    resetProjectState: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearProjectErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  getAllProjectsRequest,
  getAllProjectsSuccess,
  getAllProjectsFailed,
  getProjectRequest,
  getProjectSuccess,
  getProjectFailed,
  addProjectRequest,
  addProjectSuccess,
  addProjectFailed,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailed,
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailed,
  resetProjectState,
  clearProjectErrors,
} = projectSlice.actions;

// Get all projects
export const getAllProjects = () => async (dispatch) => {
  dispatch(getAllProjectsRequest());
  try {
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/project/getall",
      {
        withCredentials: true,
      }
    );

    if (data && data.data) {
      dispatch(getAllProjectsSuccess(data.data));
    } else {
      dispatch(getAllProjectsSuccess([]));
    }
  } catch (error) {
    let errorMessage = "Failed to fetch projects";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(getAllProjectsFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Get single project
export const getProject = (id) => async (dispatch) => {
  dispatch(getProjectRequest());
  try {
    const { data } = await axios.get(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/project/get/${id}`,
      {
        withCredentials: true,
      }
    );

    if (data && data.data) {
      dispatch(getProjectSuccess(data.data));
    } else {
      throw new Error("No project data received");
    }
  } catch (error) {
    let errorMessage = "Failed to fetch project details";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(getProjectFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Add project
export const addProject = (projectData) => async (dispatch) => {
  dispatch(addProjectRequest());
  try {
    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/project/add",
      projectData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(addProjectSuccess(data.data));
    toast.success("Project added successfully");
    return true;
  } catch (error) {
    console.error("Error adding project:", error.response || error);
    let errorMessage = "Failed to add project";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(addProjectFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

// Update project
export const updateProject = (id, projectData) => async (dispatch) => {
  dispatch(updateProjectRequest());
  try {
    const { data } = await axios.put(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/project/update/${id}`,
      projectData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(updateProjectSuccess(data.data));
    toast.success("Project updated successfully");
    return true;
  } catch (error) {
    let errorMessage = "Failed to update project";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(updateProjectFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

// Delete project
export const deleteProject = (id) => async (dispatch) => {
  dispatch(deleteProjectRequest());
  try {
    await axios.delete(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/project/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteProjectSuccess(id));
    toast.success("Project deleted successfully");
  } catch (error) {
    let errorMessage = "Failed to delete project";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(deleteProjectFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export default projectSlice.reducer;
