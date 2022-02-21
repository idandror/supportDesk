import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  RootState } from '../../app/store';
import noteService from './noteService';

export interface noteState {
  notes: Note[] | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string | null;
}

export interface Note {
  createdAt: string | number | Date;
  _id: string;
  noteText: string;
  ticketId: string;
  isStaff: boolean;
  user: string;

}

export interface createNoteInterface {
  ticketId: string;
  noteText: string;
}

const initialState: noteState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

//Get Single ticket notes
export const getNotes = createAsyncThunk<
  Note[],
  string,
  { state: RootState; rejectValue: Error }
>('notes/getAll', async (ticketId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await noteService.getNotes(ticketId, token!);
  } catch (error) {
    return thunkAPI.rejectWithValue(new Error(`failed to get notes ${error}`));
  }
});

//Create a ticket note
export const createNote = createAsyncThunk<
  Note,
  createNoteInterface,
  { state: RootState; rejectValue: Error }
>('notes/create', async ({ noteText, ticketId }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await noteService.createNote(noteText, ticketId, token!);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      new Error(`failed to create a note ${error}`)
    );
  }
});

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    reset: (state) => (state = initialState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload!.message;
      })
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes?.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload!.message;
      });
  },
});

export const { reset } = noteSlice.actions;
export default noteSlice.reducer;
