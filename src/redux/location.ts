import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../redux/store'

// Define a type for the slice state
interface LocationState {
  location: string 
}

// Define the initial state using that type
const initialState: LocationState = {
  location:"/"
}

export const locationSlice = createSlice({
  name: "locationState",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    //stateHome: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    //  state.page = "home"
    //},
    //stateProjects: (state) => {
    //  state.page = "projects"
    //},
    //stateResume: (state) => {
    //    state.page = "resume"
    //},
    // Use the PayloadAction type to declare the contents of `action.payload`
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLocation } = locationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLocation = (state: RootState) => state.locationState.location

export default locationSlice.reducer
