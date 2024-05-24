import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignOut, checkUser, createUser } from "./authAPI";
import { updateUser } from "../user/userAPI";

const initialState = {
  loggedInUser: null,
  status: "idle",
  error: null,
};

export const createUserAsync = createAsyncThunk(
  "auth/createUser",
  async (user) => {
    const response = await createUser(user);
    return response.data;
  }
);
export const checkUserAsync = createAsyncThunk(
  "auth/checkUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await checkUser(user);
      return response.data;
    } catch (error) {
      console.log(error.err);
      return rejectWithValue(error.err);
    }
  }
);
export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async (user) => {
    const response = await updateUser(user);
    return response.data;
  }
);
export const SignOutAsync = createAsyncThunk("auth/SignOut", async () => {
  const response = await SignOut();
  return response.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
        state.error = null;
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
      })
      .addCase(SignOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SignOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = null;
      });
  },
});

export const { increment } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
