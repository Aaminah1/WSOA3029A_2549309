document.addEventListener('DOMContentLoaded', () => {
    // Get the 'tab' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    // If 'tab' parameter exists, open the corresponding tab
    if (tabParam) {
        openTab(null, tabParam);
    } else {
        // Default to the first tab (Style Guide) if no parameter is present
        document.querySelector(".tab-link").click();
    }
});

// Function to open specific tab
const openTab = (event, tabName) => {
    // Hide all tab-content elements
    const tabContent = document.getElementsByClassName("tab-content");
    Array.from(tabContent).forEach(content => content.style.display = "none");

    // Remove the active class from all tab links
    const tabLinks = document.getElementsByClassName("tab-link");
    Array.from(tabLinks).forEach(link => link.className = link.className.replace(" active", ""));

    // Show the selected tab's content
    document.getElementById(tabName).style.display = "block";

    // Add active class to the clicked tab link (if an event exists)
    if (event) {
        event.currentTarget.className += " active";
    } else {
        document.querySelector(`[onclick*="${tabName}"]`).className += " active";
    }
};

// Wireframes slideshow
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.wireframe-gallery img');
    let currentImageIndex = 0;

    // Function to update the visibility of images
    const updateImageDisplay = () => {
        images.forEach(img => img.style.display = 'none');
        images[currentImageIndex].style.display = 'block';
    };

    // Next and Previous button functionality
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.addEventListener('click', () => {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        updateImageDisplay();
    });

    nextButton.addEventListener('click', () => {
        currentImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        updateImageDisplay();
    });

    updateImageDisplay();
});

// Function for line under headings for blogs
const createSparkles = (lineElement) => {
    const width = window.innerWidth;
    const count = width < 480 ? 20 : width < 1024 ? 30 : 40; // Set sparkle count based on screen width
  
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = '50%';
        sparkle.style.transform = 'translateY(-50%)';
        sparkle.style.animationDelay = `${Math.random() * 3}s`;
        lineElement.appendChild(sparkle);
    }
};
  
document.addEventListener('DOMContentLoaded', () => {
    const starryLine = document.querySelector('.starry-line');
    createSparkles(starryLine);

    window.onresize = () => {
        starryLine.innerHTML = ''; // Clear existing sparkles
        createSparkles(starryLine);
    };
});
