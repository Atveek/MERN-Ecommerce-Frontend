import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchProductByFilters } from "./productAPI";

const initialState = {
  products: [],
  status: "idle",
  totalItems: 0,
};

export const fetchAllProductAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const response = await fetchAllProducts();
    return response.data;
  }
);

export const fetchProductByFiltersAsync = createAsyncThunk(
  "product/fetchProductByFilters",
  async ({ filter, sort, pagination }) => {
    console.log({ filter, sort });
    const response = await fetchProductByFilters(filter, sort, pagination);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      });
  },
});

export const { increment } = productSlice.actions;

export const selectAllProduct = (state) => state.product.products;
export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;
