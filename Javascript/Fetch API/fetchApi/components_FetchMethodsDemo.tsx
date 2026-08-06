import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const FetchMethodsDemo: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [id, setId] = useState<string>('1');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  const handleRequest = async () => {
    try {
      let url = method === 'POST' ? baseUrl : `${baseUrl}/${id}`;
      let options: RequestInit = {
        method,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      };

      if (method !== 'GET' && method !== 'DELETE') {
        options.body = JSON.stringify({ title, body, userId: 1 });
      }

      const response = await fetch(url, options);
      setStatusCode(response.status);

      if (method === 'DELETE') {
        setResult(`Resource deleted successfully.`);
      } else {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setStatusCode(500);
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fetch API Methods Demo</CardTitle>
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
              <Label htmlFor="id">Resource ID</Label>
              <Input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter resource ID"
              />
            </div>
          )}
          
          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter body"
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRequest}>Send Request</Button>
      </CardFooter>
      {statusCode && (
        <CardContent>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Status Code: {statusCode}</h3>
            <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto max-h-60">
              {result}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FetchMethodsDemo;

