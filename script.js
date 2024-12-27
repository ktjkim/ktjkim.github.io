// Utility to fetch and parse CSV
async function fetchBooks() {
    const response = await fetch('books.csv'); // Path to your CSV file
    const text = await response.text();
    return parseCSV(text);
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
  