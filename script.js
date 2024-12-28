document.addEventListener('DOMContentLoaded', async () => {
    let books = await fetchBooks();  // Fetch books data
    renderBooks(books);  // Initial render of books
    
    // Handle sort button click
    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', () => {
        const sortValue = sortButton.dataset.sortValue || 'rating-desc';
        const sortedBooks = sortBooks(books, sortValue);  // Sort books based on the selected option
        renderBooks(sortedBooks);  // Re-render sorted books

        // Toggle between sorting by rating and date
        if (sortValue === 'rating-desc') {
            sortButton.dataset.sortValue = 'date-desc';
            sortButton.textContent = 'Date';
        } else {
            sortButton.dataset.sortValue = 'rating-desc';
            sortButton.textContent = 'Rating';
        }
    });

    showTab('books');
    // Handle tab switching
    // const thoughtsTab = document.getElementById('thoughts-tab');
    // const booksTab = document.getElementById('books-tab');
    // const inspirationTab = document.getElementById('inspiration-tab');

    // thoughtsTab.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     showTab('thoughts');
    // });

    // booksTab.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     showTab('books');
    // });

    // inspirationTab.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     showTab('inspiration');
    // })
    

    // Default to "Thoughts" tab
    showTab('books');
});

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

function sortBooks(books, sortOption) {
    const sortedBooks = [...books];
    if (sortOption === 'rating-desc') {
        sortedBooks.sort((a, b) => b.Rating - a.Rating); // High to Low by Rating
    } else if (sortOption === 'date-desc') {
        sortedBooks.sort((a, b) => b.Date - a.Date); // Newest to Oldest by Date
    }
    return sortedBooks;
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

// Switch between tabs
// function showTab(tab) {
//     const thoughtsSection = document.getElementById('thoughts');
//     const booksSection = document.getElementById('books');
//     const inspirationSection = document.getElementById('inspiration');
//     const thoughtsTab = document.getElementById('thoughts-tab');
//     const booksTab = document.getElementById('books-tab');
//     const inspirationTab = document.getElementById('inspiration-tab');

//     // Hide all sections and remove active class from all tabs
//     thoughtsSection.style.display = 'none';
//     booksSection.style.display = 'none';
//     inspirationSection.style.display = 'none';
//     thoughtsTab.classList.remove('active');
//     booksTab.classList.remove('active');
//     inspirationTab.classList.remove('active');

//     // Show the selected tab and add active class to the corresponding tab button
//     if (tab === 'thoughts') {
//         thoughtsSection.style.display = 'block';
//         thoughtsTab.classList.add('active');
//     } else if (tab === 'books') {
//         booksSection.style.display = 'block';
//         booksTab.classList.add('active');
//     } else if (tab === 'inspiration') {
//         inspirationSection.style.display = 'block';
//         inspirationTab.classList.add('active');
//     }
// }


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