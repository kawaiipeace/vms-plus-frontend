import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const team: any = {};

export const teamSlice = createSlice({
  name: 'team',
  reducers: {
    setTeam: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  initialState: team,
});

export const { setTeam } = teamSlice.actions;
export default teamSlice.reducer;
