import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_TASKS_QUERY } from '../graphql/queries';
import { CREATE_TASK } from '../graphql/mutations';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS_QUERY }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({ variables: { title, description, status } });
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          className="form-select"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
