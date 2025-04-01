import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

const initialState = {
  isLoading: false,
  locationList: [],
  locationDetails: null,
  error: null
};

export const fetchNearbyLocations = createAsyncThunk(
  "/locations/fetchNearbyLocations",
  async ({ latitude, longitude, radius = 5000, type }) => {
    try {
      const result = await axios.get(
        `${API_ENDPOINTS.shop.locations.nearby}`,
        {
          params: {
            latitude,
            longitude,
            radius,
            type
          },
          withCredentials: true
        }
      );
      return result?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchLocationDetails = createAsyncThunk(
  "/locations/fetchLocationDetails",
  async (placeId) => {
    try {
      const result = await axios.get(
        API_ENDPOINTS.shop.locations.details(placeId),
        {
          withCredentials: true
        }
      );
      return result?.data;
    } catch (error) {
      throw error;
    }
  }
);

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocationDetails: (state) => {
      state.locationDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyLocations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locationList = action.payload.data;
        state.error = null;
      })
      .addCase(fetchNearbyLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.locationList = [];
        state.error = action.error.message;
      })
      .addCase(fetchLocationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locationDetails = action.payload.data;
        state.error = null;
      })
      .addCase(fetchLocationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.locationDetails = null;
        state.error = action.error.message;
      });
  },
});

export const { setLocationDetails, clearError } = locationsSlice.actions;
export default locationsSlice.reducer; 