function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tab-content" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    
}

// Optional: Add code here to automatically click the first tab on page load
document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName("tab-link")[0].click();
});

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


    

