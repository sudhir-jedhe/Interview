import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Item {
  _id: string;
  title: string;
  description: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const FetchMethodsDemo: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError('Error fetching items');
    }
  };

  const handleRequest = async () => {
    setError(null);
    setResult('');
    setStatusCode(null);

    try {
      let url = `${API_BASE_URL}/items`;
      if (method !== 'POST' && id) {
        url += `/${id}`;
      }

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET' && method !== 'DELETE') {
        options.body = JSON.stringify({ title, description });
      }

      const response = await fetch(url, options);
      setStatusCode(response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      setResult(JSON.stringify(data, null, 2));

      if (method !== 'GET') {
        fetchItems();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fetch API Methods Demo (MERN Stack)</CardTitle>
        <CardDescription>Test different HTTP methods using Fetch API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="method">HTTP Method</Label>
            <Select onValueChange={(value) => setMethod(value as HttpMethod)} value={method}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {method !== 'POST' && (
            <div>
              <Label htmlFor="id">Item ID</Label>
              <Select onValueChange={setId} value={id}>
                <SelectTrigger id="id">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item._id} value={item._id}>{item.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRequest}>Send Request</Button>
      </CardFooter>
      {(statusCode || error) && (
        <CardContent>
          <div className="mt-4 space-y-4">
            {statusCode && (
              <Alert>
                <AlertTitle>Status Code: {statusCode}</AlertTitle>
                <AlertDescription>
                  {statusCode >= 200 && statusCode < 300 ? 'Success' : 'Error'}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FetchMethodsDemo;

