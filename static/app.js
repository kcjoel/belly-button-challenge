const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Function for initializing the page
function init() {
    //  Dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Loading URL data 
    d3.json(url).then(function (data) {
        console.log(data);
        // Extracting names from the data
        let names = data.names;

        // Populating the dropdown menu with options
        names.forEach(function (name) {
            dropdownMenu.append('option').text(name).property('value', name);
        });
        let name = names[0];
        // Call functions to create visualizations
        bar(name);
        bubble(name);
        info(name);
    });
}

// Bar chart Function
function bar(value) {
    d3.json(url).then(function (data) {
        // Extracting samples data 
        let samples = data.samples;
        // Filtering sample data based on value
        let filteredData = samples.filter(function (sample) {
            return sample.id === value;
        });
        // Extracting the sample data for the first item in the filtered data
        let sampleData = filteredData[0];
        // Creating a bar chart trace
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

//  Bubble chart Function
function bubble(value) {
    d3.json(url).then(function (data) {
        // Extracting samples data 
        let samples = data.samples;
        // Filtering samples data 
        let filteredData = samples.filter(function (sample) {
            return sample.id === value;
        });
        // Extracting the sample data for the first item in the filtered data
        let sampleData = filteredData[0];
        // Creating a bubble chart trace
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
        // Creating a new bubble chart using Plotly
        Plotly.newPlot('bubble', [traceBubble]);
    });
}

// Function to display metadata panel information
function info(value) {
    d3.json(url).then(function (data) {
        // Extracting metadata 
        let metadata = data.metadata;
        // Filtering metadata 
        let filteredData = metadata.filter(function (meta) {
            return meta.id == value;
        });
        // Extract the metadata for the first item in the filtered data
        let obj = filteredData[0];
        // Converting metadata into key-value pairs
        let entries = Object.entries(obj);
        // Clearing existing content in the metadata panel
        d3.select("#sample-metadata").html("");
        // Displaying metadata information in the panel
        entries.forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}

// Function to handle the dropdown option changes
function optionChanged(value) {
    // Calling functions to update visualizations based on the selected value
    info(value);
    bar(value);
    bubble(value);
}

// Call the init function to set up the initial state of the page
init();