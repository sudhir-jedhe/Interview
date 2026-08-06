interface Item {
  id: number;
  name: string;
}

const mockData: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`
}));

export const fetchList = async (lastId?: number, pageSize: number = 10): Promise<{ items: Item[] }> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const startIndex = lastId ? mockData.findIndex(item => item.id === lastId) + 1 : 0;
  return {
    items: mockData.slice(startIndex, startIndex + pageSize)
  };
};

