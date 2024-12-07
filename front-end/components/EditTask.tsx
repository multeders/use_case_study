import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_TASKS_QUERY } from '../graphql/queries';
import { EDIT_TASK } from '../graphql/mutations';
import { Task } from '../interfaces/task.interface';

export default function EditTask({ task }: { task: Task }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const [editTask, { loading }] = useMutation(EDIT_TASK, {
    refetchQueries: [{ query: GET_TASKS_QUERY }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editTask({ variables: { id: task.id, title, description, status } });
  };

  return (
    <div className='row'>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    className="form-control"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
            </div>
            <div className="mb-3">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div className="mb-3">
                <button type="submit" disabled={loading} className='btn btn-primary'>
                    {loading ? 'Updating...' : 'Update Task'}
                </button>
            </div>
        </form>
    </div>
    
  );
}
