```js
getInitials({ firstName: "John", middleName: "A", lastName: "Doe" }); // Output: 'J. A. D.'
getInitials({ firstName: "Jane", lastName: "Doe" }); // Output: 'J. D.'

export const getInitials = (user) => {
  const { firstName, middleName, lastName } = user;
  let initials = firstName.charAt(0).toUpperCase() + ". ";
  if (middleName) {
    initials += middleName.charAt(0).toUpperCase() + ". ";
  }
  initials += lastName.charAt(0).toUpperCase() + ".";
  return initials;
};

export const getInitials = (user) => {
  const names = [user.firstName, user.middleName, user.lastName].filter(
    (name) => name
  ); // filters out undefined middleName
  return names.map((name) => name.charAt(0)).join(". ") + ".";
};
