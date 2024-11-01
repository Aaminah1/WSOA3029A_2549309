// bubbleChart.js
import { fetchExoplanets } from './dataManager.js';

let originalData = [];
let maxRadius = 0;
let maxTemperature = 0;

// Fetch data from the centralized script (dataManager.js)
fetchExoplanets().then((data) => {
    originalData = prepareDataset(data); // Prepare the dataset
    maxRadius = d3.max(originalData, d => d.radius); // Get max radius for x-axis
    maxTemperature = d3.max(originalData, d => d.temperature); // Get max temperature for y-axis
    createBubbleChart(originalData); // Create the initial chart
}).catch(error => console.error('Error fetching data:', error));

// Function to categorize planets based on given attributes
function categorizePlanet(planet) {
    const radius = planet.radius || 1; // Default to 1 Earth radius if missing
    const temperature = planet.temperature || planet.hoststar_temperature || 300; // Use host star temperature or default to 300K
    const mass = planet.mass || 1; // Default to 1 Jupiter mass

    // Define categories based on attributes
    if (radius < 1.5 && temperature > 250 && temperature < 350) {
        return 'Potentially Habitable';
    } else if (mass > 5 && temperature > 500) {
        return 'Hot Jupiter';
    } else if (mass > 10 && temperature < 100) {
        return 'Cold Giant';
    } else if (radius < 2) {
        return 'Rocky Planet';
    } else {
        return 'Other';
    }
}

// Function to filter and prepare the dataset (radius, temperature, and mass)
function prepareDataset(data) {
    return data
        .filter(planet => planet.radius && planet.hoststar_temperature && planet.mass) // Only include planets with valid radius, temp, and mass
        .map(planet => ({
            name: planet.name || 'Unknown',
            radius: planet.radius || 1, // Apply default value for radius
            temperature: planet.temperature || planet.hoststar_temperature || 300, // Apply default temperature
            mass: planet.mass || 1, // Apply default value for mass
            category: categorizePlanet(planet) // Categorize the planet
        }));
}

// Function to create the D3 interactive bubble chart with transition support
function createBubbleChart(data) {



    const margin = { top: 40, right: 30, bottom: 80, left: 80 }; // Adjusted margins for axis titles
    const width = document.getElementById('chart').clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart").html("") // Clear previous chart
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create fixed scales for x (radius), y (temperature), and bubble size (mass)
    const x = d3.scaleLinear()
        .domain([0, maxRadius]).nice()  // Fixed scale for radius based on the max value in the dataset
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, maxTemperature]).nice()  // Fixed scale for temperature based on the max value in the dataset
        .range([height, 0]);

    const bubbleSize = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.mass)])
        .range([5, 50]);

    /* // Create axes
     svg.append("g")
         .attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x))
         .append("text")
         .attr("y", 40)
         .attr("x", width / 2)
         .attr("text-anchor", "middle")
         .attr("stroke", "black")
         .text("Radius (Earth radii)");
         
 
     svg.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -60)
         .attr("x", -height / 2)
         .attr("dy", "1em")
         .attr("text-anchor", "middle")
         .attr("stroke", "black")
         .text("Temperature (K)");
 */
    // Tooltip for bubbles
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Bind data to bubbles, apply transition effects
    const bubbles = svg.selectAll(".bubble")
        .data(data, d => d.name); // Use planet name as the key for smooth transitions

    // Enter selection: append new bubbles
    bubbles.enter().append("circle")
        .attr("class", "bubble")
        .attr("cx", d => x(d.radius))
        .attr("cy", d => y(d.temperature))
        .attr("r", 0) // Start with radius 0 for smooth appearance
        .attr("fill", d => d3.interpolateCool(d.temperature / maxTemperature))  // Color based on temperature
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("opacity", 0) // Start with 0 opacity
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                    <div><strong>Exoplanet:</strong> ${d.name}</div>
                    <div><strong>Category:</strong> <b>${d.category}</b></div>
                    <div><strong>Radius:</strong> <b>${d.radius.toFixed(2)}</b> Earth radii</div>
                    <div><strong>Temperature:</strong> <b>${d.temperature}</b> K</div>
                    <div><strong>Mass:</strong> ${d.mass} Jupiter masses</div>
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition()
        .duration(750)
        .delay((d, i) => i * 3) // Delays for each bubble for cascading effect
        .attr("r", d => bubbleSize(d.mass)) // Animate radius growth
        .attr("opacity", 0.8);

    // Add hover behavior to the legend items
    d3.selectAll('#filters label').on('mouseover', function () {
        const hoveredCategory = d3.select(this).text().trim();

        // Highlight the bubbles of the hovered category
        svg.selectAll(".bubble")
            .transition()
            .duration(200)
            .style("opacity", d => d.category === hoveredCategory ? 1 : 0.1) // Highlight matching, fade others
            .attr("stroke", d => d.category === hoveredCategory ? "#FFD700" : "#333") // Highlight border
            .attr("stroke-width", d => d.category === hoveredCategory ? 2 : 1); // Increase border width for highlight
    })
        .on('mouseout', function () {
            // Reset bubble appearance on mouseout
            svg.selectAll(".bubble")
                .transition()
                .duration(200)
                .style("opacity", 0.8)
                .attr("stroke", "#333")
                .attr("stroke-width", 1);
        });
    // Add x-axis with hover for additional info
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    xAxis.append("text")
        .attr("y", 50) // Position it below the axis
        .attr("x", width / 2)
        .attr("text-anchor", "middle")

        .attr("class", "axis-label")
        .text("Radius (Earth radii)")
        .on("mouseover", function (event) {
            d3.select("#axis-tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 19}px`)
                .style("opacity", 1)
                .html("Radius of the exoplanet in Earth radii. The larger the radius, the bigger the planet.");
        })
        .on("mouseout", function () {
            d3.select("#axis-tooltip")
                .style("opacity", 0);
        });

    // Add y-axis with hover for additional info
    const yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    yAxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70) // Move the label further away
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")

        .attr("class", "axis-label")
        .text("Temperature (K)")
        .on("mouseover", function (event) {
            d3.select("#axis-tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`)
                .style("opacity", 1)
                .html("Temperature of the exoplanet in Kelvin. Higher values indicate hotter planets.");
        })
        .on("mouseout", function () {
            d3.select("#axis-tooltip")
                .style("opacity", 0);
        });

    // Tooltip container for the axis information
    d3.select("body").append("div")
        .attr("id", "axis-tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

}

// Filter logic
function applyFilters() {
    const showHabitable = document.getElementById("habitable-filter").checked;
    const showHotJupiter = document.getElementById("hot-jupiter-filter").checked;
    const showRocky = document.getElementById("rocky-filter").checked;
    const showOther = document.getElementById("other-filter").checked;

    const filteredData = originalData.filter(d =>
        (showHabitable && d.category === 'Potentially Habitable') ||
        (showHotJupiter && d.category === 'Hot Jupiter') ||
        (showRocky && d.category === 'Rocky Planet') ||
        (showOther && d.category === 'Other')
    );

    createBubbleChart(filteredData); // Update chart with filtered data
}

// Attach event listeners for filter checkboxes
document.getElementById("habitable-filter").addEventListener("change", applyFilters);
document.getElementById("hot-jupiter-filter").addEventListener("change", applyFilters);
document.getElementById("rocky-filter").addEventListener("change", applyFilters);
document.getElementById("other-filter").addEventListener("change", applyFilters);
