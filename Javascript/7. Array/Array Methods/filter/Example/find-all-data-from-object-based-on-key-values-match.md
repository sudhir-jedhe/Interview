Here's the full code for your example with explanations included for clarity:

```javascript
const users = [
  { name: "John", city: "London", born: "2001-04-01" },
  { name: "Lenny", city: "New York", born: "1997-12-11" },
  { name: "Andrew", city: "Boston", born: "1987-02-22" },
  { name: "Peter", city: "Prague", born: "1936-03-24" },
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Adam", city: "Trnava", born: "1983-12-01" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" },
  { name: "Robert", city: "Prague", born: "1998-03-14" },
];

// Filter users from Bratislava
let res = users.filter((user) => user.city === "Bratislava");
console.log("Users from Bratislava:", res);

// Filter users from Bratislava whose names start with 'A'
res = users.filter(
  (user) => user.city === "Bratislava" && user.name.startsWith("A")
);
console.log("Users from Bratislava with names starting with 'A':", res);

// Function to calculate age
function getAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Filter users older than 40 years
res = users.filter((user) => getAge(user.born) > 40);
console.log("Users older than 40 years:", res);
```

### **Code Explanation**

1. **Filtering Users from Bratislava**  
   ```javascript
   let res = users.filter((user) => user.city === "Bratislava");
   ```
   Filters the array to include only users whose `city` is "Bratislava".

2. **Filtering Users from Bratislava with Names Starting with 'A'**  
   ```javascript
   res = users.filter(
     (user) => user.city === "Bratislava" && user.name.startsWith("A")
   );
   ```
   Combines the `city` filter with a condition to check if the `name` starts with "A".

3. **Calculating Age**  
   ```javascript
   function getAge(dateOfBirth) {
     const today = new Date();
     const birthDate = new Date(dateOfBirth);
     let age = today.getFullYear() - birthDate.getFullYear();
     const monthDiff = today.getMonth() - birthDate.getMonth();

     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
       age--;
     }
     return age;
   }
   ```
   A helper function to calculate the age based on the birth date.

4. **Filtering Users Older Than 40 Years**  
   ```javascript
   res = users.filter((user) => getAge(user.born) > 40);
   ```
   Uses the `getAge` function to include only users older than 40 years.

### **Output**

For the provided input, the output will look like this:
```javascript
Users from Bratislava: [
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" }
]
Users from Bratislava with names starting with 'A': [
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" }
]
Users older than 40 years: [
  { name: "Andrew", city: "Boston", born: "1987-02-22" },
  { name: "Peter", city: "Prague", born: "1936-03-24" },
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Adam", city: "Trnava", born: "1983-12-01" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" }
]
```