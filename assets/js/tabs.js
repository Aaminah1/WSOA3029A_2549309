document.addEventListener('DOMContentLoaded', function() {
    // Get the 'tab' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    // If 'tab' parameter exists, open the corresponding tab
    if (tabParam) {
        openTab(null, tabParam); // Pass the tab name from URL
    } else {
        // Default to the first tab (Style Guide) if no parameter is present
        document.querySelector(".tab-link").click();
    }
});

// Function to open specific tab
function openTab(event, tabName) {
    // Hide all tab-content elements
    var tabContent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none"; // Hide all content
    }

    // Remove the active class from all tab links
    var tabLinks = document.getElementsByClassName("tab-link");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", ""); // Remove active class
    }

    // Show the selected tab's content
    document.getElementById(tabName).style.display = "block"; 

    // Add active class to the clicked tab link (if an event exists)
    if (event) {
        event.currentTarget.className += " active";
    } else {
        // Automatically add the active class to the tab in URL
        document.querySelector(`[onclick*="${tabName}"]`).className += " active";
    }
}



// wireframes slideshow
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.wireframe-gallery img');
    let currentImageIndex = 0;

    // Function to update the visibility of images
    function updateImageDisplay() {
        // Hide all images
        images.forEach(img => img.style.display = 'none');

        // Show only the current image
        images[currentImageIndex].style.display = 'block';
    }

    // Next and Previous button functionality
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.addEventListener('click', function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = images.length - 1; // Loop back to the last image
        }
        updateImageDisplay();
    });

    nextButton.addEventListener('click', function() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0; // Loop back to the first image
        }
        updateImageDisplay();
    });

    // Initial display setup
    updateImageDisplay();
});


    

