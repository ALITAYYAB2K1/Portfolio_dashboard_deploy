import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    loading: false,
    messages: [],
    error: null,
    message: null,
    deleteLoading: false,
  },
  reducers: {
    getAllMessagesRequst: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllMessagesSuccess: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    getAllMessagesFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMessageRequest: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteMessageSuccess: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload
      );
      state.deleteLoading = false;
      state.message = "Message deleted successfully";
    },
    deleteMessageFailed: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },
    clearALLErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  getAllMessagesRequst,
  getAllMessagesSuccess,
  getAllMessagesFailed,
  deleteMessageRequest,
  deleteMessageSuccess,
  deleteMessageFailed,
  clearALLErrors,
} = messageSlice.actions;

export const getAllMessages = () => async (dispatch) => {
  dispatch(getAllMessagesRequst());
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/messages/getall?_=${timestamp}`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.data) {
      dispatch(getAllMessagesSuccess(response.data.data));
    } else {
      dispatch(getAllMessagesSuccess([]));
    }
  } catch (error) {
    let errorMessage = "Failed to fetch messages";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }

    dispatch(getAllMessagesFailed(errorMessage));
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  dispatch(deleteMessageRequest());
  try {
    await axios.delete(
      `https://portfolio-backend-deploy-jj0i.onrender.com/api/v1/messages/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteMessageSuccess(id));
    toast.success("Message deleted successfully");
  } catch (error) {
    let errorMessage = "Failed to delete message";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }

    dispatch(deleteMessageFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export default messageSlice.reducer;
