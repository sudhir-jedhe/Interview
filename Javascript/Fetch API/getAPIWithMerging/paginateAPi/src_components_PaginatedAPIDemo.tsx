import React, { useState } from 'react';
import { fetchList } from '../services/api';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FetchApproach = 'recursive' | 'asyncAwait' | 'asyncIterator' | 'generator';

const PaginatedAPIDemo: React.FC = () => {
  const [approach, setApproach] = useState<FetchApproach>('recursive');
  const [amount, setAmount] = useState<number>(20);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [logEnabled, setLogEnabled] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');

  const fetchListWithAmount = async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      let items: { id: number; name: string }[] = [];

      switch (approach) {
        case 'recursive':
          items = await fetchRecursive(amount);
          break;
        case 'asyncAwait':
          items = await fetchAsyncAwait(amount);
          break;
        case 'asyncIterator':
          items = await fetchAsyncIterator(amount);
          break;
        case 'generator':
          items = await fetchGenerator(amount);
          break;
      }

      setResult(JSON.stringify(items, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Recursive approach
  const fetchRecursive = async (amount: number): Promise<{ id: number; name: string }[]> => {
    const result: { id: number; name: string }[] = [];
    const makeFetch = async (lastId?: number): Promise<{ id: number; name: string }[]> => {
      const { items } = await fetchList(lastId, pageSize);
      result.push(...items);
      if (result.length >= amount || items.length === 0) {
        return result.slice(0, amount);
      }
      return makeFetch(result[result.length - 1].id);
    };
    return makeFetch();
  };

  // Async/Await approach
  const fetchAsyncAwait = async (amount: number): Promise<{ id: number; name: string }[]> => {
    const result: { id: number; name: string }[] = [];
    while (result.length < amount) {
      const lastItem = result[result.length - 1];
      const { items } = await fetchList(lastItem?.id, pageSize);
      result.push(...items);
      if (items.length === 0) break;
    }
    return result.slice(0, amount);
  };

  // Async Iterator approach
  const fetchAsyncIterator = async (amount: number): Promise<{ id: number; name: string }[]> => {
    const result: { id: number; name: string }[] = [];
    const iterator = {
      lastItemId: undefined as number | undefined,
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        const { items } = await fetchList(this.lastItemId, pageSize);
        if (items.length === 0) {
          return { done: true };
        }
        this.lastItemId = items[items.length - 1].id;
        return { done: false, value: items };
      }
    };

    for await (const items of iterator) {
      result.push(...items);
      if (result.length >= amount) break;
    }
    return result.slice(0, amount);
  };

  // Generator approach
  const fetchGenerator = async (amount: number): Promise<{ id: number; name: string }[]> => {
    const result: { id: number; name: string }[] = [];
    const generator = async function* () {
      let lastItemId: number | undefined;
      while (true) {
        const { items } = await fetchList(lastItemId, pageSize);
        if (items.length === 0) return;
        lastItemId = items[items.length - 1].id;
        yield items;
      }
    };

    for await (const items of generator()) {
      result.push(...items);
      if (result.length >= amount) break;
    }
    return result.slice(0, amount);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Paginated API Demo</CardTitle>
        <CardDescription>Compare different approaches to handle paginated API responses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Options</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="space-y-4">
              <div>
                <Label htmlFor="approach">Fetch Approach</Label>
                <Select onValueChange={(value) => setApproach(value as FetchApproach)} value={approach}>
                  <SelectTrigger id="approach">
                    <SelectValue placeholder="Select approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recursive">Recursive Function</SelectItem>
                    <SelectItem value="asyncAwait">Async/Await Loop</SelectItem>
                    <SelectItem value="asyncIterator">Async Iterator</SelectItem>
                    <SelectItem value="generator">Generator Function</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Number of Items</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="log-enabled"
                  checked={logEnabled}
                  onCheckedChange={setLogEnabled}
                />
                <Label htmlFor="log-enabled">Enable Logging</Label>
              </div>
              <div>
                <Label htmlFor="page-size">Page Size</Label>
                <Slider
                  id="page-size"
                  min={5}
                  max={50}
                  step={5}
                  value={[pageSize]}
                  onValueChange={(value) => setPageSize(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => fetchListWithAmount(amount)} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Items'}
        </Button>
      </CardFooter>
      {loading && (
        <CardContent>
          <Progress value={33} className="w-full" />
        </CardContent>
      )}
      {error && (
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      )}
      {result && (
        <CardContent>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
              {result}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PaginatedAPIDemo;

