import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const PageReloadDemo: React.FC = () => {
  const standardReload = () => {
    window.location.reload();
  };

  const legacyForceReload = () => {
    // @ts-ignore
    window.location.reload(true);
  };

  const reloadWithoutPost = () => {
    window.location.href = window.location.href;
  };

  const reloadRemovingHash = () => {
    window.location.href = window.location.href.split('#')[0];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page Reload Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Standard Page Reload</CardTitle>
            <CardDescription>Mimics the browser's reload button</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use when you want a straightforward refresh of the current page.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={standardReload}>Standard Reload</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Force Reload (Legacy)</CardTitle>
            <CardDescription>Attempts to bypass cache (deprecated)</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This method is deprecated and not widely supported in modern browsers.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={legacyForceReload}>Force Reload (Legacy)</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reload Without POST Data</CardTitle>
            <CardDescription>Clears any POST data by treating the reload as a new GET request</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use when you want to ensure no sensitive data from forms is resubmitted accidentally.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={reloadWithoutPost}>Reload Without POST</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reload Removing Hash</CardTitle>
            <CardDescription>Strips the hash fragment from the URL and reloads the page</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use this when hash-based navigation or anchors are causing issues with reloading.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={reloadRemovingHash}>Reload Removing Hash</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PageReloadDemo;

