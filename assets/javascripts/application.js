function initialize () {
  var width = 960, height = 600;

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("united_states_paths.json", function (error, paths) {
    if (error) throw error;
    for (var i = 0; i < paths.length; i++) {
      paths[i]
      svg.selectAll(".state")
			   .data(paths).enter().append("path").attr("class","state")
         .attr("d",function(d){ return d.d;})
			   .style({"fill": "grey", "stroke": "white"})
         .on("mouseover", handleMouseOver)
         .on("mouseout", handleMouseOut)
    }
  });

  function renderMap (occupation) {
    occupation = occupation || "All Occupations";
    maxMin = findMaxMin(occupation);
  };

  function findMaxMin (occupation) {
    d3.json("data.json", function (error, data) {
      if (error) throw error;
      debugger;
    })
  };

  function handleMouseOver () {
    d3.select(this.parentNode.appendChild(this)).style({"stroke": "blue"})
  };

  function handleMouseOut () {
    d3.select(this).style({"stroke": "white"})
  };

  renderMap();
};
