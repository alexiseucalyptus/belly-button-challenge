// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(obj => obj.id == sample);
    var result = resultArray[0];


    // Use d3 to select the panel with id of `#sample-metadata`
var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

// function to build both charts
// Get the samples field
    // Filter the samples for the object with the desired sample number
    // Get the otu_ids, otu_labels, and sample_values
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

          var samples = data.samples;
          var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
  
          var otu_ids = result.otu_ids;
          var otu_labels = result.otu_labels;
          var sample_values = result.sample_values;


    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
    }];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", barData, barLayout);


    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get names field
        var names = data.names;
    
        // Select dropdown menu
        var dropdownMenu = d3.select("#selDataset");
    
        // Populate dropdown with sample names
        names.forEach((sample) => {
          dropdownMenu.append("option").text(sample).property("value", sample);
        });
    
        // Get the first sample from the list to build initial plots
        var firstSample = names[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
    }
    
    // Function to handle change in dropdown
    function optionChanged(newSample) {
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
    }
    
    // Initialize the dashboard
    init();