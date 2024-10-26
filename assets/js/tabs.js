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

//fucntion for line on under headings for blogs
function createSparkles(lineElement) {
    const width = window.innerWidth; // Get the viewport width
    let count;
  
    if (width < 480) {
      count = 20; // Less sparkle for smaller screens
    } else if (width < 1024) {
      count = 30; // Moderate sparkle for tablets
    } else {
      count = 40; // More sparkle for larger screens
    }
  
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = '50%';
      sparkle.style.transform = 'translateY(-50%)'; // Center sparkles vertically
      sparkle.style.animationDelay = `${Math.random() * 3}s`; // Stagger the animation start
      lineElement.appendChild(sparkle);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const starryLine = document.querySelector('.starry-line');
    createSparkles(starryLine);
    window.onresize = () => { // Re-create sparkles on resize to adjust count
      starryLine.innerHTML = ''; // Clear existing sparkles
      createSparkles(starryLine);
    };
  });

  




  
    

