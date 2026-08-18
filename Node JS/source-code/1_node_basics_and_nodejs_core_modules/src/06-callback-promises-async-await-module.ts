type User = {
  id: number;
  name: string;
  role: "user" | "super-admin";
};

const users: User[] = [
  {
    id: 1,
    name: "sangam",
    role: "super-admin",
  },
  {
    id: 2,
    name: "john",
    role: "user",
  },
  {
    id: 3,
    name: "roman",
    role: "user",
  },
];

// callback is a function - this func u r passing to a diff function
// callback(error, result) -> *** imp concept -> classic node js callback pattern

// 100+ -> 25 to 30
function findUserWithCallback(
  userId: number,
  callback: (error: Error | null, user?: User) => void,
): void {
  setTimeout(() => {
    // u r actual api call
    const user = users.find((currentUser) => currentUser.id === userId);

    if (!user) {
      callback(new Error(`user with id ${userId} was not found`));
      return;
    }

    callback(null, user);
  }, 500);
}

function findUserWithPromise(userId: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((currentUser) => currentUser.id === userId);

      if (!user) {
        reject(new Error(`user with ${userId} data was not found`));
        return;
      }

      resolve(user);
    }, 1000);
  });
}

async function findUserWithAsyncAwait(userId: number): Promise<void> {
  try {
    const user = await findUserWithPromise(userId);
    console.log("async/await", user.name);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.log("async/await", message);
  }
}

// findUserWithCallback(30, (error, user) => {
//   if (error) {
//     console.log("callback error", error.message);
//     return;
//   }

//   console.log("callback result", user?.id, user?.name, user?.role);
// });

// findUserWithPromise(100)
//   .then((user) => {
//     console.log("promise result", user?.id, user?.name, user?.role);
//   })
//   .catch((error: Error) => {
//     console.log("promise error", error.message);
//   });

findUserWithAsyncAwait(100);
