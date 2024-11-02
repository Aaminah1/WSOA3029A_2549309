const apiKey = 'rtOADqVbWXtfwq6MGQrwMV8EJe7k2aP2vGF7wtAi'; 
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=50`;

const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const loadingIndicator = document.getElementById('loading-container');
const filterBtn = document.getElementById('filter-btn');
const datePicker = document.getElementById('date-picker');
const message = document.getElementById('message');

let allImages = []; // Global variable to store all images

// Set the maximum date on the date picker to today's date
const today = new Date().toISOString().split('T')[0];
datePicker.setAttribute('max', today);

// Fetch APOD images on page load
const fetchAPOD = async () => {
    try {
        showLoading();
        const response = await fetch(apiUrl);
        const data = await response.json();
        allImages = data;
        displayImages(data);
    } catch (error) {
        console.error('Error fetching APOD data:', error);
    } finally {
        hideLoading();
    }
};

// Display APOD images in the gallery
const displayImages = (images) => {
    galleryContainer.innerHTML = "";
    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const title = document.createElement('h3');
        title.textContent = image.title;

        const description = document.createElement('p');
        description.textContent = image.explanation;

        cardContent.appendChild(title);
        cardContent.appendChild(description);

        card.appendChild(img);
        card.appendChild(cardContent);

        card.addEventListener('click', () => {
            card.classList.toggle('active');
            openModal(image);
        });

        galleryContainer.appendChild(card);
    });
};

// Fetch APOD data for a specific date
const fetchAPODByDate = async () => {
    const date = datePicker.value;
    if (!date) return;

    const dateApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
        showLoading();
        const response = await fetch(dateApiUrl);
        const data = await response.json();
        displayImages([data]);
    } catch (error) {
        console.error('Error fetching APOD data for date:', error);
    } finally {
        hideLoading();
    }
};

// Show loading indicator
const showLoading = () => {
    loadingIndicator.style.display = 'block';
    galleryContainer.style.display = 'none';
};

// Hide loading indicator
const hideLoading = () => {
    loadingIndicator.style.display = 'none';
    galleryContainer.style.display = 'flex';
};

// Show all images from global storage
const showAll = () => {
    displayImages(allImages);
};

// Open the modal with detailed view
const openModal = (image) => {
    modalImg.src = image.url;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.explanation;
    modal.style.display = 'block';
};

// Close modal and remove the 'active' class from any open cards
const closeModal = () => {
    modal.style.display = 'none';
    modalImg.src = '';
    modalTitle.textContent = '';
    modalDescription.textContent = '';

    document.querySelectorAll('.card.active').forEach(card => {
        card.classList.remove('active');
    });
};

// Close modal on click outside
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

// Enable/Disable filter button based on date picker value
datePicker.addEventListener('input', () => {
    if (datePicker.value) {
        filterBtn.disabled = false;
        message.textContent = "Click 'Get APOD' to view the image.";
    } else {
        filterBtn.disabled = true;
        message.textContent = "Please select a date to view the APOD.";
    }
});

// Call the fetchAPOD function on page load
fetchAPOD();
