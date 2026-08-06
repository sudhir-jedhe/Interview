```js
const phoneNo = "4445556678";

function formatNumber() {
  console.log(phoneNo.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
}

formatNumber();

/*********************** */
const phoneNo = "4445556678";

function formatNumber() {
  const formatNum =
    phoneNo.substr(0, 3) +
    "-" +
    phoneNo.substr(3, 3) +
    "-" +
    phoneNo.substr(6, 4);

  console.log(formatNum);
}

formatNumber();

// 555 - 444 - 666;
