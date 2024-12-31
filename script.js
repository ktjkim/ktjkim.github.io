document.addEventListener('DOMContentLoaded', async () => {
    let books = await fetchBooks();  // Fetch books data
    renderBooks(books);  // Initial render of books

    // Initialize sorting functionality
    initializeSort(books);

    let urls = await fetchInspiration();
    renderInspiration(urls);

    // Initialize tab switching functionality
    initializeTabs();

    // Map section
    let currentIndex = 0;
    const svg = d3.select("#svg-map");
    const planeGroup = d3.select("#plane-group");
    
    drawMap(svg, currentIndex, planeGroup);

    // Default to the tab based on the URL hash or "books" if none
    const initialTab = window.location.hash ? window.location.hash.substring(1) : 'books';
    showTab(initialTab);
});

async function drawMap(svg, currentIndex, planeGroup) {
    try {
        const planeButton = document.getElementById('plane-button');
        const world = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
        const projection = d3.geoMercator()
            .scale(160)  // Adjust scale if necessary
            .translate([svg.attr("width") / 2, svg.attr("height") / 2]);  // Center map within SVG

        const path = d3.geoPath().projection(projection);

        svg.selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#d9d9d9")
            .attr("stroke", "#333");
        
        // Fetch coordinates after map is drawn
        let coordinates = await fetchCoordinates(projection, currentIndex, planeGroup);    

        // Initialize plane at the first coordinate after loading CSV
        planeGroup.raise();
        movePlane(currentIndex, coordinates, planeGroup); 
        planeButton.addEventListener('click', () => {
            currentIndex = movePlane(currentIndex, coordinates, planeGroup); 
        });

    } catch (error) {
        console.error("Error loading GeoJSON data:", error);
    }
}
async function fetchCoordinates(projection, currentIndex, planeGroup) {
    try {
        const response = await fetch('coordinates.csv');
        const data = await response.text();

        coordinates = data.split('\n').map(line => {
            const [lat, lon, code] = line.split(',');
            const [x, y] = projection([+lon, +lat]); // Project lat/lon to map coordinates
            console.log(lat, lon, code);
            console.log(x, y);
            return { x, y, code };
        }).filter(coord => coord && coord.code); // Remove invalid rows
        return coordinates;
    } catch (error) {
        console.error('Error loading coordinates:', error);
    }
}
function movePlane(currentIndex, coordinates, planeGroup) {
    if (coordinates.length === 0) return; // Skip if no coordinates are loaded
    if (currentIndex >= coordinates.length) {
        currentIndex = 0; // Reset to the first coordinate
    }
    const { x, y } = coordinates[currentIndex];
    console.log(coordinates[currentIndex]);

    planeGroup.transition()
        .duration(1000)
        .attr("transform", `translate(${x}, ${y})`);

    currentIndex++;
    return currentIndex;
}
function initializeTabs() {
    const tabs = ['about', 'books', 'inspiration', 'map'];
    tabs.forEach(tab => {
        const tabButton = document.getElementById(`${tab}-tab`);
        tabButton.addEventListener('click', event => {
            event.preventDefault();  // Prevent the default link behavior (scrolling)
            showTab(tab);

            // Update the URL hash without causing a page scroll
            if (window.location.hash !== `#${tab}`) {
                window.history.pushState(null, '', `#${tab}`);
            }
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
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad single digits
    return `${year}-${month}`;
}
function showTab(tab) {
    const sections = ['about', 'books', 'inspiration', 'map'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        const tabElement = document.getElementById(`${section}-tab`);
        const isActive = section === tab;

        sectionElement.style.display = isActive ? 'block' : 'none';
        tabElement.classList.toggle('active', isActive);
    });
}
