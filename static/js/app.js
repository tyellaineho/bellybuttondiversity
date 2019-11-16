function buildMetadata(sample) {

  const url = `/metadata/${sample}`
  // @TODO: Complete the following function that builds the metadata panel
 
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    d3.json(url).then(function(data) {

      const panelData = d3.select("#sample-metadata");
      panelData.html("");

      Object.entries(data).forEach(([key, value]) => {
        panelData.append("h6").text(`${key}: ${value}`)
      })

    });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  const url = `/samples/${sample}`
  
  d3.json(url).then(function(data) {
    console.log(data);

    const sampleValSlice = data.sample_values.slice(0,10);
    const otuIdsSlice = data.otu_ids.slice(0,10);
    const otuLabelSlice = data.otu_labels.slice(0,10);

    const pieTrace = {
      labels: otuIdsSlice,
      values: sampleValSlice,
      hovertext: otuLabelSlice,
      names: otuLabelSlice,
      type: "pie"
    };


    const pieData = [pieTrace];

    const layout = {
      title: "Pie Chart"
    };

    Plotly.newPlot("pie", pieData, layout);

    const bubbleTrace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
      size: data.sample_values,
      color: data.otu_ids},
      text: data.otu_labels
    };

    console.log(data.sample_values)
    const bubbleData = [bubbleTrace]

    const layout2 = {
      title: "Bubble Chart"
    };


    Plotly.newPlot("bubble", bubbleData, layout2);

  });

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
