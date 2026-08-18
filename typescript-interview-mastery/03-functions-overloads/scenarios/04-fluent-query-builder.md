# Scenario: A fluent query builder method that accepts flexible argument shapes

You're designing a small query builder's `.where()` method. Callers should be able to call it two ways: `where("status", "shipped")` (field + exact value) or `where("createdAt", ">", someDate)` (field + operator + value) for comparison operators. You want both call shapes to be fully type-checked, with the operator restricted to a known literal set and the value's type left flexible enough for different field types.

**Approach:** Use overloads to describe the two distinct call shapes explicitly, rather than trying to cram both into one signature with awkward optional parameters that would allow invalid combinations like `where("status", ">", "shipped")`.

```typescript
type ComparisonOperator = ">" | "<" | ">=" | "<=";

interface QueryBuilder {
  where(field: string, value: string | number | boolean): QueryBuilder;
  where(field: string, operator: ComparisonOperator, value: string | number | Date): QueryBuilder;
}

class SimpleQueryBuilder implements QueryBuilder {
  private clauses: string[] = [];

  where(field: string, valueOrOperator: unknown, value?: unknown): QueryBuilder {
    if (value === undefined) {
      this.clauses.push(`${field} = ${JSON.stringify(valueOrOperator)}`);
    } else {
      this.clauses.push(`${field} ${valueOrOperator} ${JSON.stringify(value)}`);
    }
    return this;
  }

  build(): string {
    return this.clauses.join(" AND ");
  }
}

const query = new SimpleQueryBuilder()
  .where("status", "shipped")
  .where("createdAt", ">", new Date("2026-01-01"))
  .build();

console.log(query); // status = "shipped" AND createdAt > "2026-01-14T..."

// new SimpleQueryBuilder().where("status", ">", "shipped");
// Error: no overload accepts (string, ">", string) as (field, value) OR matches the 2-arg overload
```

Because the implementation signature (`where(field, valueOrOperator, value?)`) isn't itself callable by consumers, only the two declared overloads define what's valid — `where("status", "shipped")` matches the 2-argument overload, and `where("createdAt", ">", someDate)` matches the 3-argument operator overload, but a mixed/invalid combination like `where("status", ">", "shipped")` (a comparison operator paired with what looks like an exact-match call) is rejected, because it doesn't match either overload's exact shape. Overloads here express "these two call shapes are the only legitimate ones" more precisely and more safely than a single signature with `value?: string | ComparisonOperator, secondValue?: unknown` ever could.
