import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!, $status: String!) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

export const EDIT_TASK = gql`
  mutation EditTask($id: Int!, $title: String, $description: String, $status: String) {
    editTask(id: $id, title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;

// Register Mutation
export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $phone: String, $password: String!) {
    register(username: $username, email: $email, phone: $phone, password: $password) {
      id
      username
      email
      phone
    }
  }
`;

// Login Mutation
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;