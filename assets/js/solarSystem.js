let planetsData; // Global variable to store planet data
let timer; // Global variable to store the timer
let paused = false; // To keep track of pause/resume state
let lastElapsedTime = 0; // To store the time when paused
let startTime = 0; // To store the actual start time of the animation
let selectedOrbit = null; // Keep track of the currently selected orbit
let orbitsVisible = true; // Track if orbits are visible

async function fetchPlanets() {
    const loadingContainer = document.getElementById('loading-container');
    const solarSystemSvg = document.getElementById('solarSystem');

    // Show the loading container initially
    loadingContainer.style.display = 'flex';
    solarSystemSvg.style.display = 'none';

    try {
        const endpoint = 'https://api.le-systeme-solaire.net/rest/bodies/';
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        planetsData = data.bodies.filter(body => body.isPlanet);

        // Hide loading container and show the SVG
        loadingContainer.style.display = 'none';
        solarSystemSvg.style.display = 'block';

        return planetsData;
    } catch (error) {
        console.error("Error fetching data:", error);
        loadingContainer.innerHTML = "<p>Failed to load data. Please try again later.</p>";
    }
}

//function for interactivity for solar system
function setupSVG() {
    const svg = d3.select('#solarSystem')
        .attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const centerX = width / 2;
    const centerY = height / 2;

    const container = svg.append('g').attr('id', 'container');

    const boundaryWidth = width * 1.5;
    const boundaryHeight = height * 1.5;

    const zoom = d3.zoom()
        .scaleExtent([1, 5]) // Set zoom boundaries
        .on('zoom', (event) => {
            const transform = event.transform;
            const scale = transform.k;

            // Calculate dynamic panning limits based on zoom level
            const maxPanX = ((boundaryWidth * scale) - width) / 2;
            const maxPanY = ((boundaryHeight * scale) - height) / 2;

            // Apply clamping to restrict panning within bounds
            const limitedX = Math.max(Math.min(transform.x, maxPanX), -maxPanX);
            const limitedY = Math.max(Math.min(transform.y, maxPanY), -maxPanY);

            // Apply clamped transform to the container
            container.attr('transform', `translate(${limitedX}, ${limitedY}) scale(${scale})`);
            document.getElementById('zoom_slider').value = scale;
        });

    svg.call(zoom);

    // Zoom controls
    document.getElementById('zoom_in').addEventListener('click', () => adjustZoom(1.1, zoom, svg));
    document.getElementById('zoom_out').addEventListener('click', () => adjustZoom(0.9, zoom, svg));
    document.getElementById('zoom_slider').addEventListener('input', function () {
        updateZoom(parseFloat(this.value), zoom, svg);
    });

    // Fetch and render planets
    fetchPlanets().then(planets => {
        renderPlanets(planets, container, centerX, centerY);
        startTime = Date.now(); // Capture the start time
        animatePlanets(planets, container, centerX, centerY); // Call animation function
    });

    // Add event listeners for pause, resume, and toggle buttons
    document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
    document.getElementById('resumeBtn').addEventListener('click', resumeAnimation);
}

//function to reset positioning of solar system
function resetSolarSystem() {
    // Reset zoom and pan to initial view
    d3.select('#solarSystem')
        .transition()
        .duration(500)
        .call(d3.zoom().transform, d3.zoomIdentity); // Reset to initial zoom and pan
 // Update the zoom slider value to the default (assuming default is 1)
 document.getElementById('zoom_slider').value = 1;
    // Clear and re-render planets
    d3.select('#container').remove(); // Remove existing content
    setupSVG(); // Re-initialize and re-render the solar system
    // Set checkboxes to their default checked state
    document.getElementById('toggleOrbitsCheckbox').checked = true;
    document.getElementById('toggleLabelsCheckbox').checked = true;

    // Show orbits and labels based on the reset checkbox values
    d3.selectAll('circle.orbit').style('display', 'block'); // Show orbits
    d3.selectAll('.planet-label').style('visibility', 'visible'); // Show labels

    // Reset the Pause/Resume button to "Pause" state if animation is running
    paused = false;
    document.getElementById('pauseBtn').style.display = 'inline';
    document.getElementById('resumeBtn').style.display = 'none';

    // Hide the orbit and planet detail panels
    d3.select("#orbit-info-box").style("display", "none");
    d3.select("#planet-details-panel").style("display", "none");
}
document.getElementById('resetBtn').addEventListener('click', resetSolarSystem);



