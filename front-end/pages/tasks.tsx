import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS_QUERY } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import TaskList from '../components/TaskList';
import CreateTask from '../components/CreateTask';

export default function TasksPage() {
  const { isAuthenticated, isAuthenticationInProcess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticationInProcess) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isAuthenticationInProcess]);

  const { data, loading, error } = useQuery(GET_TASKS_QUERY);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  return (
    <div className="container my-5">
      <h1 className="mb-4">Task Manager</h1>
      <CreateTask />
      <TaskList tasks={data.tasks} />
    </div>
  );
}
