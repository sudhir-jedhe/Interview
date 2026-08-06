import React from 'react';
import CORSExample from './CORSExample';

const CORSExplainer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Understanding CORS (Cross-Origin Resource Sharing)</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What is CORS?</h2>
        <p className="mb-2">
          CORS is a security mechanism that allows web resources from one origin to request resources from a different origin.
          It relaxes the Same-Origin Policy (SOP) enforced by web browsers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Types of CORS Requests</h2>
        <h3 className="text-xl font-semibold mb-2">1. Simple Requests</h3>
        <p className="mb-2">
          Simple requests don't trigger a preflight. They must use GET, POST, or HEAD methods and only use simple headers.
        </p>
        <CORSExample
          title="Simple Request Example"
          request={`GET /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com`}
          response={`HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com`}
        />

        <h3 className="text-xl font-semibold mb-2">2. Preflight Requests</h3>
        <p className="mb-2">
          Preflight requests are sent before the actual request if it's not a simple request. They use the OPTIONS method.
        </p>
        <CORSExample
          title="Preflight Request Example"
          request={`OPTIONS /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header`}
          response={`HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
Access-Control-Max-Age: 3600`}
        />

        <h3 className="text-xl font-semibold mb-2">3. Actual Requests</h3>
        <p className="mb-2">
          The actual request is sent after the preflight request (if applicable) is successful.
        </p>
        <CORSExample
          title="Actual Request Example"
          request={`POST /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Content-Type: application/json
X-Custom-Header: custom-value`}
          response={`HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-RateLimit-Limit`}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Important CORS Headers</h2>
        <h3 className="text-xl font-semibold mb-2">Request Headers</h3>
        <ul className="list-disc pl-6 mb-2">
          <li><strong>Origin:</strong> Specifies the origin of the request</li>
          <li><strong>Access-Control-Request-Method:</strong> Specifies the HTTP method of the actual request (preflight only)</li>
          <li><strong>Access-Control-Request-Headers:</strong> Specifies the headers in the actual request (preflight only)</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Response Headers</h3>
        <ul className="list-disc pl-6 mb-2">
          <li><strong>Access-Control-Allow-Origin:</strong> Specifies which origins are allowed to access the resource</li>
          <li><strong>Access-Control-Allow-Methods:</strong> Lists the HTTP methods permitted for the resource</li>
          <li><strong>Access-Control-Allow-Headers:</strong> Lists the headers the client is allowed to include in its requests</li>
          <li><strong>Access-Control-Allow-Credentials:</strong> Indicates whether credentials are allowed</li>
          <li><strong>Access-Control-Expose-Headers:</strong> Lists headers exposed to the client</li>
          <li><strong>Access-Control-Max-Age:</strong> Indicates how long the results of a preflight request can be cached</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Implementing CORS in Express.js</h2>
        <p className="mb-2">Here's an example of how to implement CORS in an Express.js application:</p>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`const express = require('express');
const cors = require('cors');
const app = express();

// Basic CORS setup
app.use(cors());

// Custom CORS setup
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
}));

app.get('/api/resource', (req, res) => {
  res.json({ message: 'This is a CORS-enabled resource' });
});

app.listen(3000, () => {
  console.log('CORS-enabled server running on port 3000');
});`}
        </pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Best Practices</h2>
        <ul className="list-disc pl-6">
          <li>Only allow specific origins instead of using a wildcard (*) for better security</li>
          <li>Use the Vary header with Origin to ensure proper caching</li>
          <li>Be cautious when allowing credentials, as it can pose security risks if not handled properly</li>
          <li>Regularly audit and update your CORS policies to maintain security</li>
        </ul>
      </section>
    </div>
  );
};

export default CORSExplainer;

