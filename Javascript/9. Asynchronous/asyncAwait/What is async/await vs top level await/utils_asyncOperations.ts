export async function fetchData(delay: number = 1000): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  return "Data fetched successfully";
}

export async function processData(data: string, delay: number = 500): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  return `Processed: ${data}`;
}

export async function saveData(data: string, delay: number = 800): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  return `Saved: ${data}`;
}

