document.addEventListener('DOMContentLoaded', async () => {
    let books = await fetchBooks();
    renderBooks(books);
  
    // Handle sort selection
    const sortBySelect = document.getElementById('sort-by');
    sortBySelect.addEventListener('change', () => {
      const sortValue = sortBySelect.value;
      const sortedBooks = sortBooks(books, sortValue);
      renderBooks(sortedBooks);
    });
  });
  
  async function fetchBooks() {
    const response = await fetch('books.csv');
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true });
    return parsed.data.map(book => ({
      ...book,
      Rating: parseFloat(book.Rating) || 0, // Convert rating to number for sorting
    }));
  }
  
  function sortBooks(books, sortOption) {
    const sortedBooks = [...books];
    if (sortOption === 'rating-desc') {
      sortedBooks.sort((a, b) => b.Rating - a.Rating); // High to Low
    } else if (sortOption === 'rating-asc') {
      sortedBooks.sort((a, b) => a.Rating - b.Rating); // Low to High
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
          <div class="book-date">${book.Date || 'Unknown Date'}</div>
        </div>
      `;
      bookList.appendChild(listItem);
    });
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
  
  // Render book list
  async function renderBooks() {
    const books = await fetchBooks();
    const bookList = document.getElementById('book-list');
  
    books.forEach(book => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="book-info">
          <div class="book-title">${book.Title}</div>
          <div class="book-author">${book.Author}</div>
          ${book.Status ? `<div class="book-status">${book.Status}</div>` : ''}
        </div>
        <div class="book-meta">
          <div class="book-rating">${'★'.repeat(book.Rating)}${'☆'.repeat(5 - book.Rating)}</div>
          <div class="book-date">${book.Date}</div>
        </div>
      `;
      bookList.appendChild(listItem);
    });
  }
  
  // Sort functionality
  function setupSorting() {
    document.getElementById('sort-button').addEventListener('click', () => {
      const bookList = document.getElementById('book-list');
      const books = Array.from(bookList.children);
  
      books.sort((a, b) => {
        const dateA = new Date(a.querySelector('.book-date').textContent.trim());
        const dateB = new Date(b.querySelector('.book-date').textContent.trim());
        return dateB - dateA;
      });
  
      bookList.innerHTML = '';
      books.forEach(book => bookList.appendChild(book));
    });
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    setupSorting();
  });
  