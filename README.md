# Task Management System

I created this simple project to demonstrate my knowledge in the areas mentioned in the job description.

---

## Project Description

This website allows users to:
- Register
- Log in
- Create tasks
- Edit tasks
- Delete tasks

When a user creates a task, all other registered users will receive a notification via email or SMS.

---

## Technology Stack

- **Backend**: [Nest.js](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: [Next.js](https://nextjs.org/)
- **Communication**: [GraphQL](https://graphql.org/)

### Additional Features

- **Standalone Microservices**: Built using [Go](https://golang.org/) for sending notifications (as the vacancy mentioned hands-on Go experience as a bonus skill).
- **Messaging System**: [RabbitMQ](https://www.rabbitmq.com/) is used to trigger the Go-based notification system (experience in RabbitMQ, Kafka, or GCP Pub/Sub was mentioned as a plus).
- **Monitoring**: [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) are used for system monitoring (experience in Prometheus and Grafana was beneficial).
- **DevOps**: [GitHub Actions](https://github.com/features/actions) is used for CI/CD (devops experience was listed as a plus).

---

## Deployment Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/multeders/use_case_study.git
2. Create .env files in the backend and go-service folders based on the provided .env.example files:
    Simply remove .example from the file name.
3. Build and run the project using Docker Compose:
   ```bash
   docker-compose -f docker-compose.development.yml build
   docker-compose -f docker-compose.development.yml up -d
4. Access the website:
   Open your browser and visit: http://localhost:3000

