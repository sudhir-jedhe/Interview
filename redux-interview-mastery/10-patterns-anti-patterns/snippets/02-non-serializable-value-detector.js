// Runnable with plain Node: `node 02-non-serializable-value-detector.js`
// A tiny, dependency-free approximation of what RTK's serializableCheck middleware looks for.

function findNonSerializablePaths(value, path = '') {
  const problems = [];

  if (value === null || typeof value === 'undefined') return problems;

  if (typeof value === 'function') {
    problems.push(`${path || '(root)'}: function`);
    return problems;
  }
  if (typeof value === 'symbol') {
    problems.push(`${path || '(root)'}: symbol`);
    return problems;
  }
  if (value instanceof Promise) {
    problems.push(`${path || '(root)'}: Promise`);
    return problems;
  }
  if (value instanceof Date) {
    problems.push(`${path || '(root)'}: Date (use epoch ms / ISO string instead)`);
    return problems;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => problems.push(...findNonSerializablePaths(item, `${path}[${i}]`)));
    return problems;
  }
  if (typeof value === 'object' && value.constructor !== Object) {
    problems.push(`${path || '(root)'}: class instance (${value.constructor.name})`);
    return problems;
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      problems.push(...findNonSerializablePaths(value[key], path ? `${path}.${key}` : key));
    }
  }
  return problems;
}

const suspiciousState = {
  user: { id: 1, createdAt: new Date(), greet: () => 'hi' },
  request: fetch ? undefined : undefined, // (illustrative; not actually calling fetch here)
  pendingUpload: new Promise(() => {}),
};

console.log(findNonSerializablePaths(suspiciousState));
// => [ 'user.createdAt: Date (...)', 'user.greet: function', 'pendingUpload: Promise' ]
