import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/AccountReducer";
import { User } from "./Account/userInterface";
const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

// Define the RootState interface
export interface RootState {
  account: {
    currentUser: User | null; // Define User type according to your application
  };
}

// Export the store as the default export
export default store;
