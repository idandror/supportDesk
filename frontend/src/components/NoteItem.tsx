import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Note } from '../features/notes/noteSlice';

export const NoteItem: React.FC<{ note: Note }> = ({ note }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div
      className="note"
      style={{
        backgroundColor: note.isStaff ? 'rgba(0,0,0,0.7' : '#fff',
        color: note.isStaff ? '#fff' : '#000',
      }}
    >
      <h4>
        Note from {note.isStaff ? <span>Staff</span> : <span>{user?.name}</span>}
      </h4>
      <p>{note.noteText}</p>
      <div className="note-date">
        {new Date(note.createdAt).toLocaleString('en-US')}
      </div>
    </div>
  );
};
