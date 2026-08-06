```js
let books_details = [
  {
    book_id: 1,
    book_name: "Live Life Happily..!!",
    book_author: "Aman",
    book_copies: 10,
  },
  {
    book_id: 2,
    book_name: "Be Energetic Always..!!",
    book_author: "Ram",
    book_copies: 20,
  },
  {
    book_id: 3,
    book_name: "Earn Respect..!!",
    book_author: "Shyam",
    book_copies: 30,
  },
];
console.log(books_details);

/************************************************** */

let book_ids = [1, 2, 3];

let book_names = [
  "Live Life Happily..!!",
  "Be Energetic Always..!!",
  "Earn Respect..!!",
];

let book_authors = ["Aman", "Ram", "Shyam"];

let book_copies = [10, 20, 30];

let books_details = book_ids.map((id, index_value) => {
  return {
    id: id,
    book_name: book_names[index_value],
    book_author: book_authors[index_value],
    book_copies: book_copies[index_value],
  };
});
console.log(books_details);

/********************************************************** */
const no = [1, 2, 3];
const player = ["Virat kohli", "Ab de villiers", "Glenn Maxwell"];
const country = ["India", "South africa", "Australia"];

for (let i = 0; i < no.length; i++) {
  const newArray = {
    no: no[i],
    Player_name: player[i],
    country_name: country[i],
  };
  console.log(newArray);
}
