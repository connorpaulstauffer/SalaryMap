function initialize () {
  var width = 960, height = 600;

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);


  function renderMap (occupation) {
    var occupation = occupation || "All Occupations";
    var stateData = getStateData(occupation);
    var minMax = findMinMax(stateData);

    d3.json("united_states_paths.json", function (error, paths) {
      if (error) throw error;
      // for (var i = 0; i < paths.length; i++) {
      //   paths[i]
      svg.selectAll(".state")
			   .data(paths).enter().append("path").attr("class","state")
         .attr("d", function (d) { return d.d; })
			   .style({ "fill": "grey", "stroke": "white" })
         .on("mouseover", handleMouseOver)
         .on("mouseout", handleMouseOut)
      // }
    });
  };

  function findMinMax (stateData) {
    var min = null, max = null;

    for (var i = 0; i < stateData.length; i++) {
      var salary = parseInt(states[i]["average_salary"]);
      if (!min || salary < min) { min = salary; }
      if (!max || salary > max) { max = salary; }
    }

    return [min, max];
  };

  function getStateData (occupation) {
    var data = [];

    d3.json("data.json", function (error, data) {
      if (error) throw error;
      data = data["occupations"][occupation]
      if (!data) throw error;
    })

    return data;
  };

  function handleMouseOver () {
    d3.select(this.parentNode.appendChild(this)).style({"stroke": "blue"})
  };

  function handleMouseOut () {
    d3.select(this).style({"stroke": "white"})
  };

  renderMap();
};
