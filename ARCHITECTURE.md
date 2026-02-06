# System Architecture & Scalability

## 1. Executive Summary
The PPSDM Integrated System ("Jarvis") is a high-performance, modular platform designed for holistic student development. It leverages a modern **Microservices Architecture** to ensure scalability, fault tolerance, and independent deployment of specialized modules (Mental, Physical, Spiritual, etc.).

## 2. Backend Architecture

### 2.1. Data Layer Strategy
The system employs a **Polyglot Persistence** strategy, utilizing the best database for each data type:

*   **PostgreSQL (Relational Core)**:
    *   **Purpose**: Stores structured, mission-critical data.
    *   **Entities**: User Profiles (`users`), Academic Records (`gpa_logs`), Project Portfolios (`projects`), Access Control Lists (ACLs).
    *   **Rationale**: ACID compliance is non-negotiable for academic and profile data.

*   **TimescaleDB (Time-Series)**:
    *   **Purpose**: Handling high-frequency behavioral logs.
    *   **Entities**: Daily Check-ins (`mental_logs`, `physical_logs`), Habit Streaks, IoT Device Data (future smart campus integration).
    *   **Rationale**: Optimized for aggregations over time (e.g., "Show me my average sleep quality over the last semester").

*   **Redis (In-Memory Cache)**:
    *   **Purpose**: Ultra-low latency access and real-time features.
    *   **Usage**: Session management, Leaderboard caching, Real-time notifications (WebSockets pub/sub).

### 2.2. Application Layer (Microservices)
The backend is decomposed into domain-driven microservices. While currently implemented as a Modular Monolith in Next.js for speed, the logical boundaries are robust enough for future extraction into independent containers.

1.  **Identity Service**: Auth, Profile Management.
2.  **Assessment Engine**: Scoring logic for Psychometric/Technical tests.
3.  **Holistic Aggregator**: The "NEXUS" service that pulls data from all other services to calculate the Radar Score.
4.  **Growth Engine**: Gamification (XP, Levels) and Recommendation System.
5.  **Stewardship Core**: Manages the 3D generation seeds and legacy data.

### 2.3. Event-Driven Communication
*   **Apache Kafka / RabbitMQ**: Used for asynchronous messaging between services.
    *   *Example*: When a user completes a "Project" (Output Service), an event `PROJECT_COMPLETED` is fired.
    *   The **Growth Service** consumes this to award XP.
    *   The **Stewardship Service** consumes this to grow a new "Leaf" on the Legacy Tree.

## 3. Frontend Architecture

### 3.1. Tech Stack
*   **Framework**: Next.js 14 (React 18) for Hybrid Rendering (SSR/CSR).
*   **Language**: TypeScript for type safety across the board.
*   **State Management**: Zustand (Local-first persistence).
*   **Visualizations**:
    *   **2D**: Recharts (Radar, Line, Pie).
    *   **3D**: React Three Fiber (WebGL) for the "Soul Mandala" and "Stewardship" views.
    *   **Architecture**: Custom SVG Interactive Diagrams.

### 3.2. PWA & Offline Strategy
*   **Service Workers**: Pre-caching critical assets (CSS, JS, Fonts) and API responses for "App Shell" architecture.
*   **Offline Fallback**: `zustand/persist` ensures that if a user loses internet, they can still view their last known stats and log new data (queued for sync).

## 4. Infrastructure & Scalability

### 4.1. Deployment Strategy
*   **Containerization**: Docker files for every service/module.
*   **Orchestration**: Kubernetes (K8s) for managing repicas.
*   **CI/CD**: Automatic testing and deployment pipeline via GitHub Actions.

### 4.2. Performance Optimization
*   **Lazy Loading**: Heavy 3D components (`StewardshipCanvas`) are lazy-loaded via `next/dynamic` to ensure fast initial page load.
*   **Edge Caching**: CDN (Cloudflare/Vercel Edge) caches static assets close to the user.
*   **Database Indexing**: Heavy read queries (e.g., "Get all students with > 80 Mental Health") are optimized with B-Tree indexes.

### 4.3. Security
*   **Data Sovereignty**: Sensitive psychological data involves End-to-End Encryption where possible.
*   **On-Premise Option**: designed to be deployable on ITS Data Center infrastructure for compliance.

## 5. Future Roadmap
*   **AI Agent Integration**: "Jarvis" becoming proactive (push notifications based on predictive analytics).
*   **Blockchain Verification**: Issuing NFT-based certificates for the "Wisdom Bridge" milestones.
