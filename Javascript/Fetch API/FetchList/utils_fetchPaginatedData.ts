type Item = {
  id: string;
  name: string;
};

type APIResponse = {
  items: Item[];
};

// Simulated API call
const fetchList = async (lastId?: string): Promise<APIResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate paginated data
  const allItems: Item[] = Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`
  }));

  const startIndex = lastId ? allItems.findIndex(item => item.id === lastId) + 1 : 0;
  return {
    items: allItems.slice(startIndex, startIndex + 10)
  };
};

async function* fetchListGenerator() {
  let lastItemId: string | undefined;
  while (true) {
    const { items } = await fetchList(lastItemId);
    if (items.length === 0) return;
    lastItemId = items[items.length - 1].id;
    yield items;
  }
}

export const fetchPaginatedData = async (amount: number = 10): Promise<Item[]> => {
  const result: Item[] = [];
  for await (const items of fetchListGenerator()) {
    result.push(...items);
    if (result.length >= amount) break;
  }
  return result.slice(0, amount);
};

