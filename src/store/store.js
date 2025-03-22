import { configureStore } from "@reduxjs/toolkit";
import { userReducers } from "./userSlice.js";
import { forgotPasswordSlice } from "./forgotResetPasswordSlice.js";
import messagesReducer from "./messageSlice.js";
import timelineReducer from "./timelineSlice.js";
import skillReducer from "./skillSlice.js";
import softwareApplicationReducer from "./softwareApplicationSlice.js";
import projectReducer from "./projectSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducers,
    forgotPassword: forgotPasswordSlice,
    messages: messagesReducer,
    timeline: timelineReducer,
    skill: skillReducer,
    softwareApplication: softwareApplicationReducer,
    project: projectReducer,
  },
});
