function initialize () {
  document.getElementById("content")
    .setAttribute("style", "height:" + (window.innerHeight - 35) + "px");
  setupContainer();
  loadMapData();
  loadOccupationData(function () {
    renderMap();
    setupCategories();
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
      .attr("height", height)
      .attr("id", "map-svg")
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg");
};

function renderMap () {
  d3.select("svg").selectAll(".state")
	   .data(window.mapData).enter().append("path").attr("class","state")
     .attr("d", function (d) { return d.d; })
     .attr("state", function (d) { return d.n })
     .on("mouseover", handleMouseOver)
     .on("mouseout", handleMouseOut)
};

function updateMap () {
  var stateData = window.occupationData["occupations"][window.occupation]["states"]
  var states = document.getElementsByClassName("state");
  for (var i = 0; i < states.length; i++) {
    var stateNode = states[i];
    var state = stateNode.getAttribute("state");
    if (stateData[state]) {
      stateNode.style.fill = d3.interpolateRgb("#E8F0E9", "#216C2A")(stateData[state]["distribution"]);
    } else {
      stateNode.style.fill = "grey";
    }
    stateNode.style.stroke = "white";
  }
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
  window.occupation = occupationDropdown.options[occupationDropdown.selectedIndex].value
  setFigures();
  updateMap();
  occupationDropdown.addEventListener("change", function (event) {
    window.occupation = event.target.options[event.target.selectedIndex].value;
    updateMap();
    setFigures();
  }, false);
};

function setFigures () {
  identifiers = ["mean", "min", "max"];
  for (var i = 0; i < identifiers.length; i++) {
    var id = identifiers[i];
    var node = document.getElementById(id);
    var val = window.occupationData["occupations"][window.occupation]["data"][id];
    node.innerHTML = "$ " + withCommas(val);
  }
};

function withCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function handleMouseOver (event) {
  var state = this.getAttribute("state");
  var hash = window.occupationData["occupations"][window.occupation]["states"][state];
  if (hash) {
    var salary = hash["average_salary"];
  } else {
    var salary = "";
  }
  document.getElementById("hover-row").setAttribute("style", "visibility:visible")
  document.getElementById("hover-salary").innerHTML = "$ " + salary;
  document.getElementById("hover-state").innerHTML = state;
  d3.select(this.parentNode.appendChild(this)).style({"stroke": "#03AACC"});
};

function handleMouseOut () {
  document.getElementById("hover-row").setAttribute("style", "visibility:hidden")
  document.getElementById("hover-salary").innerHTML = ""
  d3.select(this).style({"stroke": "white"})
};
