const API_URL = 'https://raw.githubusercontent.com/OpenExoplanetCatalogue/oec_tables/master/comma_separated/open_exoplanet_catalogue.txt';
let exoplanetData = [];

// Function to fetch and parse exoplanet data from the API
const fetchExoplanets = async () => {
    if (exoplanetData.length > 0) return exoplanetData; // Return cached data if already fetched

    try {
        const response = await fetch(API_URL);
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
        exoplanetData = parsedData;
        return exoplanetData;
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
        return [];
    }
};

export { fetchExoplanets };