document.getElementById('toggleOrbitsCheckbox').addEventListener('change', function () {
    let isChecked = this.checked;

    // Show or hide orbits based on the checkbox state
    d3.selectAll('circle.orbit').style('display', isChecked ? 'block' : 'none');

    // Add event listener to toggle planet labels
    document.getElementById('toggleLabelsCheckbox').addEventListener('change', togglePlanetLabels);
});




// Define colors for each planet based on its name
const planetColors = {
    Mercury: "#aaaaaa", // Grey
    Venus: "#ffcc00", // Yellow
    Earth: "#0099ff", // Blue
    Mars: "#cc0000", // Red
    Jupiter: "#ff9900", // Orange
    Saturn: "#ffd700", // Gold
    Uranus: "#66ccff", // Light Blue
    Neptune: "#0000cc", // Dark Blue
    Pluto: "#eeeeee"  // Light Grey (if considered a planet in your data)
};

function renderPlanets(planets, container, centerX, centerY) {

    // Add the Sun at the center
    container.append("circle")
        .attr("class", "sun")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 30)
        .style("fill", "yellow")
        .attr("r", 30);; //glow effect 



    const scaleDistance = d3.scaleLinear()
        .domain([0, d3.max(planets, d => d.semimajorAxis)])
        .range([100, Math.min(centerX, centerY) - 50]); // Increased distance

    const scaleSize = d3.scaleSqrt()
        .domain([0, d3.max(planets, d => d.meanRadius)])
        .range([5, 20]); // Adjusted size

    // Create orbit circles
    const orbitSelection = container.selectAll("circle.orbit")
        .data(planets)
        .enter()
        .append("circle")
        .attr("class", "orbit")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", d => scaleDistance(d.semimajorAxis))
        .style("fill", "none")
        .style("stroke", "white")
        .style("stroke-opacity", "0.5")
        .style("stroke-dasharray", "8,3")
        .style("cursor", "pointer");

    // Add hover interaction to orbit lines
    orbitSelection
        .on("mouseover", function (event, d) {
            if (selectedOrbit !== this) {  // Only apply hover effect if it's not the selected orbit
                d3.select(this)
                    .style("stroke", "white") // Change color on hover
                    .style("stroke-width", "2.5px") // Thicken the stroke for emphasis
                    .style("stroke-opacity", "1.0") // Make it fully opaque
                    ;
            }
        })
        .on("mouseout", function (event, d) {
            if (selectedOrbit !== this) {  // Only revert if it's not the selected orbit
                d3.select(this)
                    .style("stroke", "white") // Revert to original color
                    .style("stroke-width", "1px") // Revert stroke width
                    .style("stroke-opacity", "0.5"); // Revert opacity
            }
        })
        .on("click", function (event, d) {
            if (selectedOrbit) {
                // Reset the previously selected orbit's style
                d3.select(selectedOrbit)
                    .style("stroke", "white")
                    .style("stroke-width", "1px")
                    .style("stroke-opacity", "0.5");
            }

            // Highlight the clicked orbit
            selectedOrbit = this;
            d3.select(this)
                .style("stroke", "yellow")
                .style("stroke-width", "3px")
                .style("stroke-opacity", "1.0");

            showOrbitDetails(d); // Display orbit details in the info box
        });

    // Create planet circles (same as before)
    const planetSelection = container.selectAll("circle.planet")
        .data(planets)
        .enter()
        .append("circle")
        .attr("class", "planet")
        .attr("r", d => scaleSize(d.meanRadius))
        .style("fill", d => planetColors[d.englishName] || "gray") // Apply colors
        .style("filter", "url(#glow)")
        .style("cursor", "pointer");

    // Add hover interaction for planets (same as before)
    planetSelection
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", d => scaleSize(d.meanRadius) * 1.5)
                .style("filter", "url(#glow)")
                .style("stroke", "white")
                .style("stroke-width", "2px");


        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", d => scaleSize(d.meanRadius))
                .style("stroke-width", "0px");

            d3.select('#tooltip').style('display', 'none');
        })

        .on("click", function (event, d) {
            // Show planet details when clicked
            showPlanetDetails(d);
        });


    // Create planet name labels
    const planetLabels = container.selectAll("text.planet-label")
        .data(planets)
        .enter()
        .append("text")
        .attr("class", "planet-label")
        .attr("x", centerX) // Set initial x position
        .attr("y", centerY) // Set initial y position
        .attr("text-anchor", "middle")
        .attr("dy", "-1em") // Position the text slightly above the planet
        .style("fill", "white")
        .style("font-size", "12px")
        .style("visibility", document.getElementById('toggleLabelsCheckbox').checked ? 'visible' : 'hidden') // Toggle based on checkbox
        .text(d => d.englishName); // Add the planet name

    // Add a label for the Sun
    container.append("text")
        .attr("class", "sun-label")
        .attr("x", centerX)
        .attr("y", centerY - 40) // Adjust the position above the Sun
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "12px")
        .text("Sun");



}

