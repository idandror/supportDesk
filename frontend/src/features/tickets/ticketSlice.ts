import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import ticketService from './ticketService';

export interface ticketState {
  tickets: Ticket[] | null;
  ticket: Ticket;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string | null;
}

export interface Ticket {
  product: string;
  createdAt: string | number | Date;
  _id: string;
  description: string;
  ticketId: string;
  isStaff: boolean;
  user: string;
  status: 'open' | 'closed';
}

const ticketInitialState: Ticket = {
  product: '',
  createdAt: '',
  _id: '',
  description: '',
  ticketId: '',
  isStaff: false,
  user: '',
  status: 'open',
};
export interface ticketData {
  product: string;
  description: string;
}
const initialState: ticketState = {
  tickets: [],
  ticket: ticketInitialState,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

//Create new ticket
export const createTicket = createAsyncThunk<
  Ticket,
  ticketData,
  { state: RootState; rejectValue: Error }
>('tickets/create', async (ticketData, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.user?.token;
    return await ticketService.createTicket(ticketData, token!);
  } catch (error) {
    return thunkApi.rejectWithValue(
      new Error(`failed to createTicket ${error}`)
    );
  }
});

//Get user tickets
export const getTickets = createAsyncThunk<
  Ticket[],
  string,
  { state: RootState; rejectValue: Error }
>('tickets/getAll', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.user?.token;
    return await ticketService.getTickets(token!);
  } catch (error) {
    return thunkApi.rejectWithValue(new Error(`failed to getTickets ${error}`));
  }
});

//Get Single user ticket
export const getTicket = createAsyncThunk<
  Ticket,
  string,
  { state: RootState; rejectValue: Error }
>('tickets/get', async (ticketId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await ticketService.getTicket(ticketId, token!);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      new Error(`failed to get a Ticket ${error}`)
    );
  }
});

//Close Single user ticket
export const closeTicket = createAsyncThunk<
  Ticket,
  string,
  { state: RootState; rejectValue: Error }
>('tickets/close', async (ticketId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await ticketService.closeTicket(ticketId, token!);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      new Error(`failed to close a Ticket ${error}`)
    );
  }
});

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: (state) => (state = initialState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTicket.rejected, (state: ticketState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload!.message;
      })
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTickets.fulfilled, (state: ticketState, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state: ticketState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload!.message;
      })
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTicket.fulfilled, (state: ticketState, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
      })
      .addCase(getTicket.rejected, (state: ticketState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload!.message;
      })
      .addCase(closeTicket.fulfilled, (state: ticketState, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets?.map((ticket: Ticket) =>
          ticket._id === action.payload._id
            ? (ticket.status = 'closed')
            : ticket
        );
        state.ticket = action.payload;
      });
  },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
