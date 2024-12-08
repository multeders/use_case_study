---

# Monitoring Setup

This guide provides detailed instructions on setting up and accessing the monitoring system for the Task Management System.

---

## Setting Up Monitoring

1. Navigate to the `monitor` folder:
   ```bash
   cd monitor
2. Build the monitoring Docker Compose services:
   ```bash
   docker-compose -f docker-compose.monitor.yml build
3. Run the monitoring services:
   ```bash
   docker-compose -f docker-compose.monitor.yml up -d

---

## Access the Services

**Grafana**: Open [http://localhost:3001](http://localhost:3001) in your browser. Log in with:
- **Username**: `admin`
- **Password**: `admin` (or the one you set in the environment variables).

**Prometheus**: Open [http://localhost:9090](http://localhost:9090) to access the Prometheus UI.

**Node Exporter**: Metrics are available at [http://localhost:9100/metrics](http://localhost:9100/metrics).

---

## Configure Grafana

To add Prometheus as a Data Source:
- Navigate to the Grafana UI under **Connections** > **Data Sources**.
- Add a new data source and choose **Prometheus**.
- Set the URL to `http://prometheus:9090`.

To import dashboards:
- Navigate to **Dashboards** > **Import**.
- Use Dashboard ID `1860` (Node Exporter Full Dashboard) or any other relevant ID from the Grafana dashboards repository.

To set up alerts (optional):
- Go to your dashboard in Grafana and configure alerts based on the metrics (e.g., CPU > 80%).
