interface Item {
  id: string;
  name: string;
  nextCursor: string;
}

interface APIResponse {
  items: Item[];
  nextCursor: string | null;
}

// Simulated API call
const fetchList = async (cursor?: string): Promise<APIResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate paginated data
  const allItems: Item[] = Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
    nextCursor: `cursor-${i + 2}`
  }));

  const startIndex = cursor ? parseInt(cursor.split('-')[1]) - 1 : 0;
  const items = allItems.slice(startIndex, startIndex + 10);
  const nextCursor = startIndex + 10 < allItems.length ? `cursor-${startIndex + 11}` : null;

  return { items, nextCursor };
};

export const fetchListBasedOnPreviousResponse = async (initialCursor?: string): Promise<APIResponse> => {
  let currentCursor = initialCursor;
  let allItems: Item[] = [];
  let nextCursor: string | null = null;

  do {
    const response = await fetchList(currentCursor);
    allItems = [...allItems, ...response.items];
    nextCursor = response.nextCursor;
    currentCursor = response.items[response.items.length - 1]?.nextCursor;
  } while (nextCursor && allItems.length < 20); // Fetch at least 20 items or until no more pages

  return { items: allItems, nextCursor };
};

