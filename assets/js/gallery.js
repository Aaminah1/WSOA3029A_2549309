const apiKey = 'rtOADqVbWXtfwq6MGQrwMV8EJe7k2aP2vGF7wtAi'; // Replace 'YOUR_API_KEY' with your actual NASA API key
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=50`;

const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const loadingIndicator = document.getElementById('loading');
const filterBtn = document.getElementById('filter-btn');
const datePicker = document.getElementById('date-picker');

let allImages = []; // Global variable to store all images

// Set the maximum date on the date picker to today's date
const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
datePicker.setAttribute('max', today); // Set the max attribute dynamically

// Fetch APOD images on page load
async function fetchAPOD() {
    try {
        showLoading();
        const response = await fetch(apiUrl);
        const data = await response.json();
        allImages = data; // Store the fetched images globally
        displayImages(data);
    } catch (error) {
        console.error('Error fetching APOD data:', error);
    } finally {
        hideLoading();
    }
}

// Display APOD images in the gallery
function displayImages(images) {
    galleryContainer.innerHTML = ""; // Clear previous content
    images.forEach(image => {
        // Create a card for each image
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Create the image element
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        
        // Create the card content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        
        // Create the title element
        const title = document.createElement('h3');
        title.textContent = image.title;
        
        // Create the description element
        const description = document.createElement('p');
        description.textContent = image.explanation;

        // Append elements to card content
        cardContent.appendChild(title);
        cardContent.appendChild(description);

        // Append image and content to card
        card.appendChild(img);
        card.appendChild(cardContent);

        // Toggle content on card click
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            // Open modal with full view
            openModal(image);
        });

        // Append card to gallery container
        galleryContainer.appendChild(card);
    });
}

// Fetch APOD data for a specific date
async function fetchAPODByDate() {
    const date = datePicker.value;
    if (!date) return; // Do nothing if date is empty

    const dateApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
        showLoading();
        const response = await fetch(dateApiUrl);
        const data = await response.json();
        displayImages([data]); // Send as an array to displayImages function
    } catch (error) {
        console.error('Error fetching APOD data for date:', error);
    } finally {
        hideLoading();
    }
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'block';
    galleryContainer.style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
    galleryContainer.style.display = 'flex';
}

// Show all images from global storage
function showAll() {
    displayImages(allImages);
}

// Open the modal with detailed view
function openModal(image) {
    modalImg.src = image.url;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.explanation;
    modal.style.display = 'block';
}

// Close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Close modal on click outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Enable/Disable filter button based on date picker value
datePicker.addEventListener('input', () => {
    filterBtn.disabled = !datePicker.value;
});

// Call the fetchAPOD function on page load
fetchAPOD();