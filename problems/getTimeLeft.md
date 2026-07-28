```js
export const getTimeLeft = (years, months) => {
  const yearsString = years === 1 ? "year" : "years";
  const monthsString = months === 1 ? "month" : "months";

  return `${years} ${yearsString} and ${months} ${monthsString}`;
};
