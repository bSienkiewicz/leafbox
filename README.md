# Leafbox Web App

#### Project map:
* ***Leafbox Web App***
* **[Leafbox ESP32](https://github.com/bSienkiewicz/leafbox-esp)**
* **[Leafbox API](https://github.com/bSienkiewicz/leafbox-api)**
---

Leafbox Web App is a Next.js application developed for the Leafbox Project. This app serves as a user interface for managing a virtual garden, integrating with the Leafbox API and ESP32 devices to provide a comprehensive plant monitoring and control system. Hosted in a Dockerized environment, it offers seamless interaction with the backend services and MQTT broker.

![image](https://github.com/bSienkiewicz/leafbox/assets/50502786/7d348e7a-2763-41d7-9456-db4141300b75)


## Features

- **Account Management**: Users can create and manage their accounts, allowing personalized access to their virtual garden.
- **Dashboard**: Displays recent measurements from the system, providing an overview of the plant conditions.
- **Garden Management**: Users can add new plants, monitor existing ones, and view detailed information about each plant.
- **Real-Time Data**: Moisture measurements are illustrated with graphs, updating automatically via WebSockets.
- **Configurable Parameters**: Users can set minimum and maximum moisture levels for each plant and determine water delivery amounts based on pump efficiency.
- **Device Integration**: Updates ESP32 devices with the latest configuration and allows users to assign plants to specific sensors.

## Features
- **Dockerized Deployment**: Seamless setup with Docker, ensuring a consistent environment.
- **MQTT Integration**: Listens for data from connected measuring devices via MQTT for real-time updates.
- **Database Management**: Interfaces with a MySQL database to store and retrieve plant data.
- **Image Storage**: Efficiently manages and serves plant images uploaded through the app.
- **Thesis Project**: Developed as part of a BSc thesis, showcasing practical implementation of backend technologies.

## Setup and Installation
Due to university project constraints, the complete Docker Compose file with required configurations cannot be shared. You may need to adapt the setup according to your environment and project requirements.

## User Guide

#### Garden Management
User can add a **new plant to their system** or **view existing plants and their details**. Each plant’s page includes a graph of moisture measurements over time.

![image](https://github.com/bSienkiewicz/leafbox/assets/50502786/07053aae-44a0-495e-b55f-e1ec20516f17)

![image](https://github.com/bSienkiewicz/leafbox/assets/50502786/7fac7338-5826-41ec-b7aa-e81c05c8488e)

#### Plant Configuration
User can define minimum and maximum moisture levels for each plant, adjust water delivery settings based on pump efficiency. ESP32 devices receive updated settings after each configuration.

### Device Management
User can check all connected devices and their status, and assign plants to specific sensors on the devices (up to 4 plants per device). They also can dedicate one of the inputs for the temperature sensor.

![image](https://github.com/bSienkiewicz/leafbox/assets/50502786/fb5b9ff9-d54f-4926-9f8a-d465fc366e28)
