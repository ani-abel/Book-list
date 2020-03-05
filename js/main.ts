//set the page constants
const book_title_ts = document.querySelector("#title"),
        book_author_ts = document.querySelector("#author"),
        book_isbn_ts = document.querySelector("#isbn");

//prototype of the book object
type bookObject = { title: string, author: string, isbn: number };

interface AllBooks {
    title: string;
    author: string;
    isbn: number;
}

//Book class
class BookTs implements AllBooks {

    constructor(public title: string, public author: string, public isbn: number){}
}

class StoreTs {

    //getBooks()
    public static getBooks(){
        let books: any[];
        if( localStorage.getItem("books") === null ){
            books = [];
        }
        else {
            //convert to JSON with: JSON.parse()
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }//End of method: getBooks()

    //addBooks()
    public static addBook(book: bookObject): void {
        const books = StoreTs.getBooks();

        //Check to see if similar recored already exists
        const exists: number = books.findIndex((bk: bookObject) => book.title === bk.title || book.isbn === bk.isbn);

        if(exists > 0){
            //Append the book to the localStorage for books
            books.push(book);

            //Set the item to localStorage: Turn it to a string b/c localStorage emits only strings
            localStorage.setItem("books", JSON.stringify(books));
        }
        else Materialize.toast("Similar book exists in the store", 10000, "rounded");
    }//End of method: addBook()

    //removeBook()
    public static removeBook(isbn: number): void {
        const books = StoreTs.getBooks();
        
         //Loop through the loops
         books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }

            localStorage.setItem("books", JSON.stringify(books));
        });
     
    }

}

class UITs {

    public static displayBooks(): void {
        const books = StoreTs.getBooks();

        books.forEach((book) => UITs.addBookToList(book));
    }

    public static addBookToList(book: bookObject): void {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td class='text-capitalize'>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-floating red darken-3 delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    public static deleteBook(el): void {
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }//End of method: deleteBook()

    public static clearFields(): void {
        book_title_ts.value = "";
        book_author_ts.value = "";
        book_isbn_ts.value = "";
    }

}

//Event: display books
document.addEventListener("DOMContentLoaded", UITs.displayBooks());

//Event: add Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
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
        UITs.addBookToList(book);

        //Add book to store: localStorage
        StoreTs.addBooks(book);

        //Clear fields
        UITs.clearFields();

        Materialize.toast("Book added", 10000, "rounded");
    }
});

//Event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    e.preventDefault();

    //remove books from UI
    UITs.deleteBook(e.target);

    //remove a book from localStorage
    const getIsbn = e.target.parentElement.previousElementSibling.innerText;
    Store.removeBook(getIsbn);

    //alert the user that a book has been deleted
    Materialize.toast("Book deleted", 10000, "rounded");
});
        