// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCcpFpnTs8YuiXhGlOPTGuZNBkc64cZAXk",
  authDomain: "book-tracker-d5bd9.firebaseapp.com",
  projectId: "book-tracker-d5bd9",
  storageBucket: "book-tracker-d5bd9.appspot.com",
  messagingSenderId: "665784219072",
  appId: "1:665784219072:web:afc11e1b675ecc85e98425",
  measurementId: "G-QGLD1T5F3L",
  databaseURL: "https://book-tracker-d5bd9-default-rtdb.firebaseio.com/",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//reference book list in firebase

var bookDatabase = firebase.database().ref("books");
console.log(bookDatabase);

const myLibrary = [];

function Book(title, author, hasRead, starRating, showOtherBooks) {
  (this.title = title),
    (this.author = author),
    (this.hasRead = hasRead),
    (this.starRating = starRating),
    (this.showOtherBooks = showOtherBooks);
}

function saveBook(title, author, hasRead, starRating) {
  var newBookRef = bookDatabase.push();
  newBookRef.set({
    title: title,
    author: author,
    hasRead: hasRead,
    starRating: starRating,
  });
}

function render(arr) {
  arr.forEach((book, i) => {
    if (i === arr.length - 1) {
      const booksContainer = document.querySelector(".books-container");
      const bookDiv = document.createElement("div");

      bookDiv.dataset.id = i;
      !book.hasRead
        ? (bookDiv.className = "unread-book-div")
        : (bookDiv.className = "read-book-div");
      bookDiv.innerHTML = `<h3 class = 'book-title'>${book.title}</h3>
                          <h3 class ="book-author">${book.author}</h3>
                          ${
                            book.starRating
                              ? `<div class="stars">${book.starRating}</div>`
                              : `<button class="mark-as-read">Mark As Read and Add Rating</button>`
                          }</span>
                          <button class='delete'><img src="trashcan.png"/></button>
                          <button class='edit'><img src="edit.png"/></button>
                          <button class='more-books'>More Books by ${
                            book.author
                          }</button>`;
      booksContainer.appendChild(bookDiv);
    }
    deleteButtonListener(i);
    moreByAuthorButtonListener();
    editButtonListener();
  });
}

function addBookToLibrary(obj) {
  myLibrary.push(obj);
}

function newRatingsDiv() {
  if (readDropdown.value === "Yes") {
    ratingsDiv.style.display = "block";
  } else if (readDropdown.value === "No" || "--") {
    ratingsDiv.style.display = "none";
    for (i = 0; i < stars.length; i++) {
      stars[i].classList.remove("select");
    }
  }
}

getBooksByAuthor = async () => {
  console.log("clicked");
  const author = myLibrary[event.target.parentNode.dataset.id].author;
  console.log(author);
  const value = author.split(" ").join("+");
  const response = await fetch(
    "https://api.nytimes.com/svc/books/v3/reviews.json?author=" +
      `${value}` +
      "&api-key=fsaJyExrkFogrVr0yM5V1nH6ke9YfUwY",
    { mode: "cors" }
  );
  const data = await response.json();

  return data;
};

function showBooksByAuthor(data) {
  const overlayDiv = document.querySelector(".overlay");
  const moreByAuthorDiv = document.getElementById("text-overlay");
  const removeOverlay = document.getElementById("remove-overlay");
  removeOverlay.addEventListener(
    "click",
    () => (overlayDiv.style.display = "none")
  );
  if (data.results.length === 0) {
    alert("Cannot find author in database, check spelling and try again");
    return;
  }
  overlayDiv.style.display = "block";
  console.log(data.results);
  //thanks to Hassan Imam on stack overflow for this:
  const removerDuplicateTitles = data.results.reduce((acc, item) => {
    if (!acc.some((obj) => obj.book_title === item.book_title)) {
      acc.push(item);
    }
    return acc;
  }, []);
  const replaceSummary = removerDuplicateTitles.map((book) => {
    if (book.summary === "") {
      book.summary = "No Summary Available";
    }
    return book;
  });
  const output = replaceSummary.map(
    (book) =>
      `<div class='more-by-author'><h3>${book.book_title}</h3><p>${book.summary}</p><a href =${book.url}>More Here</a></div>`
  );
  moreByAuthorDiv.innerHTML = output.join("<hr/>");
  console.log(moreByAuthorDiv);
}

