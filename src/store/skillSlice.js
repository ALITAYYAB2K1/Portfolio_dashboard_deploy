import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const skillSlice = createSlice({
  name: "skill",
  initialState: {
    loading: false,
    skills: [],
    error: null,
    success: false,
    message: null,
    deleteLoading: false,
    updateLoading: false,
  },
  reducers: {
    // Get all skills
    getAllSkillsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllSkillsSuccess: (state, action) => {
      state.loading = false;
      state.skills = action.payload;
      state.error = null;
    },
    getAllSkillsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add skill
    addSkillRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addSkillSuccess: (state, action) => {
      state.loading = false;
      state.skills = [...state.skills, action.payload];
      state.success = true;
      state.message = "Skill added successfully";
    },
    addSkillFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Delete skill
    deleteSkillRequest: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteSkillSuccess: (state, action) => {
      state.deleteLoading = false;
      state.skills = state.skills.filter(
        (skill) => skill._id !== action.payload
      );
      state.message = "Skill deleted successfully";
    },
    deleteSkillFailed: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },

    // Update skill
    updateSkillRequest: (state) => {
      state.updateLoading = true;
      state.error = null;
      state.success = false;
    },
    updateSkillSuccess: (state, action) => {
      state.updateLoading = false;
      state.skills = state.skills.map((skill) =>
        skill._id === action.payload._id ? action.payload : skill
      );
      state.success = true;
      state.message = "Skill updated successfully";
    },
    updateSkillFailed: (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Reset state
    resetSkillState: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearSkillErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  getAllSkillsRequest,
  getAllSkillsSuccess,
  getAllSkillsFailed,
  addSkillRequest,
  addSkillSuccess,
  addSkillFailed,
  deleteSkillRequest,
  deleteSkillSuccess,
  deleteSkillFailed,
  updateSkillRequest,
  updateSkillSuccess,
  updateSkillFailed,
  resetSkillState,
  clearSkillErrors,
} = skillSlice.actions;

// Get all skills
export const getAllSkills = () => async (dispatch) => {
  dispatch(getAllSkillsRequest());
  try {
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/skill/getall",
      {
        withCredentials: true,
      }
    );

    if (data && data.data) {
      dispatch(getAllSkillsSuccess(data.data));
    } else {
      dispatch(getAllSkillsSuccess([]));
    }
  } catch (error) {
    let errorMessage = "Failed to fetch skills";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(getAllSkillsFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Add skill
export const addSkill = (skillData) => async (dispatch) => {
  dispatch(addSkillRequest());
  try {
    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/skill/add",
      skillData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds
      }
    );

    dispatch(addSkillSuccess(data.data));
    toast.success("Skill added successfully");
    return true;
  } catch (error) {
    let errorMessage = "Failed to add skill";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(addSkillFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

// Delete skill
export const deleteSkill = (id) => async (dispatch) => {
  dispatch(deleteSkillRequest());
  try {
    await axios.delete(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/skill/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteSkillSuccess(id));
    toast.success("Skill deleted successfully");
  } catch (error) {
    let errorMessage = "Failed to delete skill";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(deleteSkillFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Update skill
export const updateSkill = (id, skillData) => async (dispatch) => {
  dispatch(updateSkillRequest());
  try {
    const { data } = await axios.put(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/skill/update/${id}`,
      skillData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(updateSkillSuccess(data.data));
    toast.success("Skill updated successfully");
    return true;
  } catch (error) {
    let errorMessage = "Failed to update skill";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    dispatch(updateSkillFailed(errorMessage));
    toast.error(errorMessage);
    return false;
  }
};

export default skillSlice.reducer;
