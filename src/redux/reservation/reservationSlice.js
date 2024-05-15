import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservations: null,
  error: null,
  loading: false,
};

const reservationSlice = createSlice({
  name: "Reservation",
  initialState,
  reducers: {
    getReservationStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    getReservationSuccess: (state, action) => {
      state.reservations = action.payload;
      state.loading = false;
      state.error = null;
    },
    getReservationFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  getReservationStart,
  getReservationSuccess,
  getReservationFailure,
  resetState,
} = reservationSlice.actions;

export default reservationSlice.reducer;
