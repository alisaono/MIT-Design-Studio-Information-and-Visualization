
//plot
var margin = {t: 5, r: 25, b: 20, l: 25}; //this is an object
var width = d3.select('#plot1').node().clientWidth - margin.r - margin.l,
    height = d3.select('#plot1').node().clientHeight - margin.t - margin.b;

// Append svg to div
var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b);

// function to draw the map
var mapPath = d3.geoPath();

var populationPerState = d3.map();

// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.csv, "data/data.csv", parseData)
    .defer(d3.json, "data/us_map.json") //downloaded from https://d3js.org/us-10m.v1.json
    .defer(d3.csv, "data/population.csv", parsePopulation) //downloaded from https://d3js.org/us-10m.v1.json
    .await(dataloaded);

function dataloaded (err,data,map){
    var popById = {}
    data.forEach(function(d) {
      popById[d.Id] = +d.total
    })

    console.log(data)
    console.log(map)
    console.log(populationPerState)

    // get max and min values of data
    let populations = data.map(function(d){ return d.total })
    let max = Math.max(...populations)
    let min = Math.min(...populations)
    let color = d3.scaleLinear().domain([min,max])
      .range(["#FFFFFF", "#000000"])

    plot1.append("g")
    	.attr("class", "counties")
    	.selectAll("path")
    	.data(topojson.feature(map, map.objects.states).features)
    	.enter().append("path")
    	.attr("d", mapPath)
    	.style("fill", function(d) {
    		return color(popById[`0400000US${d.id}`])
    	})
    	.style("stroke", "black")
}

            data.forEach(function(e){
                if (e.id === mapID){
                    color = colorScale(e.total/totalPopulation)
                }
            });
            return color
        })

}

// total: +d["Total; Estimate; Population 3 years and over enrolled in school"],
//     percentage: +d["Percent; Estimate; Population 3 years and over enrolled in school"]

function parseData(d){
  return {
    Id : d.Id,
    state : d.state,
    total: +d["Total; Estimate; Population 3 years and over enrolled in school"]
  }
}
