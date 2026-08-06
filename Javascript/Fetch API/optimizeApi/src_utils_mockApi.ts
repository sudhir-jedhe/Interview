// Simulating a delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const generateMockData = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is the description for item ${i + 1}`
  }));

const TOTAL_ITEMS = 100;
const mockData = generateMockData(TOTAL_ITEMS);

export const fetchItems = async (page: number, limit: number) => {
  await delay(500); // Simulate network delay
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    items: mockData.slice(start, end),
    totalPages: Math.ceil(TOTAL_ITEMS / limit)
  };
};

