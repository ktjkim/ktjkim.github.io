document.addEventListener('DOMContentLoaded', async () => {
    let books = await fetchBooks();
    renderBooks(books);
    
    // Handle sort button click
    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', () => {
      const sortValue = sortButton.dataset.sortValue || 'rating-desc';
      const sortedBooks = sortBooks(books, sortValue);
      renderBooks(sortedBooks);
  
      // Toggle sort order between 'rating-desc' and 'rating-asc'
      if (sortValue === 'rating-desc') {
        sortButton.dataset.sortValue = 'rating-asc';
      } else {
        sortButton.dataset.sortValue = 'rating-desc';
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
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
  });
  