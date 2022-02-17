import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { reset, getTickets } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';
import { GoBackButton } from '../components/GoBackButton';
import TicketItem from '../components/TicketItem';

function Tickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.ticket
  );
  const { user } = useSelector((state) => state.auth);
  //TWO use effects in order to call the reset dispatch only once!
  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (isError) {
        toast.error(message);
      }
      dispatch(getTickets());
    }
  }, [dispatch, user, navigate, isError, message]);
  return (
    <div>
      {isLoading && <Spinner />}
      <GoBackButton url="/" />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

export default Tickets;
