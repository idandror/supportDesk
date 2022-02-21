import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { getTicket, closeTicket } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';
import { GoBackButton } from '../components/GoBackButton';
import { useParams } from 'react-router-dom';
import { createNote, getNotes, Note } from '../features/notes/noteSlice';
import { NoteItem } from '../components/NoteItem';
import { FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../app/hooks';

interface styles {
  content:{}
}
const customStyles: styles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  },
};

Modal.setAppElement('#root');

function Ticket() {
  const { user } = useAppSelector((state) => state.auth);
  const { ticket, isLoading, isError, message } = useAppSelector(
    (state) => state.ticket
  );
  const {
    notes,
    isLoading: notesIsLoading,

    isError: notesIsError,
    message: notesMessage,
  } = useAppSelector((state) => state.notes);

  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (isError || notesIsError) {
        toast.error(message);
        toast.error(notesMessage);
      }
      dispatch(getTicket(ticketId!));
      dispatch(getNotes(ticketId!));
    }
  }, [
    dispatch,
    navigate,
    notesIsError,
    notesMessage,
    user,
    isError,
    ticketId,
    message,
  ]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId!));
    toast.success('Ticket Closed');
    navigate('/tickets');
  };

  const openModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const onNoteSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId) {
      dispatch(createNote({ noteText, ticketId }));
    }
    openModal();
  };
  return (
    <div>
      {(isLoading || notesIsLoading) && <Spinner />}
      <div className="ticket-page">
        <header className="ticket-header">
          <GoBackButton url="/tickets" />
          <h2>
            Ticket ID: {ticket._id}
            <span className={`status status-${ticket.status}`}>
              {ticket.status}
            </span>
          </h2>
          <h3>
            Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
          </h3>
          <h3>Product: {ticket.product}</h3>
          <hr />
          <div className="ticket-desc">
            <h3>Description of Issue</h3>
            <p>{ticket.description}</p>
          </div>
          <h2>Notes</h2>
        </header>

        {ticket.status !== 'closed' && (
          <button onClick={openModal} className="btn">
            <FaPlus />
            Add Note
          </button>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={openModal}
          style={customStyles}
          contentLabel="Add Note"
        >
          <h2>Add Note</h2>
          <button className="btn-close" onClick={openModal}>
            X
          </button>
          <form onSubmit={onNoteSumbit}>
            <div className="form-group">
              <textarea
                name="noteText"
                id="noteText"
                placeholder="Note text"
                className="form-control"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </Modal>

        {notes?.map((note: Note) => (
          <NoteItem key={note._id} note={note} />
        ))}
        {ticket.status !== 'closed' && (
          <button className="btn btn-block btn-danger" onClick={onTicketClose}>
            Close Ticket
          </button>
        )}
      </div>
    </div>
  );
}

export default Ticket;
