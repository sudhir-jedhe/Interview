// The Window object implements the `WindowLocalStorage` and `WindowSessionStorage` objects which has `localStorage`(window.localStorage) and `sessionStorage`(window.sessionStorage) properties respectively. These properties create an instance of the Storage object, through which data items can be set, retrieved and removed for a specific domain and storage type (session or local).
// For example, you can read and write on local storage objects as below

localStorage.setItem("logo", document.getElementById("logo").value);
localStorage.getItem("logo");
