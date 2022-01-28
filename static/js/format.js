const birthday = document.querySelector('.birthday');

console.log(birthday.innerText)

let date = new Date(birthday.innerText);

let options = {
    year: "numeric",
    month: "long",
    day: "numeric"
}

let now = new Date();
let years = now.getFullYear() - date.getFullYear();
if(now - date > 0) years -= 1;

birthday.innerHTML =  years + " лет, " + date.toLocaleString("ru", options);