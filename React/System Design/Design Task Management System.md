Here is an end-to-end System Design for a production-grade **Task Management System** (like Jira, Asana, or Trello) built to handle multi-tenant workspaces, real-time status updates, complex filtering, and background notifications.

---

# 1. Requirements & System Constraints

### Functional Requirements

1. **Workspace & Project Management:** Users can create workspaces, projects, and tasks/subtasks.
2. **Task Operations (CRUD):** Create, assign, edit, transition states (e.g., `Todo` $\rightarrow$ `In Progress` $\rightarrow$ `Done`), and delete tasks.
3. **Real-Time Collaboration:** Real-time updates across active users when tasks are moved or updated.
4. **Rich Querying & Search:** Filter tasks by assignee, status, due date, priority, and search text.
5. **Notifications:** Email and push notifications on task assignments, mentions, and approaching due dates.

### Non-Functional Requirements

* **Low Latency Reads/Updates:** Fetching task boards and applying status updates should execute in $<50\text{ms}$.
* **Data Consistency:** State changes must maintain strong consistency to prevent race conditions (e.g., two users updating status concurrently).
* **High Availability & Scalability:** Support millions of active users across multiple tenants without cross-tenant performance degradation.

---

# 2. High-Level Architecture Diagram

```text
                               ┌─────────────────┐
                               │   API Gateway   │
                               │ (Auth / Limit)  │
                               └────────┬────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
 ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
 │ Task Service     │         │ Real-Time WS     │         │ Search Service   │
 │ (Express / Go)   │         │ Service (Socket) │         │ (Elasticsearch)  │
 └────────┬─────────┘         └────────▲─────────┘         └────────▲─────────┘
          │                            │                            │
          ▼                            │                            │
 ┌──────────────────┐         ┌────────┴─────────┐                  │
 │ PostgreSQL       │         │ Redis Pub/Sub    │                  │
 │ (Primary DB)     │         └────────▲─────────┘                  │
 └────────┬─────────┘                  │                            │
          │                            │                            │
          └───────────────┬────────────┴────────────────────────────┘
                          ▼
                ┌──────────────────┐
                │ Kafka Event Bus  │
                └─────────┬────────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Notification /   │
                │ Indexer Workers  │
                └──────────────────┘

```

---

# 3. Data Storage & Schema Design

Relational databases (like **PostgreSQL**) are the best fit for task management due to strong ACID guarantees, structured foreign-key relationships, and indexing capabilities.

### Key Database Tables (PostgreSQL)

```sql
-- Workspaces (Multi-Tenant Container)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'TODO', -- e.g. TODO, IN_PROGRESS, REVIEW, DONE
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    assignee_id UUID,
    reporter_id UUID NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    version INT DEFAULT 1, -- For Optimistic Locking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Querying
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

```

---

# 4. Solving Key Engineering Challenges

### A. Real-Time Collaboration & Updates

When User A moves a card from `In Progress` to `Done`, User B on the same board must see the change immediately without manual page refreshes.

* **Architecture:** Use **WebSockets** (or Server-Sent Events).
* **Scaling WebSockets with Redis Pub/Sub:**

1. API Server processes the task update and writes to PostgreSQL.
2. API Server publishes an event (`TASK_UPDATED`) to **Redis Pub/Sub**.
3. All WebSocket server nodes subscribed to that project's channel receive the message and broadcast it to connected clients.

---

### B. Concurrent Edits & Optimistic Locking

If two users edit the same task description or change status at the exact same time, we must prevent dirty overwrites using **Optimistic Locking**.

```javascript
// Example: Updating a task safely
async function updateTaskStatus(taskId, newStatus, currentVersion) {
  const result = await db.query(
    `UPDATE tasks 
     SET status = $1, version = version + 1, updated_at = NOW() 
     WHERE id = $2 AND version = $3 
     RETURNING *`,
    [newStatus, taskId, currentVersion]
  );

  if (result.rowCount === 0) {
    throw new Error("ConflictError: Task was updated by another user. Please reload.");
  }

  return result.rows[0];
}

```

---

### C. Search & Advanced Filtering

Querying tasks by text search, custom fields, assignees, and complex tags directly in SQL can cause query degradation as the table grows to millions of rows.

* **Solution:** Offload search to **Elasticsearch**.
* **Sync Mechanism (CDC / Event Driven):**

1. Task update happens in PostgreSQL.
2. PostgreSQL triggers a Change Data Capture (CDC via Debezium) or publishes an event to **Kafka**.
3. Background workers consume Kafka events and update the Elasticsearch index asynchronously.

---

### D. Asynchronous Notification System

Sending emails or mobile push notifications on task assignments should never block the main HTTP request thread.

```javascript
// Asynchronous Event Publishing
async function assignTask(taskId, assigneeId) {
  // 1. Transactional DB Update
  const updatedTask = await db.tasks.update({ id: taskId, assigneeId });

  // 2. Publish Event to Kafka
  await kafkaProducer.send({
    topic: 'task-events',
    messages: [{ key: taskId, value: JSON.stringify({ type: 'TASK_ASSIGNED', payload: updatedTask }) }]
  });

  return updatedTask;
}

// Separate Notification Worker Process
kafkaConsumer.subscribe({ topic: 'task-events' });
kafkaConsumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    if (event.type === 'TASK_ASSIGNED') {
      await sendEmailNotification(event.payload.assigneeId, event.payload);
    }
  }
});

```

---

# 5. Summary Matrix of Components

| Component                  | Technology                | Responsibility                                                    |
| -------------------------- | ------------------------- | ----------------------------------------------------------------- |
| **Primary DB**             | PostgreSQL                | Source of truth, ACID transactions, relational project structures |
| **Cache & Real-Time Sync** | Redis                     | Hot board caching & Redis Pub/Sub for WebSockets                  |
| **Search Engine**          | Elasticsearch             | Text search, multi-faceted filtering, and reporting               |
| **Message Broker**         | Apache Kafka              | Decoupling background jobs (notifications, indexing, audit logs)  |
| **Real-Time Layer**        | WebSockets (Socket.io/Go) | Instant client updates across shared boards                       |
