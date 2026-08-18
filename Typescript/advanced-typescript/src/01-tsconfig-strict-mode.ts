// strict - main switch for serious type checking
// noImplicitAny - ts will not silently create any type for us

function createUser(name: string) {
  return {
    name,
    createdAt: new Date(),
  };
}

const userOne = createUser("sangam");
console.log(userOne.name);

// strictNullChecks

type User = {
  id: number;
  name: string;
};

function findUserById(id: number): User | undefined {
  const users: User[] = [
    {
      id: 1,
      name: "sangam",
    },
  ];

  return users.find((item) => item.id === id);
}

const foundUser = findUserById(1);

// console.log(foundUser?.name);

if (foundUser) {
  console.log(foundUser.name);
}

const port = process.env.PORT;
const finalport = port ?? "3000";

console.log(finalport.toUpperCase());
