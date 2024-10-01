// Function to initialize the D3 zoomable and pannable container
function initializeZoomPan() {
    const mapContainer = document.getElementById('map-container');
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;
    

    const svg = d3.select('#map-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background-color', '#000'); // Background color for visibility

    const g = svg.append('g'); // Group element to hold all elements

    // Set up image dimensions and position
    const imgWidth = 3000; // Adjust according to the actual image dimensions
    const imgHeight = 1500; // Adjust according to the actual image dimensions

    // Load the galaxy image and append it to the group
    g.append('image')
        .attr('xlink:href', '/WSOA3029A_2549309/assets/images/galaxybg.jpg')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', imgWidth)
        .attr('height', imgHeight)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Define the zoom behavior with pan limits and dynamic marker scaling
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) // Set the zoom scale limits
        .translateExtent([[0, 0], [imgWidth, imgHeight]]) // Pan limits based on the image size
        .on('zoom', (event) => {
            g.attr('transform', event.transform); // Apply zoom/pan transform
            const currentZoom = event.transform.k; // Get current zoom level
            adjustClusterBehavior(g, currentZoom); // Adjust visibility of clusters and exoplanets

            // Apply filter during zoom/pan dynamically
            applyGlobalFilter(); 
        });

    // Apply the zoom behavior to the SVG element
    svg.call(zoom);

    // Initial transformation to center the image in the container
    const initialX = (containerWidth - imgWidth) / 2;
    const initialY = (containerHeight - imgHeight) / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(1));
}

// Function to dynamically adjust the behavior of clusters and exoplanets based on zoom level
function adjustClusterBehavior(g, zoomLevel) {
    const maxClusterSize = 40; // Maximum size for clusters before they burst
    const maxExoplanetSize = 8; // Maximum size for exoplanets

    // Break clusters faster and start showing exoplanets sooner
    g.selectAll('.cluster-marker')
        .attr('r', d => zoomLevel < 1 ? maxClusterSize * zoomLevel : 0) // Shrink clusters faster
        .attr('display', d => zoomLevel < 1 ? 'block' : 'none'); // Hide clusters earlier at a smaller zoom level

    // Show exoplanets more rapidly after zoom level 1
    // Modify the scale factor for larger symbols
    g.selectAll('.planet-marker')
        .attr('transform', d => `translate(${d.x}, ${d.y}) scale(${zoomLevel >= 1 ? Math.min((zoomLevel - 1) * 12, maxExoplanetSize) / 8 : 0})`)
        .attr('display', d => zoomLevel >= 1 ? 'block' : 'none') // Show exoplanets earlier
        .attr('fill', d => adjustMarkerColor(d))
        .attr('stroke', '#fff') // Add a white stroke for better visibility
        .attr('stroke-width', 1.5); // Thicker stroke for clearer distinction
}

// Global variable to store exoplanet data
let exoplanetData = [];

