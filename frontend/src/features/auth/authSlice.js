import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignOut, loginUser, createUser, checkAuth } from "./authAPI";

const initialState = {
  loggedInUser: null,
  status: "idle",
  error: null,
  userChecked: false,
};

export const createUserAsync = createAsyncThunk(
  "auth/createUser",
  async (user) => {
    const response = await createUser(user);
    return response.data;
  }
);
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await loginUser(user);
      return response.data;
    } catch (error) {
      console.log(error.err);
      return rejectWithValue(error.err);
    }
  }
);
export const checkAuthAsync = createAsyncThunk("auth/checkAuth", async () => {
  try {
    const response = await checkAuth();
    return response.data;
  } catch (error) {
    console.log(error.err);
  }
});

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
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(SignOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SignOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userChecked = true;
        state.loggedInUser = action.payload;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userChecked = true;
      });
  },
});

export const { increment } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;

export default authSlice.reducer;
