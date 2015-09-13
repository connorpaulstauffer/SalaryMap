function initialize () {
  var width = 960, height = 600;

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);


  function renderMap (occupation) {
    var occupation = occupation || "All Occupations";
    var stateData = [];
    d3.json("data.json", function (error, data) {
      if (error) throw error;
      stateData = data["occupations"][occupation]
      if (!data) throw error;

      d3.json("united_states_paths.json", function (error, paths) {
        if (error) throw error;
        svg.selectAll(".state")
  			   .data(paths).enter().append("path").attr("class","state")
           .attr("d", function (d) { return d.d; })
  			   .style({
             "fill": "green",
             "stroke": "white",
             "fill-opacity": function (d) { return stateData[d.n]["distribution"]}
           })
           .on("mouseover", handleMouseOver)
           .on("mouseout", handleMouseOut)
      });
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