// Function to fetch and parse exoplanet data from the API
async function fetchExoplanets() {
    const API_URL = 'https://raw.githubusercontent.com/OpenExoplanetCatalogue/oec_tables/master/comma_separated/open_exoplanet_catalogue.txt';

    try {
        const response = await fetch(API_URL); // Fetch the data from the API
        const csvData = await response.text(); // Get the CSV data as text
        const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data; // Parse the CSV data
        exoplanetData = parsedData; // Store the parsed data in the global variable
        console.log("Exoplanet data fetched successfully:", exoplanetData); // Log the data to the console

        addClusterMarkers(); // Call function to add cluster markers after data is fetched
        addExoplanetMarkers(); // Call function to add exoplanet markers
        populateDropdown(); // Call function to populate dropdown after data is fetched
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    // Attach event listeners for search functionality
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('planet-dropdown').addEventListener('change', handleDropdownSelect);
}

function populateDropdown() {
    const dropdown = document.getElementById('planet-dropdown');
    exoplanetData.forEach((planet) => {
        const option = document.createElement('option');
        option.value = planet.name || 'Unknown';
        option.text = planet.name || 'Unknown';
        dropdown.appendChild(option);
    });
}

function highlightExoplanet(planetName) {
    const g = d3.select('#map-container svg g'); // The SVG group element

    // Reset previous highlights
    g.selectAll('.planet-marker')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

    // Find and highlight the selected planet
    const planet = exoplanetData.find(p => p.name === planetName);

    if (planet) {
        const { x, y } = planet; // Use the stored x, y coordinates

        // Pan the map to the selected exoplanet
        d3.select('#map-container svg')
            .transition()
            .duration(1000)
            .call(d3.zoom().transform, d3.zoomIdentity.translate(-x + 1500, -y + 750).scale(2));

        // Highlight the selected planet
        g.selectAll('.planet-marker')
            .filter(d => d.name === planetName)
            .attr('stroke', '#FFD700')  // Highlight with a gold stroke
            .attr('stroke-width', 3);
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input').value.trim();
    if (searchInput) {
        highlightExoplanet(searchInput);
    }
}

function handleDropdownSelect() {
    const selectedPlanet = document.getElementById('planet-dropdown').value;
    if (selectedPlanet) {
        highlightExoplanet(selectedPlanet);
    }
}

// Function to add cluster markers to the map (RE-INTEGRATING THIS FUNCTION)
function addClusterMarkers() {
    const g = d3.select('#map-container svg g'); // Select the group element where the galaxy image is added
    const imgWidth = 3000; // Image width used in initializeZoomPan
    const imgHeight = 1500; // Image height used in initializeZoomPan

    // Create cluster data by grouping exoplanets (for simplicity, using random positions here)
    const clusters = d3.range(30).map(() => ({
        x: Math.random() * imgWidth,
        y: Math.random() * imgHeight,
        size: Math.floor(Math.random() * 50 + 20) // Random cluster size
    }));

    // Add cluster markers for low zoom levels
    g.selectAll('.cluster-marker')
        .data(clusters)
        .enter()
        .append('circle')
        .attr('class', 'cluster-marker')
        .attr('cx', d => d.x) // Cluster position
        .attr('cy', d => d.y) // Cluster position
        .attr('r', d => d.size) // Cluster size
        .attr('fill', '#808080') // Cluster color
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('display', 'block'); // Initially displayed
}

// Function to show exoplanet information in the side panel
function showExoplanetInfo(planet) {
    const panel = document.getElementById('planet-info-panel');
    const planetDetails = document.getElementById('planet-details');

    // Fill the panel with exoplanet information
    document.getElementById('planet-name').textContent = planet.name || 'Unknown';
    planetDetails.innerHTML = `
      
        <p>Category: ${categorizePlanet(planet)}</p>
       
        <p>Distance: ${planet['system_distance'] || 'Unknown'} light-years</p>
        <p>Discovery Year: ${planet['discoveryyear']}</p>
        <p>Temperature: ${planet['temperature'] || planet['hoststar_temperature']} K</p>
        <p>Radius: ${planet['radius']} Earth radii</p>
        <p>Mass: ${planet['mass']} Jupiter masses</p>
    `;

    // Show the panel
    panel.style.display = 'block';
}

// Function to add exoplanet markers to the map with custom shapes
function addExoplanetMarkers() {
    const g = d3.select('#map-container svg g'); // Select the group element where the galaxy image is added
    const imgWidth = 3000; // Image width used in initializeZoomPan
    const imgHeight = 1500; // Image height used in initializeZoomPan

    const tooltip = d3.select("#tooltip");

    // Add exoplanet markers with custom shapes
    g.selectAll('.planet-marker')
        .data(exoplanetData)
        .enter()
        .append('path')
        .attr('class', 'planet-marker')
        .attr('d', d => getCustomShape(d)) // Pass the data object `d`
        .attr('transform', d => {
            d.x = Math.random() * imgWidth; // Store random x position for exoplanets
            d.y = Math.random() * imgHeight; // Store random y position for exoplanets
            return `translate(${d.x}, ${d.y})`; // Translate to the correct position
        })
        .attr('fill', d => adjustMarkerColor(d)) // Use color adjustment function
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('display', 'none') // Initially hidden, will reveal on zoom
        .attr('data-category', d => categorizePlanet(d)) // Add a data attribute for filtering
        .on('mouseover', (event, d) => {
            tooltip
                .style("display", "block")
                .html(`<strong>Exoplanet:</strong> ${d['name'] || 'Unknown'}`);
        })
        .on('mousemove', (event) => {
            tooltip
                .style('top', (event.pageY + 15) + 'px') // Positioning the tooltip slightly below the mouse pointer
                .style('left', (event.pageX + 15) + 'px');
        })
        .on('mouseout', () => {
            tooltip.style("display", "none");
        })
        .on('click', (event, d) => {
            showExoplanetInfo(d); // Show planet info when clicked
        });
}



function getCustomShape(d) {
    let category;
    
    // Check if the input is an object (exoplanet data), otherwise use the category directly
    if (typeof d === 'object') {
        category = categorizePlanet(d); // Get the category from exoplanet data
    } else {
        category = d; // If it's already a category (for legend), use it directly
    }

    switch (category) {
        case 'potentially-habitable': // Leaf or water drop for habitability
            return 'M12 2 C7 8, 2 12, 12 22 C22 12, 17 8, 12 2 Z'; // Leaf/Water droplet shape
        case 'hot-jupiter': // Flame for heat
            return 'M12 2 C9 9, 7 15, 12 22 C17 15, 15 9, 12 2 Z'; // Flame shape
        case 'cold-giant': // Snowflake for coldness
            return 'M12 2 L12 12 L18 8 M12 12 L6 8 M12 12 L18 16 M12 12 L6 16 M12 22 L12 12'; // Snowflake shape
        case 'rocky-planet': // Mountain for rocky surface
            return 'M12 2 L4 20 L20 20 L12 2 Z'; // Mountain/Peak shape
        case 'other': // Star for default
            return 'M12 2 L14 10 L22 10 L16 14 L18 22 L12 17 L6 22 L8 14 L2 10 L10 10 Z'; // Star shape
        default: 
            return d3.symbol().type(d3.symbolCircle).size(50)(); // Default circle if undefined
    }
}


// Function to dynamically adjust marker color based on category
function adjustMarkerColor(data) {
    // Change color based on category or data attributes
    switch (categorizePlanet(data)) {
        case 'potentially-habitable': return '#32CD32'; // Green for habitable
        case 'hot-jupiter': return '#FF4500'; // Red for hot-jupiter
        case 'cold-giant': return '#1E90FF'; // Blue for cold-giant
        case 'rocky-planet': return '#FFD700'; // Gold for rocky-planet
        default: return '#D3D3D3'; // Grey for others
    }
}

// Dummy categorizePlanet function (replace this with your actual logic)
function categorizePlanet(data) {
    const radius = data['radius'] || 1; // Default to 1 Earth radius if missing
    const temperature = data['temperature'] || data['hoststar_temperature'] || 300; // Use host star temperature or default to 300K
    const mass = data['mass'] || 1; // Default to 1 Jupiter mass

    // Define categories based on attributes
    if (radius < 1.5 && temperature > 250 && temperature < 350) {
        return 'potentially-habitable';
    } else if (mass > 5 && temperature > 500) {
        return 'hot-jupiter';
    } else if (mass > 10 && temperature < 100) {
        return 'cold-giant';
    } else if (radius < 2) {
        return 'rocky-planet';
    } else {
        return 'other';
    }
}

// Function to filter exoplanets based on legend selections
function applyGlobalFilter() {
    const habitableChecked = document.getElementById('filter-habitable').checked;
    const hotJupiterChecked = document.getElementById('filter-hot-jupiter').checked;
    const coldGiantChecked = document.getElementById('filter-cold-giant').checked;
    const rockyChecked = document.getElementById('filter-rocky').checked;
    const otherChecked = document.getElementById('filter-other').checked;

    d3.selectAll('.planet-marker').attr('display', d => {
        const category = categorizePlanet(d);
        if (
            (category === 'potentially-habitable' && habitableChecked) ||
            (category === 'hot-jupiter' && hotJupiterChecked) ||
            (category === 'cold-giant' && coldGiantChecked) ||
            (category === 'rocky-planet' && rockyChecked) ||
            (category === 'other' && otherChecked)
        ) {
            return 'block';
        }
        return 'none';
    });

    updateSelectAllButton(); // Update the "Select All" button state dynamically
}

// Add event listeners for the filter checkboxes
document.getElementById('filter-habitable').addEventListener('change', applyGlobalFilter);
document.getElementById('filter-hot-jupiter').addEventListener('change', applyGlobalFilter);
document.getElementById('filter-cold-giant').addEventListener('change', applyGlobalFilter);
document.getElementById('filter-rocky').addEventListener('change', applyGlobalFilter);
document.getElementById('filter-other').addEventListener('change', applyGlobalFilter);
document.getElementById('select-all').addEventListener('click', () => toggleSelectAll());

// Function to check if all category filters are checked
function areAllCategoriesChecked() {
    return document.getElementById('filter-habitable').checked &&
           document.getElementById('filter-hot-jupiter').checked &&
           document.getElementById('filter-cold-giant').checked &&
           document.getElementById('filter-rocky').checked &&
           document.getElementById('filter-other').checked;
}

// Function to toggle between Select All and Deselect All
function updateSelectAllButton() {
    const selectAllButton = document.getElementById('select-all');
    const allChecked = areAllCategoriesChecked();

    if (allChecked) {
        selectAllButton.textContent = 'Deselect All';
    } else {
        selectAllButton.textContent = 'Select All';
    }
}

// Function to select/deselect all categories
function toggleSelectAll() {
    const allChecked = areAllCategoriesChecked();
    const select = !allChecked; // Toggle based on the current state
    document.getElementById('filter-habitable').checked = select;
    document.getElementById('filter-hot-jupiter').checked = select;
    document.getElementById('filter-cold-giant').checked = select;
    document.getElementById('filter-rocky').checked = select;
    document.getElementById('filter-other').checked = select;
    applyGlobalFilter(); // Re-filter after selection
}

function createLegendSymbols() {
    const legendShapes = [
        { id: 'filter-habitable', category: 'potentially-habitable', color: '#32CD32' },
        { id: 'filter-hot-jupiter', category: 'hot-jupiter', color: '#FF4500' },
        { id: 'filter-cold-giant', category: 'cold-giant', color: '#1E90FF' },
        { id: 'filter-rocky', category: 'rocky-planet', color: '#FFD700' },
        { id: 'filter-other', category: 'other', color: '#D3D3D3' }
    ];

    legendShapes.forEach((item, index) => {
        const svg = d3.selectAll('.legend-symbol').filter((d, i) => i === index);

        // Clear existing content (if any) before appending
        svg.selectAll('*').remove();

        // Append the custom shape
        svg.append('path')
            .attr('d', getCustomShape(item.category))  // Use custom shape path
        
            .attr('transform', 'translate(10, 10) scale(0.6)')

            .attr('fill', item.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);  // Ensure a clear border
    });
}



// Ensure this function runs after rendering the legend elements
createLegendSymbols();



// Initial call to set the correct button text on page load
updateSelectAllButton();

// Call the function to create zoomable SVG container
initializeZoomPan();

// Call the function to fetch exoplanet data
fetchExoplanets();
