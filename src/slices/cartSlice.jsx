import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []   // ✅ unified key
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log("PAYLOAD:", action.payload);
      console.log("BEFORE:", state.items);

      const existing = state.items.find(
        item => item.id === action.payload.id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1
        });
      }

      console.log("AFTER:", state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => item.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;