import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'auth/fetchProducts', // action type string
  async () => {
    try {
      // Make the API request
      const response = await axios.get(`${window.location.origin}/api/products`);
      
      // Log the response to check the data
      console.log(response, "check_response");

      // Return the data to the payload
      return response.data.data; 
    } catch (error) {
      // Log the error and throw it to reject the action
      console.error("Error fetching products:", error);
      throw error; 
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
