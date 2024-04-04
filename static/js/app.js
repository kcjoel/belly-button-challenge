const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Function to initialize the page
function init() {

    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Load the data from the provided URL
    d3.json(url).then(function (data) {
        console.log(data);

        // Extract names from the data
        let names = data.names;

        // Populate the dropdown menu with options
        names.forEach(function (name) {
            dropdownMenu.append('option').text(name).property('value', name);
        });

        // Set the initial selected name to the first one
        let name = names[0];

        // Call functions to create visualizations
        bar(name);
        bubble(name);
        info(name);
    });
}

// Function to create a bar chart
function bar(value) {
    d3.json(url).then(function (data) {

        // Extract samples data from the loaded data
        let samples = data.samples;

        // Filter samples data based on the selected value
        let filteredData = samples.filter(function (sample) {
            return sample.id === value;
        });

        // Extract the sample data for the first item in the filtered data
        let sampleData = filteredData[0];

        // Create a bar chart trace
        let traceBar = [{
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: 'h'
        }];

        // Create a new bar chart using Plotly
        Plotly.newPlot('bar', traceBar);
    });
}

// Function to create a bubble chart
function bubble(value) {
    d3.json(url).then(function (data) {

        // Extract samples data from the loaded data
        let samples = data.samples;

        // Filter samples data based on the selected value
        let filteredData = samples.filter(function (sample) {
            return sample.id === value;
        });

        // Extract the sample data for the first item in the filtered data
        let sampleData = filteredData[0];

        // Create a bubble chart trace
        let traceBubble = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                color: sampleData.otu_ids,
                size: sampleData.sample_values
            }
        };

        // Create a new bubble chart using Plotly
        Plotly.newPlot('bubble', [traceBubble]);
    });
}

// Function to display information in the metadata panel
function info(value) {

    d3.json(url).then(function (data) {

        // Extract metadata from the loaded data
        let metadata = data.metadata;

        // Filter metadata based on the selected value
        let filteredData = metadata.filter(function (meta) {
            return meta.id == value;
        });

        // Extract the metadata for the first item in the filtered data
        let obj = filteredData[0];

        // Convert metadata into key-value pairs
        let entries = Object.entries(obj);

        // Clear existing content in the metadata panel
        d3.select("#sample-metadata").html("");

        // Display metadata information in the panel
        entries.forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}

// Function to handle the event when the dropdown option changes
function optionChanged(value) {
    
    // Call functions to update visualizations based on the selected value
    info(value);
    bar(value);
    bubble(value);
}

// Call the init function to set up the initial state of the page
init();