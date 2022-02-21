import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import noteSlice from '../features/notes/noteSlice';
import ticketSlice from '../features/tickets/ticketSlice';

export const store = configureStore({
  reducer: { auth: authSlice, notes: noteSlice, ticket: ticketSlice },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
