import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'auth/fetchProducts', // action type string
  async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/products');
      const response = await axios.get(`${window.location.origin}/api/products`);
      // axios.delete(`${window.location.origin}/api/products/${id}`)
      return response.data.data; // Return the data to the payload
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // Reject the action in case of an error
    }
  }
);

const AuthReducer = createSlice({
  name: "auth",
  initialState: {
    products: [],
    language: "en",
  },
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // When the fetch is successful, store the products in state
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // Handle error case (optional)
        console.error("Error fetching products:", action.error.message);
      });
  },
});

const { actions } = AuthReducer;

export const { setLanguage } = actions;

export default AuthReducer.reducer;
