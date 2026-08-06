Here is a recreated, highly structured textual summary and breakdown of the **Saga Pattern** depicted in the image.

---

# SAGA PATTERN 🪄

### *Managing distributed transactions one step at a time.*

> *"Think of it as a journey. Each step matters!"*

---

### What Is It?

* Saga breaks a big transaction into smaller steps across multiple services.
* Each step completes a **local transaction**.
* If something fails, we undo the completed steps using **compensating actions**.

---

### 1. Happy Path 🙂

When every service completes its local transaction successfully:

```text
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ 1. ORDER        │ ────► │ 2. PAYMENT      │ ────► │ 3. INVENTORY     │ ────► │ 4. SHIPPING      │
│    SERVICE      │       │    SERVICE      │       │    SERVICE       │       │    SERVICE       │
│    (Order       │       │    (Payment     │       │    (Stock        │       │    (Shipment     │
│     Created)    │       │     Processed)  │       │     Reserved)    │       │     Created)     │
└─────────────────┘       └─────────────────┘       └──────────────────┘       └──────────────────┘
         ✅                        ✅                         ✅                         ✅

```

✨ **Result:** **All Good!** The distributed transaction succeeds.

---

### 2. When Things Go Wrong 🙁

If a step fails mid-way (e.g., Inventory is out of stock), the system triggers **compensating transactions** in reverse to roll back completed steps:

```text
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ 1. ORDER        │ ────► │ 2. PAYMENT      │ ────► │ 3. INVENTORY     │ ─ - - │ 4. SHIPPING      │
│    SERVICE      │       │    SERVICE      │       │    SERVICE       │       │    SERVICE       │
│    (Order       │       │    (Payment     │       │    ❌ OUT OF     │       │    (Not          │
│     Created)    │       │     Processed)  │       │       STOCK!     │       │     Executed)    │
└─────────────────┘       └─────────────────┘       └──────────────────┘       └──────────────────┘
         │                         │                         ❌                          🚫
         │                         │
         ▼                         ▼
  [ Cancel Order ]        [ Refund Payment ]
  (Compensating)          (Compensating)
         └─────────────────────────┴─────────────────────── ROLLBACK

```

📍 **Result:** **System returns to a consistent state.**

---

### Why Use Saga Pattern?

* 🚀 **Handles failures gracefully**
* 🧩 **Works great for microservices**
* 📈 **Scales with your system**
* 🛡️ **No locks, no blocking** (Unlike traditional 2-Phase Commit / 2PC)

---

💡 **Key Takeaway:**

> In distributed systems, things *will* fail. Saga helps you recover and **move on**.

Show me how to implement an Orchestrated Saga Pattern in Express.js and Node.js using BullMQ and Redis.

Here is a production-grade implementation of the **Orchestrated Saga Pattern** in Node.js and Express using **BullMQ** and **Redis**.

In an **Orchestrated Saga**, a central service (the **Saga Orchestrator**) executes local transactions across microservices via message queues and listens for their outcomes. If any service fails, the Orchestrator initiates **compensating transactions** in reverse order to roll back the system into a consistent state.

---

### System Architecture Flow

```text
 Client
   │  POST /api/v1/orders
   ▼
[ Express API ]
   │
   ▼ Enqueues "start-saga"
[ SAGA ORCHESTRATOR ] ──(State Machine)
   │
   ├── 1. Command: "process-payment" ──► [ Payment Service Worker ]
   │   ◄── Event: "payment-success" ───┤
   │                                    │
   ├── 2. Command: "reserve-stock" ───► [ Inventory Service Worker ]
   │   ◄── Event: "stock-failed" ──────┘ (OUT OF STOCK!)
   │
   └── 🚨 FAILURE DETECTED: Trigger Compensating Rollbacks 🚨
       │
       └── 3. Command: "refund-payment" ──► [ Payment Service Worker ]

```

---

### Folder Structure

```text
saga-orchestrator/
├── src/
│   ├── config/
│   │   └── redis.ts
│   ├── types/
│   │   └── saga.types.ts
│   ├── workers/
│   │   ├── payment.worker.ts
│   │   └── inventory.worker.ts
│   ├── orchestrator/
│   │   └── orderSaga.orchestrator.ts
│   └── app.ts
├── package.json
└── tsconfig.json

```

---

### Step 1: Types & Saga State Definitions (`src/types/saga.types.ts`)

```typescript
export interface OrderSagaPayload {
  sagaId: string;
  orderId: string;
  userId: string;
  amount: number;
  items: Array<{ id: string; qty: number }>;
}

export type SagaStatus = 
  | 'PENDING'
  | 'PAYMENT_COMPLETED'
  | 'INVENTORY_COMPLETED'
  | 'COMPLETED'
  | 'ROLLING_BACK'
  | 'ROLLED_BACK'
  | 'FAILED';

export interface SagaState extends OrderSagaPayload {
  status: SagaStatus;
  paymentId?: string;
  failureReason?: string;
}

```

---

### Step 2: Shared Redis Configuration (`src/config/redis.ts`)

```typescript
import { ConnectionOptions } from 'bullmq';

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

```

---