// Function to display orbit details in the info box
function showOrbitDetails(planet) {
    const speed = (2 * Math.PI * planet.semimajorAxis) / planet.sideralOrbit;

    const infoBox = d3.select("#orbit-info-box");

    // Set the background color of the info box to match the planet's color
    infoBox.style("display", "block")
        .style("border-left", `3px solid ${planetColors[planet.englishName] || "gray"}`)
        .html(`
                <button id="closeInfoBox" onclick="hideInfoBox()">&#x2715;</button> <!-- X symbol for close -->
                <h3>Orbit Details for ${planet.englishName}</h3>
                 <p><b>Eccentricity:</b> ${planet.eccentricity}</p>
                 <p><b>Semi-major Axis:</b> ${planet.semimajorAxis.toLocaleString()} km</p>
                 <p><b>Orbital Period:</b> ${planet.sideralOrbit} days</p>
                 <p><b>Orbital Speed:</b> ${speed.toFixed(2)} km/day</p>
                 <p><b>Inclination:</b> ${planet.inclination} degrees</p>
            `);
}

// Function to hide the info box and deselect orbit
function hideInfoBox() {
    d3.select("#orbit-info-box").style("display", "none");
    if (selectedOrbit) {
        // Revert the style of the selected orbit
        d3.select(selectedOrbit)
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .style("stroke-opacity", "0.5");
        selectedOrbit = null; // Clear the selected orbit
    }
}


// Function to display planet details in a panel with clickable image
function showPlanetDetails(planet) {
    const planetImageSrc = `/WSOA3029A_2549309/assets/images/planets/${planet.englishName.toLowerCase()}.png`; // Path to planet images
    const planetColor = planetColors[planet.englishName] || "gray"; // Get the planet color from the planetColors object

    const planetDetailsPanel = d3.select("#planet-details-panel");
    planetDetailsPanel.style("display", "block")
        .style("border-left", `3px solid ${planetColor}`) // Set border-left to planet color
        .html(`
            <button id="closePlanetDetails" onclick="hidePlanetDetails()">&#x2715;</button> <!-- Close button -->
           

                      <h3>Planet ${planet.englishName}</h3>
                       <a href="#" id="planetImageLink" target="_blank" title="Click to learn more!">
                    <img src="${planetImageSrc}" alt="${planet.englishName}" id="planetImage" class="pulse-animation" >
                </a>
                      <p><b>Radius:</b> ${planet.meanRadius} km</p>
                      <p><b>Mass:</b> ${planet.mass.massValue} x 10^${planet.mass.massExponent} kg</p>
                      <p><bDensity:</b> ${planet.density} g/cm³</p>
                      <p><b>Gravity:</b> ${planet.gravity} m/s²</p>
                      <p><b>Distance from Sun:</b> ${planet.perihelion.toLocaleString()} km</p>
                      <p><b>Temperature: </b>${planet.avgTemp} K</p>
             
        `);

    // Ensure the link is in the DOM before adding attributes
    const planetLinkElement = document.getElementById('planetImageLink');
    if (planetLinkElement) {
        // Update the link dynamically to point to an external site with more planet images
        const externalImageLink = `https://solarsystem.nasa.gov/planets/${planet.englishName.toLowerCase()}/overview/`; // Example link to NASA's page for each planet
        planetLinkElement.setAttribute('href', externalImageLink);
    } else {
        console.error('Planet image link element not found!');
    }
}



