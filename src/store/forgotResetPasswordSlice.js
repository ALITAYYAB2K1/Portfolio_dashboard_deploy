import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotResetPassSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    forgotPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    resetPasswordFailed: (state, action) => {
      state.loading = false;
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
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,
  updateProfileResetAfterUpdate,
  clearALLErrors,
} = forgotResetPassSlice.actions;

// Fix: Correct export of reducer
export const forgotPasswordSlice = forgotResetPassSlice.reducer;

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest());
  try {
    const { data } = await axios.post(
      "https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/password/forgot",
      { email },
      {
        headers: {
          //withCredentials: true,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(forgotPasswordSuccess(data.message));
    dispatch(clearALLErrors());
  } catch (error) {
    dispatch(forgotPasswordFailed(error.response.data.message));
  }
};

export const resetPassword =
  (token, password, confirmPassword, navigateTo) => async (dispatch) => {
    dispatch(resetPasswordRequest());
    try {
      const { data } = await axios.put(
        `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(resetPasswordSuccess(data.message));
      dispatch(clearALLErrors());

      // ✅ Navigate to home after successful password reset
      navigateTo("/");
    } catch (error) {
      dispatch(resetPasswordFailed(error.response.data.message));
    }
  };

export const clearAllForgotPasswordErrors = () => (dispatch) => {
  dispatch(clearALLErrors());
};
