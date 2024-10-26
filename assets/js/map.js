import { fetchExoplanets } from './dataManager.js';

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
        .attr('xlink:href', '/WSOA3029A_2549309/assets/images/galaxyBg.jpg')
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
    g.selectAll('.planet-marker')
        .attr('transform', d => `translate(${d.x}, ${d.y}) scale(${zoomLevel >= 1 ? Math.min((zoomLevel - 1) * 12, maxExoplanetSize) / 8 : 0})`)
        .attr('display', d => zoomLevel >= 1 ? 'block' : 'none') // Show exoplanets earlier
        .attr('fill', d => adjustMarkerColor(d))
        .attr('stroke', '#fff') // Add a white stroke for better visibility
        .attr('stroke-width', 1.5); // Thicker stroke for clearer distinction
}

// Function to fetch the exoplanet data and add cluster/exoplanet markers
fetchExoplanets().then((data) => {
    initializeZoomPan();
    addClusterMarkers();
    addExoplanetMarkers(data); // Pass fetched data to addExoplanetMarkers
});

// Function to add cluster markers to the map
function addClusterMarkers() {
    const g = d3.select('#map-container svg g');
    const imgWidth = 3000;
    const imgHeight = 1500;

    // Create cluster data
    const clusters = d3.range(30).map(() => ({
        x: Math.random() * imgWidth,
        y: Math.random() * imgHeight,
        size: Math.floor(Math.random() * 50 + 20)
    }));

    // Add tooltip
   // Create a reusable tooltip element with the CSS class
const tooltip = d3.select("body").append("div")
.attr("class", "tooltip") // Apply the tooltip CSS class
.style("display", "none"); // Initial hidden state

    // Add cluster markers
    g.selectAll('.cluster-marker')
        .data(clusters)
        .enter()
        .append('circle')
        .attr('class', 'cluster-marker')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.size)
        .attr('fill', '#808080')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('display', 'block')
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget).attr('fill', '#FFD700'); // Highlight on hover
            tooltip.style("display", "block").text("Zoom to explore");
        })
        .on('mousemove', (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px");
        })
        .on('mouseout', (event) => {
            d3.select(event.currentTarget).attr('fill', '#808080'); // Remove highlight
            tooltip.style("display", "none");
        });
}

// Function to add exoplanet markers to the map
function addExoplanetMarkers(data) {
    const g = d3.select('#map-container svg g');
    const imgWidth = 3000;
    const imgHeight = 1500;

    const tooltip = d3.select("#tooltip");

    // Add exoplanet markers with custom shapes
    g.selectAll('.planet-marker')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'planet-marker')
        .attr('d', d => getCustomShape(d))
        .attr('transform', d => {
            d.x = Math.random() * imgWidth;
            d.y = Math.random() * imgHeight;
            return `translate(${d.x}, ${d.y})`;
        })
        .attr('fill', d => adjustMarkerColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('display', 'none')
        .on('mouseover', (event, d) => {
            tooltip.style("display", "block").html(`<strong>  ${d.name || 'Unknown'}</strong>`);
        })
        .on('mousemove', (event) => {
            const zoomTransform = d3.zoomTransform(g.node());
        
            // Adjust the tooltip position based on the current transformation scale and offset
            const adjustedX = (event.pageX - zoomTransform.x) / zoomTransform.k;
            const adjustedY = (event.pageY - zoomTransform.y) / zoomTransform.k;
        
            tooltip
                .style('top', (event.pageY + 15) + 'px')  // Use pageY for positioning relative to the document
                .style('left', (event.pageX + 15) + 'px') // Use pageX for positioning relative to the document
                .style('display', 'block');
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

//  categorizePlanet function 
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
function showExoplanetInfo(planet) {
    const panel = document.getElementById('planet-info-panel');
    const planetDetails = document.getElementById('planet-details');
    const moreInfoBtn = document.getElementById('more-info-btn'); // The button

    // Fill the panel with exoplanet information
    document.getElementById('planet-name').textContent = planet.name || 'Unknown';
    planetDetails.innerHTML = `
        <p><strong>Category:</strong> ${categorizePlanet(planet)}</p>
        <p><strong>Distance:</strong> ${planet['system_distance'] || 'Unknown'} light-years</p>
        <p><strong>Discovery Year:</strong> ${planet['discoveryyear']}</p>
        <p><strong>Temperature:</strong> ${planet['temperature'] || planet['hoststar_temperature']} K</p>
        <p><strong>Radius:</strong> ${planet['radius']} Earth radii</p>
        <p><strong>Mass:</strong> ${planet['mass']} Jupiter masses</p>
    `;

    // Show the panel
    panel.style.display = 'block';

    // Show the button when a planet is selected
    moreInfoBtn.style.display = 'block';
}







// Ensure this function runs after rendering the legend elements
createLegendSymbols();



// Initial call to set the correct button text on page load
updateSelectAllButton();

// Call the function to create zoomable SVG container
initializeZoomPan();

// Call the function to fetch exoplanet data
fetchExoplanets();

window.addEventListener('DOMContentLoaded', function() {
    // Make the function globally accessible
    window.scrollToChart = function() {
        document.getElementById('chart-section').scrollIntoView({ behavior: 'smooth' });
    };
});