### Step 3: Microservice Command Workers & Compensating Actions

These workers simulate isolated microservices. They listen for forward commands (Execute) and rollback commands (Compensate).

#### A. Payment Worker (`src/workers/payment.worker.ts`)

```typescript
import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const PAYMENT_QUEUE = 'payment-commands';
export const SAGA_RESPONSE_QUEUE = 'saga-responses';

const responseQueue = new Queue(SAGA_RESPONSE_QUEUE, { connection: redisConnection });

export const paymentWorker = new Worker(
  PAYMENT_QUEUE,
  async (job) => {
    const { command, payload } = job.data;

    if (command === 'PROCESS_PAYMENT') {
      console.log(`💳 [Payment Service] Processing $${payload.amount} for Order ${payload.orderId}...`);
      
      // Simulate successful payment processing
      const paymentId = `pay_${Date.now()}`;
      
      await responseQueue.add('payment-result', {
        sagaId: payload.sagaId,
        step: 'PAYMENT',
        success: true,
        paymentId,
      });
    } 
    else if (command === 'REFUND_PAYMENT') {
      // COMPENSATING TRANSACTION
      console.log(`🔄 [Payment Service] COMPENSATING ACTION: Refunding Payment ${payload.paymentId}...`);
      
      await responseQueue.add('payment-result', {
        sagaId: payload.sagaId,
        step: 'REFUND',
        success: true,
      });
    }
  },
  { connection: redisConnection }
);

```

#### B. Inventory Worker (`src/workers/inventory.worker.ts`)

```typescript
import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { SAGA_RESPONSE_QUEUE } from './payment.worker';

export const INVENTORY_QUEUE = 'inventory-commands';

const responseQueue = new Queue(SAGA_RESPONSE_QUEUE, { connection: redisConnection });

export const inventoryWorker = new Worker(
  INVENTORY_QUEUE,
  async (job) => {
    const { command, payload } = job.data;

    if (command === 'RESERVE_STOCK') {
      console.log(`📦 [Inventory Service] Reserving stock for Order ${payload.orderId}...`);

      // SIMULATED FAILURE: Trigger out of stock scenario
      const isStockAvailable = false; 

      if (isStockAvailable) {
        await responseQueue.add('inventory-result', {
          sagaId: payload.sagaId,
          step: 'INVENTORY',
          success: true,
        });
      } else {
        console.error(`❌ [Inventory Service] OUT OF STOCK for Order ${payload.orderId}!`);
        await responseQueue.add('inventory-result', {
          sagaId: payload.sagaId,
          step: 'INVENTORY',
          success: false,
          reason: 'Item "Laptop" is out of stock',
        });
      }
    }
    else if (command === 'RELEASE_STOCK') {
      // COMPENSATING TRANSACTION
      console.log(`🔄 [Inventory Service] COMPENSATING ACTION: Releasing stock for Order ${payload.orderId}...`);
      
      await responseQueue.add('inventory-result', {
        sagaId: payload.sagaId,
        step: 'RELEASE_STOCK',
        success: true,
      });
    }
  },
  { connection: redisConnection }
);

```

---

### Step 4: The Saga Orchestrator Engine (`src/orchestrator/orderSaga.orchestrator.ts`)

The Orchestrator maintains state in Redis and coordinates step execution and compensating rollbacks.

