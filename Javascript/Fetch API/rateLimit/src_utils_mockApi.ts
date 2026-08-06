const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const makeApiCall = (id: number) => {
  return async () => {
    await delay(500); // Simulate network delay
    if (Math.random() < 0.1) { // 10% chance of failure
      throw new Error(`Request failed for ID: ${id}`);
    }
    return { id, data: `Data for ID ${id}` };
  };
};

