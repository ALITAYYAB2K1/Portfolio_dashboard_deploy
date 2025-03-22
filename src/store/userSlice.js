import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: null, // Changed from {} to null for easier checks
    isAuthenticated: false,
    error: null,
    message: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      // Store the user data from the nested structure
      state.user = action.payload.data;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    loadUserRequest: (state) => {
      state.loading = true;
      state.error = null;
      // Don't reset user data or auth state here
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
      state.message = action.payload;
    },
    updatePasswordFailed: (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
      state.message = null;
    },
    updateProfileRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
      state.error = null;
      state.message = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
      state.message = action.payload;
    },
    updateProfileFailed: (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
      state.message = null;
    },
    updateProfileResetAfterUpdate: (state) => {
      state.error = null;
      state.isUpdated = false;
      state.message = null;
    },
    clearALLErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  clearALLErrors,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailed,
  logoutSuccess,
  logoutFailed,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailed,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailed,
  updateProfileResetAfterUpdate,
} = userSlice.actions;

export const userReducers = userSlice.reducer;

// Async login function
export const login =
  ({ email, password }, navigateTo) =>
  async (dispatch) => {
    dispatch(loginRequest());
    try {
      console.log("Sending login request with:", { email, password });

      const { data } = await axios.post(
        "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login response received:", data);

      // Store basic auth data
      dispatch(loginSuccess(data));

      // Then immediately fetch complete user data
      await dispatch(getUser());

      // Only navigate after both operations are complete
      dispatch(clearALLErrors());
      if (navigateTo) navigateTo("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error
      );
      dispatch(loginFailed(error.response?.data?.message || "Login failed"));
    }
  };

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(clearALLErrors());
};

export const getUser = () => async (dispatch) => {
  dispatch(loadUserRequest());
  try {
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/me",
      {
        withCredentials: true,
      }
    );

    console.log("User data received:", data);

    // Pass the user data directly
    dispatch(loadUserSuccess(data.data));
    dispatch(clearALLErrors());
  } catch (error) {
    console.error(
      "Get user failed:",
      error.response ? error.response.data : error
    );
    dispatch(
      loadUserFailed(
        error.response?.data?.message || "Failed to load user data"
      )
    );
  }
};

export const logout = (navigateTo) => async (dispatch) => {
  try {
    console.log("Attempting logout...");

    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/logout",
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Logout successful:", data);
    dispatch(logoutSuccess(data.message));
    dispatch(clearALLErrors());
    navigateTo("/login");
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error);
    dispatch(
      logoutFailed(error.response?.data?.message || "Error during logout")
    );
  }
};

export const updatePassword =
  (currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(updatePasswordRequest());
    try {
      const { data } = await axios.patch(
        "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/update/password",
        { currentPassword, newPassword, confirmNewPassword },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(updatePasswordSuccess(data.message));
      dispatch(clearALLErrors());
    } catch (error) {
      console.error("Update password failed:", error.response?.data || error);
      dispatch(
        updatePasswordFailed(
          error.response?.data?.message || "Error during password update"
        )
      );
    }
  };

export const updateProfile = (userData) => async (dispatch) => {
  dispatch(updateProfileRequest());
  try {
    const { data } = await axios.put(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/update/me",
      userData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(updateProfileSuccess(data.message));
    dispatch(clearALLErrors());
  } catch (error) {
    console.error("Update profile failed:", error.response?.data || error);
    dispatch(
      updateProfileFailed(
        error.response?.data?.message || "Error during profile update"
      )
    );
  }
};

export const resetProfile = () => (dispatch) => {
  dispatch(updateProfileResetAfterUpdate());
};

export const checkUserAuthentication = () => async (dispatch) => {
  try {
    // Make a lightweight API call to check if user is authenticated
    const { data } = await axios.get(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/me",
      {
        withCredentials: true,
      }
    );

    if (data.success) {
      dispatch(loadUserSuccess(data.data));
    }
  } catch (error) {
    // User is not authenticated, don't show error toast
    console.log("User not authenticated", error);
  }
};
