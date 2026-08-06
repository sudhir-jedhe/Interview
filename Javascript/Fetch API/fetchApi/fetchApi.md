The provided examples illustrate how to perform HTTP requests in JavaScript using both the modern `Fetch API` and the older `XMLHttpRequest`. Here is a consolidated explanation and usage for each method.

---

### **Using Fetch API**

#### 1. **HTTP GET Request**
Fetch data from a URL.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

#### 2. **HTTP POST Request**
Send data to a server.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

#### 3. **HTTP PUT Request**
Update existing data.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PUT',
  body: JSON.stringify({
    id: 1,
    title: 'foo',
    body: 'bar',
    userId: 1
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

#### 4. **HTTP DELETE Request**
Delete data from the server.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'DELETE'
})
  .then(response => console.log('Deleted:', response))
  .catch(error => console.error('Error:', error));
```

---

### **Using XMLHttpRequest**

#### 1. **HTTP GET Request**
Fetch data from a URL.

```javascript
const httpGet = (url, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
};

httpGet('https://jsonplaceholder.typicode.com/posts/1', console.log);
```

---

#### 2. **HTTP POST Request**
Send data to a server.

```javascript
const httpPost = (url, data, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
};

httpPost(
  'https://jsonplaceholder.typicode.com/posts',
  JSON.stringify({ userId: 1, title: 'foo', body: 'bar' }),
  console.log
);
```

---

#### 3. **HTTP PUT Request**
Update existing data.

```javascript
const httpPut = (url, data, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('PUT', url, true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
};

httpPut(
  'https://jsonplaceholder.typicode.com/posts/1',
  JSON.stringify({ id: 1, title: 'foo', body: 'bar', userId: 1 }),
  console.log
);
```

---

#### 4. **HTTP DELETE Request**
Delete data from the server.

```javascript
const httpDelete = (url, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('DELETE', url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
};

httpDelete('https://jsonplaceholder.typicode.com/posts/1', console.log);
```

---

### **Comparison**

| Feature                  | Fetch API                     | XMLHttpRequest              |
|--------------------------|-------------------------------|-----------------------------|
| **Modern Approach**      | Yes                           | No                          |
| **Promise-based**        | Yes                           | No                          |
| **Stream Support**       | Yes                           | No                          |
| **Browser Support**      | Modern browsers               | All browsers                |

### **Recommendation**
- Use **Fetch API** for modern applications for cleaner and more maintainable code.
- Use **XMLHttpRequest** only for older projects or when browser compatibility is a concern.