// Function to close the planet details panel
function closePlanetDetails() {
    const detailsPanel = d3.select("#planet-details-panel");
    detailsPanel.style("display", "none");
}

function togglePlanetLabels() {
    const showLabels = document.getElementById('toggleLabelsCheckbox').checked;
    d3.selectAll(".planet-label")
        .style("visibility", showLabels ? 'visible' : 'hidden');
}
function hidePlanetDetails() {
    d3.select("#planet-details-panel").style("display", "none");
}

// Animation function (unchanged)
function animatePlanets(planets, container, centerX, centerY) {
    const scaleDistance = d3.scaleLinear()
        .domain([0, d3.max(planets, d => d.semimajorAxis)])
        .range([100, Math.min(centerX, centerY) - 50]);

    const timeScale = d3.scaleLinear().domain([0, 1000]).range([0, 100000]); // Adjust this value for slower animation speed

    const planetSelection = container.selectAll(".planet");
    const planetLabels = container.selectAll(".planet-label"); // Select the planet labels

    if (timer) {
        timer.stop();
    }

    timer = d3.timer(function (elapsed) {
        const totalElapsed = lastElapsedTime + elapsed; // Calculate total elapsed time since start

        planetSelection
            .attr("cx", function (d) {
                const angle = (totalElapsed / timeScale(d.sideralOrbit)) * 2 * Math.PI; // Calculate angle based on orbital period
                const x = centerX + scaleDistance(d.semimajorAxis) * Math.cos(angle);
                return x;
            })
            .attr("cy", function (d) {
                const angle = (totalElapsed / timeScale(d.sideralOrbit)) * 2 * Math.PI;
                const y = centerY + scaleDistance(d.semimajorAxis) * Math.sin(angle);
                return y;
            });

        // Update planet labels to follow planets
        planetLabels

            .attr("x", function (d) {
                const angle = (totalElapsed / timeScale(d.sideralOrbit)) * 2 * Math.PI;
                const x = centerX + scaleDistance(d.semimajorAxis) * Math.cos(angle);
                return x;
            })
            .attr("y", function (d) {
                const angle = (totalElapsed / timeScale(d.sideralOrbit)) * 2 * Math.PI;
                const y = centerY + scaleDistance(d.semimajorAxis) * Math.sin(angle);
                return y - 20; // Position the text slightly above the planet
            });
    });
}

function togglePlanetLabels() {
    const showLabels = document.getElementById('toggleLabelsCheckbox').checked;
    d3.selectAll(".planet-label,.sun-label")
        .style("visibility", showLabels ? 'visible' : 'hidden');
}


// Pause the animation (unchanged)
function pauseAnimation() {
    if (!paused) {
        lastElapsedTime += Date.now() - startTime; // Manually calculate elapsed time when paused
        timer.stop(); // Stop the timer
        paused = true;
        document.getElementById('pauseBtn').style.display = 'none'; // Hide pause button
        document.getElementById('resumeBtn').style.display = 'inline'; // Show resume button
    }
}

// Resume the animation (unchanged)
function resumeAnimation() {
    if (paused) {
        paused = false;
        startTime = Date.now(); // Reset start time to now for correct elapsed time
        animatePlanets(planetsData, d3.select('#container'), window.innerWidth / 2, window.innerHeight / 2); // Restart animation
        document.getElementById('resumeBtn').style.display = 'none'; // Hide resume button
        document.getElementById('pauseBtn').style.display = 'inline'; // Show pause button
    }
}

function adjustZoom(scaleFactor, zoom, svg) {
    svg.transition()
        .duration(500)
        .call(zoom.scaleBy, scaleFactor);
}

function updateZoom(newScale, zoom, svg) {
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const centerX = width / 2;
    const centerY = height / 2;
    const newTransform = d3.zoomIdentity.translate(centerX, centerY).scale(newScale).translate(-centerX, -centerY);
    svg.transition().duration(500).call(zoom.transform, newTransform);
}

document.addEventListener('DOMContentLoaded', setupSVG);
