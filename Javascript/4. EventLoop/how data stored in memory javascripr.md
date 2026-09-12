JavaScript engines (such as Google Chrome's V8, Firefox's SpiderMonkey, and Safari's JavaScriptCore) allocate memory into two primary memory regions: the **Call Stack** and the **Memory Heap**.

---

### The Two Core Memory Regions

| Dimension            | Call Stack                                                                     | Memory Heap                                                    |
| -------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| **Data Stored**      | Execution contexts, primitive variables, references (pointers) to heap objects | Objects, arrays, functions, closures, large strings            |
| **Structure**        | LIFO (Last In, First Out), strict, ordered                                     | Unstructured, dynamic pool                                     |
| **Allocation Speed** | Extremely fast (pointer bump)                                                  | Slower (requires searching free space)                         |
| **Size Limit**       | Fixed and small (exceeding causes `StackOverflow`)                             | Large (scales with available RAM)                              |
| **Cleanup**          | Instantaneous as function frames pop off the stack                             | Managed asynchronously by the Garbage Collector (Mark & Sweep) |

---

### 1. The Call Stack (Fast, Static Memory)

The stack keeps track of current program execution and stores:

* **Execution frames:** Every time a function is called, a frame is pushed onto the stack containing local identifiers.
* **Direct values of primitives:** Numbers, booleans, `null`, `undefined`, `Symbol`, and `BigInt`.
* **Pointers / References:** 32-bit or 64-bit addresses pointing to chunks of memory allocated on the heap.

```javascript
function calculate() {
  let count = 42;         // Allocated directly in the stack frame
  let isActive = true;    // Allocated directly in the stack frame
}
calculate();
// When calculate() finishes, its stack frame is popped; count and isActive vanish instantly.

```

---

### 2. The Memory Heap (Dynamic, Unstructured Storage)

The heap is a large, unorganized pool of memory designed for data whose size cannot be known at compile time or whose lifecycle extends beyond the current function frame:

* **Objects, Arrays, and Maps**
* **Functions & Class Instances**
* **Closures:** Variables captured inside nested functions are moved to heap-allocated context records so they survive after their parent function returns.

```javascript
function createFleet() {
  let vehicle = { vin: 'EC2832', soc: 94 }; // Object allocated on Heap
  return vehicle;
}

const bike = createFleet();
// The stack frame for createFleet() is popped.
// However, the object { vin: 'EC2832', soc: 94 } stays alive on the HEAP.
// The variable 'bike' on the global stack now holds the reference address to that heap object.

```

---

### Visualizing Value vs. Reference in Memory

Consider this snippet:

```javascript
let age = 37;
let name = 'Sudhir';
let vehicle = { vin: 'EC2832', status: 'ACTIVE' };
let fleet = vehicle; // Copies pointer address, NOT the object

```

**Memory Representation:**

```text
       CALL STACK                             MEMORY HEAP
┌───────────────────────┐              ┌───────────────────────────────┐
│ age     | 37          │              │                               │
│ name    | "Sudhir"    │              │ 0x7A1F:                       │
│ vehicle | 0x7A1F ───────────────►    │   {                           │
│ fleet   | 0x7A1F ───────────────►    │     vin: "EC2832",            │
└───────────────────────┘              │     status: "ACTIVE"          │
                                       │   }                           │
                                       └───────────────────────────────┘

```

* Changing `fleet.status = 'CHARGING'` modifies the heap memory block at `0x7A1F`. Both `vehicle` and `fleet` reflect the update.
* In contrast, primitives are copied by value: changing `age` has no side effects on any copy.

---

### Real-Engine Nuances (V8 Internals)

While traditional theory states "all primitives go to the stack and all objects go to the heap," modern engines (like V8) optimize this heavily:

1. **V8 Tagged Pointers (Smi):**

* Small integers ($-2^{31}$ to $2^{31}-1$, called **Smi**) are encoded directly inside 64-bit pointer words using the lowest bit (tag bit = `0`), bypassing heap allocation altogether.

1. **String Deduplication & Interning:**

* Short strings or object keys (e.g., `'id'`, `'name'`) are interned in a shared internal string table in heap memory to save RAM and speed up property lookups.

1. **Hidden Classes (Shapes):**

* V8 generates internal structural classes ("Shapes" or "Maps") in the heap to track the layout and offset indices of object properties, allowing fast field access without dictionary hashes.

---

### How Memory is Cleared: Garbage Collection (GC)

Data in the stack is deleted as soon as functions exit. Data on the heap is cleaned by the engine's **Garbage Collector** via **Reachability (Mark-and-Sweep)**:

1. **Roots:** The GC starts from "root" objects (e.g., the global `window` object, current local stack variables, active timers).
2. **Mark Phase:** It traverses all references outward from roots and marks all visited heap blocks as "alive/reachable."
3. **Sweep Phase:** Unreachable heap allocations (objects no longer referenced by any active pointer) are reclaimed.

```javascript
let fleetData = { id: 101, route: [1.24, 6.22] };
fleetData = null; 
// The object at the old heap address is now unreachable from any stack root.
// During the next GC cycle, it will be swept and freed.

```
