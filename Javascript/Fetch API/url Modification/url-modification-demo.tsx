import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const URLModificationDemo: React.FC = () => {
  const [currentURL, setCurrentURL] = useState('');
  const [newURL, setNewURL] = useState('');

  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  const updateURLWithHistory = (method: 'push' | 'replace') => {
    if (newURL) {
      try {
        const url = new URL(newURL);
        if (method === 'push') {
          window.history.pushState({ page: url.pathname }, '', url);
        } else {
          window.history.replaceState({ page: url.pathname }, '', url);
        }
        setCurrentURL(window.location.href);
      } catch (error) {
        alert('Invalid URL. Please enter a valid URL.');
      }
    }
  };

  const updateURLWithLocation = (method: 'assign' | 'replace') => {
    if (newURL) {
      if (method === 'assign') {
        window.location.assign(newURL);
      } else {
        window.location.replace(newURL);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Modification Demo</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current URL</CardTitle>
          <CardDescription>This is the current URL of the page</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-mono bg-muted p-2 rounded">{currentURL}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">History API</TabsTrigger>
          <TabsTrigger value="location">Location API</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History API</CardTitle>
              <CardDescription>Modify URL without page reload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="historyUrl">New URL</Label>
                <Input
                  id="historyUrl"
                  placeholder="Enter new URL"
                  value={newURL}
                  onChange={(e) => setNewURL(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => updateURLWithHistory('push')}>Push State</Button>
              <Button onClick={() => updateURLWithHistory('replace')}>Replace State</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location API</CardTitle>
              <CardDescription>Modify URL with page reload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="locationUrl">New URL</Label>
                <Input
                  id="locationUrl"
                  placeholder="Enter new URL"
                  value={newURL}
                  onChange={(e) => setNewURL(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => updateURLWithLocation('assign')}>Assign</Button>
              <Button onClick={() => updateURLWithLocation('replace')}>Replace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default URLModificationDemo;

