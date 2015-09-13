function initialize () {
  setupContainer();
  loadMapData();
  loadOccupationData(function () {
    setupCategories();
    renderMap();
  });
};

function loadMapData () {
  d3.json("united_states_paths.json", function (error, paths) {
    if (error) throw error;
    window.mapData = paths;
  })
};

function loadOccupationData (callback) {
  d3.json("data.json", function (error, data) {
    if (error) throw error;
    window.occupationData = data;
    callback();
  })
};

function setupContainer () {
  var width = 960, height = 600;

  var svg = d3.select("#map-container").append("svg")
      .attr("width", width)
      .attr("height", height);
};

function renderMap () {
  var occupation = "All Occupations";
  var stateData = window.occupationData["occupations"][occupation]

  d3.select("svg").selectAll(".state")
	   .data(window.mapData).enter().append("path").attr("class","state")
     .attr("d", function (d) { return d.d; })
	   .style({
       "fill": "green",
       "stroke": "white",
       "fill-opacity": function (d) { return stateData[d.n]["distribution"] }
     })
    //  .on("mouseover", handleMouseOver)
    //  .on("mouseout", handleMouseOut)
};

function updateMap (occupation) {
  var stateData = window.occupationData["occupations"][occupation]

  d3.select("svg").selectAll(".state")
	   .data(window.mapData).style({
       "fill": function (d) {
         if (stateData[d.n]) {
           return "green";
         } else {
           return "grey";
         }
       },
       "stroke": "white",
       "fill-opacity": function (d) {
         if (stateData[d.n]) {
           return stateData[d.n]["distribution"]
         } else {
           return 0.5
         }
       }
     })
};

function setupCategories () {
  var categories = window.occupationData["categories"]
  var keys = Object.keys(categories)
  var dropdown = document.getElementById("category-dropdown")
  for (var i = 0; i < keys.length; i++) {
    var category = keys[i];
    var option = document.createElement("option");
    var categoryNode = document.createTextNode(category);
    option.appendChild(categoryNode);
    option.setAttribute("value", category);
    dropdown.appendChild(option);
  }
  setupOccupations();
  dropdown.addEventListener("change", setupOccupations, false);
};

function setupOccupations () {
  var categories = window.occupationData["categories"]
  var categoryDropdown = document.getElementById("category-dropdown");
  var selected = categoryDropdown.options[categoryDropdown.selectedIndex].value;

  var occupationDropdown = document.getElementById("occupation-dropdown");
  occupationDropdown.innerHTML = "";

  if (selected == "All Categories") {
    var rootValue = "All Occupations";
    var rootText = "All Occupations";
  } else {
    var rootValue = selected;
    var rootText = "All " + selected;
  }

  var option = document.createElement("option");
  var rootOccupationNode = document.createTextNode(rootText);
  option.appendChild(rootOccupationNode);
  option.setAttribute("value", rootValue);
  occupationDropdown.appendChild(option);

  var occupations = categories[selected];
  for (var i = 0; i < occupations.length; i++) {
    var occupation = occupations[i];
    var option = document.createElement("option");
    var occupationNode = document.createTextNode(occupation);
    option.appendChild(occupationNode);
    option.setAttribute("value", occupation);
    occupationDropdown.appendChild(option);
  }
  updateMap(occupationDropdown.options[occupationDropdown.selectedIndex].value);
  occupationDropdown.addEventListener("change", function (event) {
    var occupation = event.target.options[event.target.selectedIndex].value;
    updateMap(occupation);
  }, false);
};

function handleMouseOver () {
  d3.select(this.parentNode.appendChild(this)).style({"stroke": "blue"})
};

function handleMouseOut () {
  d3.select(this).style({"stroke": "white"})
};
