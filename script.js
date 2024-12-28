document.addEventListener('DOMContentLoaded', async () => {
    let books = await fetchBooks();  // Fetch books data
    renderBooks(books);  // Initial render of books

    // Initialize sorting functionality
    initializeSort(books);

    let urls = await fetchInspiration();
    renderInspiration(urls);

    // Initialize tab switching functionality
    initializeTabs();

    // Default to "Thoughts" tab
    showTab('books');
});

function initializeTabs() {
    const tabs = ['thoughts', 'books', 'inspiration'];
    tabs.forEach(tab => {
        const tabButton = document.getElementById(`${tab}-tab`);
        tabButton.addEventListener('click', event => {
            event.preventDefault();
            showTab(tab);
        });
    });
}

function initializeSort(books) {
    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', () => {
        const sortValue = sortButton.dataset.sortValue || 'rating-desc';
        const sortedBooks = sortBooks(books, sortValue);
        renderBooks(sortedBooks);

        // Toggle sort order
        const nextSortValue = sortValue === 'rating-desc' ? 'date-desc' : 'rating-desc';
        sortButton.dataset.sortValue = nextSortValue;
        sortButton.textContent = nextSortValue === 'rating-desc' ? 'Rating' : 'Date';
    });
}

async function fetchBooks() {
    const response = await fetch('books.csv');
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true });
    return parsed.data.map(book => ({
        ...book,
        Rating: parseFloat(book.Rating) || 0, // Convert rating to number for sorting
        Date: new Date(book.Date), // Convert date string to Date object for sorting
    }));
}

async function fetchInspiration() {
    const response = await fetch('inspiration.csv');
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true});
    return parsed.data;
}

function sortBooks(books, sortOption) {
    const sortedBooks = [...books];
    if (sortOption === 'rating-desc') {
        sortedBooks.sort((a, b) => b.Rating - a.Rating); // High to Low by Rating
    } else if (sortOption === 'date-desc') {
        sortedBooks.sort((a, b) => b.Date - a.Date); // Newest to Oldest by Date
    }
    return sortedBooks;
}


function renderInspiration(urls) {

    const urlListContainer = document.getElementById('inspiration-list');
    urlListContainer.innerHTML = '';

    urls.forEach(url => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="inspiration">
                <div class="inspiration-url"><a href=${url.URL || '#'} target="_blank">${url.URL || 'Unknown URL'}</a></div>
                <div class="inspiration-notes">${url.Notes || 'Unknown notes'}</div>
            </div>
        `;
        urlListContainer.appendChild(listItem);
    })
}


function renderBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear the current list

    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="book-info">
                <div class="book-title">${book.Title || 'Unknown Title'}</div>
                <div class="book-author">${book.Author || 'Unknown Author'}</div>
                ${book.Status ? `<div class="book-status">${book.Status}</div>` : ''}
            </div>
            <div class="book-meta">
                <div class="book-rating">${'★'.repeat(book.Rating || 0)}${'☆'.repeat(5 - (book.Rating || 0))}</div>
                <div class="book-date">${formatDate(book.Date)}</div>
            </div>
        `;
        bookList.appendChild(listItem);
    });
}

// Function to format the date as YYYY-MM
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad single digits
    return `${year}-${month}`;
}

function showTab(tab) {
    const sections = ['thoughts', 'books', 'inspiration'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        const tabElement = document.getElementById(`${section}-tab`);
        const isActive = section === tab;

        sectionElement.style.display = isActive ? 'block' : 'none';
        tabElement.classList.toggle('active', isActive);
    });
}