document.addEventListener('DOMContentLoaded', function () {
    // Get all tab links
    const thoughtsTab = document.getElementById('thoughts-tab');
    const booksTab = document.getElementById('books-tab');
    
    // Get all content sections
    const thoughtsSection = document.getElementById('thoughts');
    const booksSection = document.getElementById('books');
  
    // Function to switch between tabs
    function switchTab(activeTab, activeSection) {
      // Remove 'active' class from both tabs
      thoughtsTab.classList.remove('active');
      booksTab.classList.remove('active');
  
      // Hide both sections
      thoughtsSection.classList.remove('active');
      booksSection.classList.remove('active');
      
      // Add 'active' class to the clicked tab and show the corresponding section
      activeTab.classList.add('active');
      activeSection.classList.add('active');
    }
  
    // Event listeners for tabs
    thoughtsTab.addEventListener('click', function (event) {
      event.preventDefault();
      switchTab(thoughtsTab, thoughtsSection);
    });
  
    booksTab.addEventListener('click', function (event) {
      event.preventDefault();
      switchTab(booksTab, booksSection);
    });
    
    // Default: Show books section and hide thoughts section
    switchTab(booksTab, booksSection);
  });
  


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

  // Parse CSV file into an array of objects
  function parseCSV(data) {
    const rows = data.split('\n').map(row => row.trim()).filter(row => row); // Split by line
    const headers = rows.shift().split(','); // Extract headers
  
    return rows.map(row => {
      const values = row.split(',');
      return headers.reduce((acc, header, index) => {
        acc[header.trim()] = values[index]?.trim();
        return acc;
      }, {});
    });
  }
  