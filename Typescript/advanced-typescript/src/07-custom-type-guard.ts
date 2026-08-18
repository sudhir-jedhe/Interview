type User = {
  id: number;
  name: string;
};
// common - JSON, req body, local stroage or api response
const inputData: unknown = {
  id: 1,
  name: "sangam",
};

function isUser(val: unknown): val is User {
  // once the check will pass

  if (typeof val !== "object" || val === null) {
    return false;
  }

  const possibleUser = val as Record<string, unknown>;

  return (
    typeof possibleUser.id === "number" && typeof possibleUser.name === "string"
  );
}

if (isUser(inputData)) {
  console.log(inputData.id, inputData.name);
}
