# Enterprise Multi-Tenant SaaS Platform (Shared Schema Model)


A production-live, fully containerized Multi-Tenant Software-as-a-Service (SaaS) platform engineered to enforce zero-trust logical data isolation. The system implements a high-efficiency **Single-Database, Shared-Schema (Discriminator Column)** architectural model. This topology allows a single backend instance and a unified database cluster to serve multiple independent client organizations (tenants) simultaneously, drastically reducing cloud compute overhead and database licensing costs for enterprise B2B scaling.

---

## 🚀 Live Cloud Deployment

- **Production Code Repository:** [https://github.com](https://github.com/Dalu-codes/multi-tenant-saas-platform.git)
- **Production User Interface:** [https://multi-tenant-saas-platform.vercel.app](https://multi-tenant-saas-platform.vercel.app)
- **Production API Gateway (Health Check):** [https://onrender.com](https://multi-tenant-saas-platform-fxtc.onrender.com)

---

## 🏗️ System Topology & Data Flow Architecture

```text
       [ Client Browser (Vercel Global Edge CDN) ]
                           │
                           ▼ (Asynchronous HTTPS / Axios Payload Routing)
       [ Spring Boot REST Controller Gates (Render Cloud Container) ]
                           │
                           ▼ (Decoupled Dependency Injection via Beans)
       [ Product Service Layer (Enforces Tenant Boundaries) ]
                           │
                           ▼ (Query Derivation / Hibernate ORM Extraction)
       [ Spring Data JPA Repository Access Layer ]
                           │
                           ▼ (HikariCP Pooled TLS TCP/IP Stream)
       [ Serverless PostgreSQL Cluster (Neon.tech Managed Infrastructure) ]
```

### Key Engineering Safeguards Enforced:
1. **Three-Tier Decoupling:** Enforces a rigid separation of concerns. HTTP payload processing maps to the Controller, business rules and security overrides live in the `@Service` layer, and SQL transactions abstract behind a unified `JpaRepository` interface.
2. **Defensive Data Perimeter Protection:** To prevent Cross-Tenant Data Leakage (Insecure Direct Object Reference - IDOR), the backend completely ignores raw tenant identifier parameters sent within client request bodies. Instead, the `@Service` layer intercepts incoming data pipelines and programmatically overwrites parameters using secure, verified path variables (`product.setTenantId(tenantId)`).
3. **High-Performance Database Pooling:** Leverages **HikariCP** connection pooling to maintain pre-authenticated database channels over a TLS connection to Neon PostgreSQL. This eliminates connection handshake latency overhead under heavy concurrent multi-client traffic profiles.
4. **Zero-Trust Secret Injection:** Absolute isolation of infrastructure configurations from source control code files. Database routing links, server ports, and authentication parameters utilize Spring dynamic interpolation (`${DB_URL}`), resolving variables through secure cloud environment vaults at runtime.

---

## 🎨 Front-End Design System Specification

The user interface components are driven by a strict modular design token matrix to guarantee layout uniformity, absolute visual hierarchy consistency, and an elite enterprise B2B user experience.

- **Typography Baseline:** Poppins (Geometric Sans-Serif, explicitly scaled via responsive layout values).
- **Type Scale Rules:** Main Platform Headers: `36px` (Semi-Bold) | Section Actions: `21px` (Medium) | Data Grid Output Labeling: `16px` (Regular).
- **Figma Palette Color Token Mappings:**
  - **Base Layout Background:** `#ebeff0` (Slate-Blue 50)
  - **Secondary Structural Borders:** `#c0ccd0` (Slate-Blue 100)
  - **Primary Component Action / CTA Node:** `#335c67` (Slate-Blue 500)
  - **Card Containers / Headings Accent:** `#1c3339` (Slate-Blue 800)
  - **Deep Text Neutral:** `#15272b` (Slate-Blue 900)

---

## 🛠️ Multi-Stage Docker Virtualization Container

The backend service runs inside a multi-stage `Dockerfile` to optimize cloud deployment efficiency, resulting in a lightweight final image stripping away all unnecessary Maven build dependencies:

```dockerfile
# Stage 1: Build compilation artifact
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Ultralight, secure production Java Runtime Environment
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 🔧 Local Development Installation Guide

### Prerequisites
- Java Development Kit (JDK) 21
- Node.js & npm environment
- Active local PostgreSQL instance or pgAdmin server configuration

### 1. Database Initialization
Create an empty database bucket named `multitenant_db` inside your PostgreSQL server environment.

### 2. Environment Variables Injection
Map these environment tokens inside your IDE's Run/Debug Configuration profile variables:
```properties
DB_URL=jdbc:postgresql://localhost:5432/multitenant_db
DB_USER=postgres
DB_PASSWORD=root
```

### 3. Execution Commands
Execute these commands concurrently across separate terminal split-panes to initialize the full stack locally:

```bash
# Boot Backend Enterprise Server Core Engine
cd multi-tenant
./mvnw spring-boot:run

# Boot Frontend Application User Interface Panel
cd ../frontend
npm install
npm run dev
```