function upperCase(str) {
  let splitString = str.toLowerCase().split(" ");
  for (var i = 0; i < splitString.length; i++) {
    splitString[i] =
      splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
  }
  return splitString.join(" ");
}

function newBook() {
  event.preventDefault();
  if (title.value == "" || author.value == "") {
    alert("Please fill in all fields");
  } else {
    let parent = document.getElementById("rate");
    let starsSameClass = parent.getElementsByClassName("select").length;
    let unicodeStar = "★ ".repeat(starsSameClass);
    let book = new Book(
      upperCase(title.value),
      upperCase(author.value),
      readStatus.value,
      (starRating = unicodeStar),
      (showOtherBooks = "")
    );
    newBookRef(
      upperCase(title.value),
      upperCase(author.value),
      readStatus.value,
      (starRating = unicodeStar)
    );
    if (document.getElementById("read").value === "Yes") {
      addBookToLibrary(book);
      render(myLibrary);
    } else {
      addBookToLibrary(book);
      render(myLibrary);
    }
    document.getElementById("bookInfo").reset();
  }
}

//moves row back to form for editing
function editBook() {
  const id = event.target.parentNode.parentNode.dataset.id;
  const titleDiv = event.target.parentNode.parentNode.children[0];
  const authorDiv = event.target.parentNode.parentNode.children[1];
  const bookTitle = titleDiv.innerHTML;
  const authorName = authorDiv.innerHTML;
  title.value = bookTitle;
  author.value = authorName;
  removeBookFromLibrary(id);

  editAuthorListener(authorDiv);
}

function chooseRating(event) {
  if (event.target.matches(".selected")) {
    event.preventDefault();
    let target = event.target;
    let selectedStar = target.getAttribute("data-star");
    for (i = 0; i < stars.length; i++) {
      if (i < selectedStar) {
        stars[i].classList.add("select");
      } else {
        stars[i].classList.remove("select");
      }
    }
  }
}

function selectRating(event) {
  let target = event.target;
  let selectedStar = target.getAttribute("data-star");
  if (event.target.matches(".selected")) {
    event.preventDefault();
    for (i = 0; i < stars.length; i++) {
      if (i < selectedStar) {
        stars[i].classList.add("select");
      } else {
        stars[i].classList.remove("select");
      }
    }
  }
}

function removeBookFromLibrary(i) {
  const book = event.target.parentNode.parentNode;
  myLibrary.splice(i, 1);
  book.remove(book);
}

let stars = document.querySelectorAll(".selected");
const readDropdown = document.getElementById("read");
const ratingsDiv = document.querySelector(".Rating");
const title = document.getElementById("title");
const author = document.getElementById("author");
const readStatus = document.getElementById("read");
const newTitle = document.getElementById("submit");
const book1 = new Book(
  "My Brilliant Friend",
  "Elena Ferrante",
  true,
  "★ ★ ★ ★ ★",
  "",
  "",
  ""
);
addBookToLibrary(book1);

document.addEventListener("click", selectRating, false);
document.addEventListener("mouseover", chooseRating, false);

newTitle.addEventListener("click", () => {
  newBook();
  newRatingsDiv();
});

readDropdown.addEventListener("change", () => {
  newRatingsDiv();
});

function deleteButtonListener(i) {
  const deleteButton = document.querySelectorAll(".delete");
  deleteButton.forEach(function (button) {
    button.addEventListener("click", function () {
      removeBookFromLibrary(i);
    });
  });
}

function moreByAuthorButtonListener() {
  const showMoreByAuthorButton = document.querySelectorAll(".more-books");
  showMoreByAuthorButton.forEach((button) =>
    button.addEventListener("click", () =>
      getBooksByAuthor().then((data) => showBooksByAuthor(data))
    )
  );
}

function editButtonListener() {
  const editButton = document.querySelectorAll(".edit");
  editButton.forEach(function (button) {
    button.addEventListener("click", function () {
      editBook();
    });
  });
}

render(myLibrary);
