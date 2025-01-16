const apiKey = '44668410-8bff2fd44bcf0ce1f5ce3aae5'; // Replace with your Pixabay API key
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading-indicator');
const loadMoreButton = document.getElementById('load-more-button');

let currentPage = 1;
let currentQuery = '';
let currentCategory = '';

searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value;
    currentCategory = categorySelect.value;
    if (currentQuery) {
        currentPage = 1;
        resultsContainer.innerHTML = '';
        searchImages(currentQuery, currentCategory, currentPage);
    }
});

loadMoreButton.addEventListener('click', () => {
    if (currentQuery) {
        currentPage++;
        searchImages(currentQuery, currentCategory, currentPage);
    }
});

async function searchImages(query, category, page) {
    loadingIndicator.style.display = 'block';
    loadMoreButton.style.display = 'none';
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&category=${category}&page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        displayResults(data.hits);
        if (data.hits.length > 0) {
            loadMoreButton.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching images. Please try again.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function displayResults(images) {
    images.forEach(image => {
        const imgElement = document.createElement('div');
        imgElement.classList.add('result-item');
        imgElement.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}">
            <button class="download-button" onclick="downloadImage('${image.largeImageURL}', '${image.tags}')">Download</button>
        `;
        resultsContainer.appendChild(imgElement);
    });
}

function downloadImage(url, tags) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${tags}.jpg`;
    anchor.click();
}
