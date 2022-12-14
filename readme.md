# Performance Testing with K6

## Getting started:
- `docker-compose up -d influxdb grafana` to set up
- `docker-compose run k6 run /tests/script.js` to run tests
- update data input in /tests/data.csv if needed, and configure options in /tests/script.js to perform load testing
- to see the report and real-time data load http://localhost:3000, and import the `grafana_dashboard.json` config
