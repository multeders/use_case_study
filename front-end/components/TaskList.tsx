import React from 'react';
import { useMutation } from '@apollo/client';
import { GET_TASKS_QUERY } from '../graphql/queries';
import { DELETE_TASK } from '../graphql/mutations';
import EditTask from './EditTask';
import { Task } from '../interfaces/task.interface';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS_QUERY }]
  });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id } });
    }
  };

  return (
    <div className="row g-4">
      {tasks.map((task) => (
        <div key={task.id} className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
              <p className="card-text">
                <small className="text-muted">Status: {task.status}</small>
              </p>
              <EditTask task={task} />
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
