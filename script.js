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
  