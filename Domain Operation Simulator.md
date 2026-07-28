# Domain Operation Simulator (Mini DNS System)

A **Domain Operation Simulator** is a frequently discussed JavaScript machine-coding problem that simulates how a DNS system stores, updates, and resolves domain-to-IP mappings. Public interview-prep references describe it as a "Mini DNS System" involving storing, updating, and querying domain/IP relationships. [\[youtube.com\]](https://www.youtube.com/watch?v=MB48etDKQmY), [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-12-domain-operation-simulator-flipkart-activity-7372175146679271424-g2xJ)

---

# Requirements

Support operations like:

```js
ADD google.com 142.250.183.14

ADD github.com 140.82.121.3

LOOKUP google.com

UPDATE github.com 140.82.121.4

DELETE google.com

LIST
```

Output:

```text
google.com -> 142.250.183.14

github.com -> 140.82.121.4
```

---

# Solution Using Map

## DomainSimulator.ts

```ts
class DomainSimulator {
  private domainMap: Map<string, string>;

  constructor() {
    this.domainMap = new Map();
  }

  addDomain(domain: string, ip: string): void {
    if (this.domainMap.has(domain)) {
      throw new Error(`${domain} already exists`);
    }

    this.domainMap.set(domain, ip);
  }

  updateDomain(domain: string, newIp: string): void {
    if (!this.domainMap.has(domain)) {
      throw new Error(`${domain} does not exist`);
    }

    this.domainMap.set(domain, newIp);
  }

  lookup(domain: string): string | undefined {
    return this.domainMap.get(domain);
  }

  deleteDomain(domain: string): boolean {
    return this.domainMap.delete(domain);
  }

  listDomains() {
    return Array.from(this.domainMap.entries()).map(([domain, ip]) => ({
      domain,
      ip,
    }));
  }
}
```

---

# Usage

```ts
const dns = new DomainSimulator();

dns.addDomain("google.com", "142.250.183.14");

dns.addDomain("github.com", "140.82.121.3");

console.log(dns.lookup("google.com"));

dns.updateDomain("github.com", "140.82.121.4");

console.log(dns.listDomains());

dns.deleteDomain("google.com");

console.log(dns.listDomains());
```

Output

```text
142.250.183.14

[
  {
    domain: "github.com",
    ip: "140.82.121.4"
  }
]
```

---

# Advanced Version: Reverse Lookup

Support:

```text
IP -> Domain
```

Example:

```js
REVERSE_LOOKUP 140.82.121.4
```

Output:

```text
github.com
```

---

## Dual Map Design

```ts
class DomainSimulator {
  private domainToIp = new Map<string, string>();

  private ipToDomain = new Map<string, string>();

  add(domain: string, ip: string) {
    this.domainToIp.set(domain, ip);

    this.ipToDomain.set(ip, domain);
  }

  resolve(domain: string) {
    return this.domainToIp.get(domain);
  }

  reverseResolve(ip: string) {
    return this.ipToDomain.get(ip);
  }
}
```

---

# Support Wildcard Domains

```text
*.example.com
```

Example:

```js
dns.addWildcard("*.company.com", "10.0.0.1");
```

Requests:

```text
api.company.com
app.company.com
test.company.com
```

All resolve to:

```text
10.0.0.1
```

---

# React Machine Coding Version

UI:

```text
+----------------------+
| Domain              |
| google.com          |
+----------------------+

+----------------------+
| IP                  |
| 142.250.183.14      |
+----------------------+

[ Add Domain ]

------------------------

google.com
142.250.183.14

github.com
140.82.121.3
```

---

## React Component

```tsx
const [domain, setDomain] = useState("");

const [ip, setIp] = useState("");

const [records, setRecords] = useState([]);
```

Add:

```tsx
const addDomain = () => {
  setRecords((prev) => [
    ...prev,
    {
      domain,
      ip,
    },
  ]);
};
```

Render:

```tsx
{
  records.map((record) => (
    <div key={record.domain}>
      {record.domain}
      {" -> "}
      {record.ip}
    </div>
  ));
}
```

---

# Trie-Based DNS Resolver (Senior Level)

Real DNS systems don't use a simple Map.

They use structures optimised for:

```text
google.com
mail.google.com
api.google.com
```

A Trie can store domains hierarchically.

```text
com
 └── google
       ├── mail
       └── api
```

Benefits:

✅ Prefix lookup

✅ Wildcards

✅ Zone management

✅ Better scalability

---

# Complexity

### Map-Based

| Operation | Complexity |
| --------- | ---------- |
| Add       | O(1)       |
| Update    | O(1)       |
| Lookup    | O(1)       |
| Delete    | O(1)       |
| List      | O(n)       |

---

# Senior Interview Discussion

Explain:

> I would use a `Map` for constant-time domain resolution. For reverse lookup, I'd maintain a second map from IP to domain. If wildcard support or large-scale DNS behaviour is required, I'd move to a Trie-based design that stores domains hierarchically and supports efficient prefix and suffix matching. This allows the simulator to behave more like a real DNS management system. [\[youtube.com\]](https://www.youtube.com/watch?v=MB48etDKQmY), [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-12-domain-operation-simulator-flipkart-activity-7372175146679271424-g2xJ)

### Follow-up Features Often Asked

- DNS cache with TTL
- Wildcard domains (`*.company.com`)
- Reverse DNS lookup
- Domain expiry management
- Bulk import/export
- Trie-based resolver
- React UI for domain operations
- LRU cache for frequent lookups