```typescript
import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { OrderSagaPayload, SagaState } from '../types/saga.types';
import { PAYMENT_QUEUE, SAGA_RESPONSE_QUEUE } from '../workers/payment.worker';
import { INVENTORY_QUEUE } from '../workers/inventory.worker';
import { createClient } from 'redis';

const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

const paymentQueue = new Queue(PAYMENT_QUEUE, { connection: redisConnection });
const inventoryQueue = new Queue(INVENTORY_QUEUE, { connection: redisConnection });

export class OrderSagaOrchestrator {
  
  // 1. Initiate Saga
  static async startSaga(payload: OrderSagaPayload) {
    const sagaState: SagaState = {
      ...payload,
      status: 'PENDING',
    };

    // Store Saga state in Redis
    await redisClient.set(`saga:${payload.sagaId}`, JSON.stringify(sagaState));

    console.log(`🚀 [Orchestrator] Saga Started [${payload.sagaId}]. Step 1: Process Payment`);
    
    // Dispatch Command 1: Payment Service
    await paymentQueue.add('execute-payment', {
      command: 'PROCESS_PAYMENT',
      payload,
    });
  }

  // 2. State Machine Transitions & Compensation Trigger
  static async handleResponse(response: any) {
    const { sagaId, step, success, paymentId, reason } = response;
    
    const rawState = await redisClient.get(`saga:${sagaId}`);
    if (!rawState) return;
    
    let state: SagaState = JSON.parse(rawState);

    // --- STEP 1 RESPONSE: PAYMENT ---
    if (step === 'PAYMENT') {
      if (success) {
        state.status = 'PAYMENT_COMPLETED';
        state.paymentId = paymentId;
        await redisClient.set(`saga:${sagaId}`, JSON.stringify(state));

        console.log(`✅ [Orchestrator] Payment Successful. Step 2: Reserve Stock`);
        
        // Dispatch Command 2: Inventory Service
        await inventoryQueue.add('execute-inventory', {
          command: 'RESERVE_STOCK',
          payload: state,
        });
      } else {
        await this.abortSaga(state, 'Payment Failed');
      }
    }

    // --- STEP 2 RESPONSE: INVENTORY ---
    else if (step === 'INVENTORY') {
      if (success) {
        state.status = 'COMPLETED';
        await redisClient.set(`saga:${sagaId}`, JSON.stringify(state));
        console.log(`🎉 [Orchestrator] Saga Completed Successfully for Order ${state.orderId}!`);
      } else {
        // STEP 2 FAILED: START COMPENSATING ROLLBACK!
        console.warn(`⚠️ [Orchestrator] Inventory Failed (${reason}). INITIATING COMPENSATING ROLLBACK...`);
        await this.rollbackSaga(state, reason);
      }
    }

    // --- COMPENSATING STEP RESPONSE: REFUND ---
    else if (step === 'REFUND') {
      state.status = 'ROLLED_BACK';
      await redisClient.set(`saga:${sagaId}`, JSON.stringify(state));
      console.log(`🛡️ [Orchestrator] Rollback Complete. Order ${state.orderId} is safely cancelled and refunded.`);
    }
  }

  // 3. Compensating Rollback Coordinator
  private static async rollbackSaga(state: SagaState, reason: string) {
    state.status = 'ROLLING_BACK';
    state.failureReason = reason;
    await redisClient.set(`saga:${state.sagaId}`, JSON.stringify(state));

    // Rollback Step 1: Refund Payment if payment was already processed
    if (state.paymentId) {
      console.log(`🔄 [Orchestrator] Triggering Compensation: Refund Payment ${state.paymentId}`);
      await paymentQueue.add('compensate-payment', {
        command: 'REFUND_PAYMENT',
        payload: state,
      });
    }
  }

  private static async abortSaga(state: SagaState, reason: string) {
    state.status = 'FAILED';
    state.failureReason = reason;
    await redisClient.set(`saga:${state.sagaId}`, JSON.stringify(state));
  }
}

// Worker listening to responses from local transaction services
export const sagaResponseWorker = new Worker(
  SAGA_RESPONSE_QUEUE,
  async (job) => {
    await OrderSagaOrchestrator.handleResponse(job.data);
  },
  { connection: redisConnection }
);

```

---

### Step 5: Express API Gateway Integration (`src/app.ts`)

```typescript
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OrderSagaOrchestrator } from './orchestrator/orderSaga.orchestrator';

// Import workers to run in background
import './workers/payment.worker';
import './workers/inventory.worker';

const app = express();
app.use(express.json());

app.post('/api/v1/orders', async (req: Request, res: Response) => {
  const { userId, amount, items } = req.body;

  const sagaId = `saga_${uuidv4()}`;
  const orderId = `ord_${uuidv4()}`;

  const payload = {
    sagaId,
    orderId,
    userId: userId || 'usr_100',
    amount: amount || 1200,
    items: items || [{ id: 'item_laptop', qty: 1 }],
  };

  // Asynchronously trigger the Saga Orchestrator
  await OrderSagaOrchestrator.startSaga(payload);

  return res.status(202).json({
    message: 'Order processing initialized via Saga Orchestrator',
    sagaId,
    orderId,
    statusUrl: `/api/v1/orders/saga-status/${sagaId}`,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Saga Gateway running on http://localhost:${PORT}`);
});

```

---

### Console Execution Output

When you dispatch a POST request to `/api/v1/orders` where inventory is out of stock, the console shows the step-by-step transaction execution and automatic compensating rollback:

```text
🚀 [Orchestrator] Saga Started [saga_abc123]. Step 1: Process Payment
💳 [Payment Service] Processing $1200 for Order ord_xyz789...
✅ [Orchestrator] Payment Successful. Step 2: Reserve Stock
📦 [Inventory Service] Reserving stock for Order ord_xyz789...
❌ [Inventory Service] OUT OF STOCK for Order ord_xyz789!
⚠️ [Orchestrator] Inventory Failed (Item "Laptop" is out of stock). INITIATING COMPENSATING ROLLBACK...
🔄 [Orchestrator] Triggering Compensation: Refund Payment pay_172283000
🔄 [Payment Service] COMPENSATING ACTION: Refunding Payment pay_172283000...
🛡️ [Orchestrator] Rollback Complete. Order ord_xyz789 is safely cancelled and refunded.

```

---

### Key Architectural Safeguards

1. **Idempotency:** Compensating transactions (e.g., `REFUND_PAYMENT`) must be idempotent so they can be re-executed safely if network timeouts occur during a rollback.
2. **Persistent State Storage:** Saga state is saved in Redis at every step so that if the Orchestrator node crashes mid-Saga, it can resume or trigger rollbacks upon restart.
3. **Isolation Handling:** Sagas lack ACID isolation. If necessary, use **Semantic Locks** (e.g., setting the order status to `PENDING_APPROVAL`) so other users cannot interact with uncommitted resources mid-transaction.
