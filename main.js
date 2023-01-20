const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p')
    textYear.innerText = `Tahun: ${year}`;

    const container = document.createElement('div');
    container.classList.add('action');

    const article = document.createElement('article');
    article.classList.add('book_item');

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('red');
    buttonDelete.addEventListener('click', function () {
        const deleteConfirmation = confirm(`Ingin mengapus buku ${title} '?`);
        if (deleteConfirmation) {
            removeBook(id);
        }
    })
    buttonDelete.innerText = 'Hapus buku'

    function button(bool) {
        const button = document.createElement('button');
        button.classList.add('green');
        button.innerText = bool ? 'Belum selesai dibaca' : 'Selesai dibaca';
        button.addEventListener('click', function () {
            move(id, isComplete);
        })
        container.append(button, buttonDelete);
    }

    button(isComplete);
    article.append(textTitle, textAuthor, textYear, container);
    article.setAttribute('id', `book-${id}`);

    return article;
}

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function move(bookId, isComplete) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    console.log(`indeks = ${bookTarget}`)
    console.log(`awal ${bookTarget.isComplete}`)
    bookTarget.isComplete = !isComplete;
    console.log(`akhir ${bookTarget.isComplete}`)
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        submitForm.reset();
        alert("Tersimpan data buku baru!");
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    incompleteBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            incompleteBookList.append(bookElement);
        }
    }
});

const checkbox = document.getElementById('inputBookIsComplete');
checkbox.onclick = bookshelfAddButton;

function bookshelfAddButton() {
    const textOnButton = document.getElementById('isComplete');

    textOnButton.innerText = checkbox.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
}

bookshelfAddButton();