//set the page constants
const book_title = document.querySelector("#title"),
        book_author = document.querySelector("#author"),
        book_isbn = document.querySelector("#isbn");

//Book class: handles a book
class Book{

    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}//End of class: Book

//UI class: handle UI tasks
class UI{

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) =>  UI.addBookToList(book));
    }//End of method: displayBooks()

    static addBookToList(book){
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td class='text-capitalize'>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-floating red darken-3 delete'>X</a></td>
        `;

        list.appendChild(row);
    }//End of method: addBookToList()

    static deleteBook(el){
        if(el.classList.contains("delete"))
            el.parentElement.parentElement.remove();
    }//End of method: deleteBook()

    static showAlert(message, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(messsage));

        //create a container
        const container = document.querySelector(".container"),
                row = document.querySelector(".my-row");

        container.insertBefore(container, row);

        //Make a vanish in 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(), 2000);

    }//End of method: showAlert()

    //Clear fields
    static clearFields(){
        book_title.value = "";
        book_author.value = "";
        book_isbn.value = "";
    }//End of method: clearFields()

}//End of class: UI

//Store class: handles storage
class Store{

    //getBooks
    static getBooks(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }//End of method: getBooks()

    static addBooks(book){
        const books = Store.getBooks();

        //Check if a similar book exists in localStorage
        const exists = books.findIndex((bk) => bk.title === book.title || bk.isbn === book.isbn);

        if( exists < 0 ){
            //Append the book to the localStorage for books
            books.push(book);

            //Set the item to localStorage: Turn it to a string b/c localStorage emits only strings
            localStorage.setItem("books", JSON.stringify(books));
        }
        else {
            Materialize.toast("Similar book exists", 10000, "rounded");
        }
    }//End of method: addBooks()

    //removeBook
    static removeBook(isbn){
        const books = Store.getBooks();

        //Loop through the loops
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        //Reset the books collection in the localStorage
        localStorage.setItem("books", JSON.stringify(books));

    }//End of method: removeBook()

}//End of class Store

//Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

//Event: add Book
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get the form values
    const title = book_title.value,
        author = book_author.value,
        isbn = book_isbn.value;

    //validate the form fields
    if(title === "" || author === "" || isbn === ""){
        Materialize.toast("Please fill in all fields", 10000, "rounded");
    }
    else {
        //Instantiate a book
        const book = new Book(title, author, isbn);

        //Add Book To List
        UI.addBookToList(book);

        //Add book to store: localStorage
        Store.addBooks(book);

        //Clear fields
        UI.clearFields();

        Materialize.toast("Book added", 10000, "rounded");
    }
});

//Event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    e.preventDefault();

    //remove books from UI
    UI.deleteBook(e.target);

    //remove a book from localStorage
    const getIsbn = e.target.parentElement.previousElementSibling.innerText;
    Store.removeBook(getIsbn);

    //alert the user that a book has been deleted
    Materialize.toast("Book deleted", 10000, "rounded");
});