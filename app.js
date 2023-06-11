// Read in the JSON file using D3
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function(data) {
    // Verify Data
    console.log(data);

    // Get the dropdown element
    var dropdown = d3.select("#selDataset");

    // Get the sample names
    var sampleNames = data.names;

    // Add options to the dropdown menu
    dropdown
      .selectAll("option")
      .data(sampleNames)
      .enter()
      .append("option")
      .text(function(d) { return d; })
      .attr("value", function(d) { return d; });

    // Set the initial sample value
    var initialSample = sampleNames[0];

    // Call the updateDashboard function with the initial sample value
    updateDashboard(initialSample, data);

    // Event listener for dropdown selection change
    dropdown.on("change", function() {
      var selectedSample = dropdown.property("value");
      updateDashboard(selectedSample, data);
    });

    // Function to update the dashboard based on the selected sample
    function updateDashboard(sample, data) {
      // Find the selected sample's data
      var selectedSample = data.samples.find(function(d) {
        return d.id === sample;
      });

      // Update the bar chart
      updateBarChart(selectedSample);

      // Update the bubble chart
      updateBubbleChart(selectedSample);

      // Find the selected sample's metadata
      var selectedMetadata = data.metadata.find(function(d) {
        return d.id.toString() === sample;
      });

      // Update the gauge chart
      updateGaugeChart(selectedMetadata);

      // Select the sample metadata element
      var sampleMetadata = d3.select("#sample-metadata");

      // Clear any existing metadata
      sampleMetadata.html("");

      // Add the metadata information as paragraphs
      Object.entries(selectedMetadata).forEach(function([key, value]) {
        sampleMetadata.append("p").text(`${key}: ${value}`);
      });
    }

    // Function to update the bar chart based on the selected sample
    function updateBarChart(selectedSample) {
      // Sort the data by sample values in descending order and get the top 10
      var top10 = selectedSample.sample_values.slice(0, 10).reverse();
      var top10Labels = selectedSample.otu_ids.slice(0, 10).reverse().map(function(id) {
        return `OTU ${id}`;
      });
      var top10HoverText = selectedSample.otu_labels.slice(0, 10).reverse();

      // Create and format the bar chart
      var trace = {
        x: top10,
        y: top10Labels,
        text: top10HoverText,
        type: "bar",
        orientation: "h"
      };

      var layout = {
        xaxis: {},
        yaxis: {},
        width: 400
      };

      var chartData = [trace];

      Plotly.newPlot("bar", chartData, layout);
    }

    // Function to update the bubble chart based on the selected sample
    function updateBubbleChart(selectedSample) {
      // Create the bubble chart
      var trace = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: 'markers',
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids
        }
      };

      var layout = {
        xaxis: { title: "OTU ID" },
        yaxis: {},
        width: 1250
      };

      var chartData = [trace];

      Plotly.newPlot("bubble", chartData, layout);
    }

  // Function to update the gauge chart based on the selected sample's metadata
function updateGaugeChart(selectedMetadata) {
  // Get the weekly washing frequency from the metadata
  var washingFrequency = selectedMetadata.wfreq;

// Create the gauge chart trace
var trace = {
  type: "indicator",
  mode: "gauge+number",
  value: washingFrequency,
  title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
  gauge: {
    axis: {
      range: [null, 9],
      tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      ticktext: ["","0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
      tickmode: "array",
      tickfont: { size: 12 }
    },
    bar: { color: "darkblue" },
    bgcolor: "white",
    borderwidth: 2,
    bordercolor: "gray",
    steps: [
      { range: [0, 1], color: "rgba(0, 128, 0, 0.2)" },
      { range: [1, 2], color: "rgba(0, 128, 0, 0.4)" },
      { range: [2, 3], color: "rgba(0, 128, 0, 0.6)" },
      { range: [3, 4], color: "rgba(0, 128, 0, 0.8)" },
      { range: [4, 5], color: "rgba(0, 128, 0, 1.0)" },
      { range: [5, 6], color: "rgba(128, 255, 0, 1.0)" },
      { range: [6, 7], color: "rgba(255, 128, 0, 0, 1.0)" },
      { range: [7, 8], color: "rgba(255, 0, 0, 1.0)" },
      { range: [8, 9], color: "rgba(165, 42, 42, 1.0)" }
    ]
  }
};

var chartData = [trace];

var layout = {
  width: 500,
  height: 500,
  margin: { t: 0, b: 0 }, 
};

Plotly.newPlot("gauge", chartData, layout);
}});
