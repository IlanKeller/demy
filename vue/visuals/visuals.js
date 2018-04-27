var vRender = {};

vRender["Bars"] = {};
vRender["Scatter"] = {};
vRender["Filter"] = {};
vRender["Table"] = {};
vRender["Lines"] = {};

vRender["Scatter"].render = function(svg, data) {
  if (d3.select('svg').select("g.scatterPlot").empty()){

    svg.html("")

  }

var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    visUpd = svg.selectAll('g.v-scatterPlot').data([1])
    visEnt = visUpd.enter().append('g').attr('class','v-scatterPlot')
    vis = visUpd.merge(visEnt).attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var random = Math.random,
data = d3.range(50).map(function() { return [random() * width, random() * height]; });


var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d[0]; })])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, d3.max(data,function(d) { return d[1]; })])
    .range([height, 0]);


var dotUpd = vis.selectAll("circle.v-scatterPlot-dot").data(data)
var dotEnt = dotUpd.enter()
  .append("circle")
  .attr("class", "v-scatterPlot-dot")
  .attr("r", 3)
  .attr("cx", function(d,i) { return i%2 == 0 ? 0 : width; })
  .attr("cy", function(d,i) { return i%2 == 0 ? height : 0; })
var dot = dotUpd.merge(dotEnt)
    .style('fill', function(d) {
      return (x(d[0]) <= width/2 && y(d[1]) <= height/2) ? '#66CDAA' : '#ff7500';
    })
  .transition().duration(500)
  .attr("cx", function(d) { return x(d[0]); })
  .attr("cy", function(d) { return y(d[1]); })

dotEnt.on("mouseover",function(d){
  var pos = this.getBoundingClientRect()
      , y = window.scrollY
      , x = window.scrollX
      , tooltip = d3.select('body').append('div')
          .attr('class','tooltip')

    tooltip.style('left', (pos.left + x)+"px")
    .style('top', (pos.top + y - 15)+"px")
    .text(d3.format(",.4s")(d[0])+"x" + ", "+d3.format(",.4s")(d[1])+"y")

  })
dotEnt.on("mouseout",function(d){
    d3.selectAll('.tooltip')
      .transition()
      .duration(500)
      .style('opacity',0.5)
      .remove()

})
var xAxisDef = d3.axisBottom(x)
    .ticks(NbTicksX(data[0],width),"s");
var xAxisUpd = vis.selectAll("g.v-scatterPlot-xAxis").data([1])
var xAxisEnt = xAxisUpd.enter()
        .append("g")
        .attr("class","v-scatterPlot-xAxis")
var xAxis = xAxisUpd.merge(xAxisEnt)
      .transition().duration(500)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisDef);


var yAxisDef = d3.axisLeft(y)
      .ticks(Math.round(height/50));
var yAxisUpd = vis.selectAll("g.v-scatterPlot-yAxis").data([1])
var yAxisEnt = yAxisUpd.enter()
        .append("g").attr('class','v-scatterPlot-yAxis')
var yAxis = yAxisUpd.merge(yAxisEnt)
      .transition().duration(500)
      .call(yAxisDef);



function NbTicksX(data, width){
    var valMax = d3.format(".2s")(d3.max(data,function(d,i) { return i}));
    var valMin = d3.format(".2s")(d3.min(data,function(d,i) {return i}));
    var lengthValMax = valMax.toString().length;
    var lengthValMin = valMin.toString().length;
    var lengthMax;
    if (lengthValMin <= lengthValMax){
      lengthMax = lengthValMax + 1 ;
    }
    if (lengthValMin <= lengthValMax){
      lengthMax = lengthValMin + 1 ;
    }
    var tickSize = 6*lengthMax + 25 ;
    var nbTick = Math.floor(width / tickSize) ;
    return nbTick<1?1:nbTick ;
  }

}

vRender["Bars"].render = function(svg, data, properties) {
if(d3.select('svg').select('g.v-barChart').empty()){
 svg.html("")
}
var data = d3.range(1000).map(d3.randomBates(10));
if (data != null){


  // var keys = Object.keys(data[0])
  // keys.pop()
  var formatCount = d3.format(",.0f");

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,

      visUpd = svg.selectAll("g.v-barChart").data([1]),
      visEnt = visUpd.enter().append("g").classed("v-barChart", true),
      vis = visUpd.merge(visEnt).attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var parseDate = d3.timeParse("%Y-%m-%d");

  // if (Date.parse(data[0][keys[0]]) != NaN && typeof data[0][keys[0]] == 'string'){
  //   var x = d3.scaleTime()
  //       .domain(d3.extent(data.map((d)=> parseDate(d[keys[0]]))
  //     ))
  //       .range([0, width])
  // }else {
    var x = d3.scaleLinear()
     //.domain(d3.extent(data.map((d)=> d[keys[0]])))
    .rangeRound([0, width]);
  // }

  // var aValuey = []
  // data.forEach((d)=> {
  //   d[keys[1]].forEach((v)=>{ // need to map that in y domain and in bins data
  //     aValuey.push(v)
  //   })
  // })


  var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(10))
      (data)
  var y = d3.scaleLinear()
  .domain([0, d3.max(bins, function(d) { return d.length; })])
  .rangeRound([height, 0]);

  var rectWidth = x(bins[0].x1) - x(bins[0].x0) - 1
  var nbRect = width / (11 * 20) // 11 for min width rect and 20 for number of rect generated
  var minimalbins = []
  var sortBins = bins.map(function(d,i){
        return {'size':d.length, 'index':i}
      })
      .sort((a,b) => b.size - a.size)
      .slice(0, 3)
      .sort((a,b) => a.index - b.index)
  sortBins.forEach(function(d){
    minimalbins.push(bins[d.index])
  })
  var rectUpd = vis.selectAll('rect.v-barChart-bar-rect').data(nbRect<1 ? minimalbins : bins)
  var rectEnt = rectUpd.enter().append('rect')
                  .classed('v-barChart-bar-rect',true)
                  .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + 0 + ")"; })
                  .attr('height',0)
  var rect = rectUpd.merge(rectEnt)
              .attr("x", 1)
              .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1.5)
              .transition()
              .duration(500)
              .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
              .attr("height", function(d) { return height - y(d.length); })
              .style('fill', (d,i) => i%2==0 ? '#66CDAA' : '#ff7500' )

  rectEnt.on("mouseover",function(d){
      var pos = this.getBoundingClientRect()
          , y = window.scrollY
          , x = window.scrollX
          , tooltip = d3.select('body').append('div')
              .attr('class','tooltip')

        tooltip.style('left', (pos.left + x)+"px")
        .style('top', (pos.top + y - 15)+"px")
        .text(d.length)

      })
  rectEnt.on("mouseout",function(d){
        d3.selectAll('.tooltip')
          .transition()
          .duration(500)
          .style('opacity',0.5)
          .remove()

    })

  var xAxisUpd = vis.selectAll('g.v-barChart-xAxis').data([1])
  var xAxisEnt = xAxisUpd.enter().append('g')
                  .classed('v-barChart-xAxis',true)
  var xAxis = xAxisUpd.merge(xAxisEnt)
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(NbTicksX(data,width)));

  // var yAxisUpd = vis.selectAll('g.v-barChart-yAxis').data([1])
  // var yAxisEnt = yAxisUpd.enter().append('g')
  //                 .classed('v-barChart-yAxis',true)
  // var yAxis = yAxisUpd.merge(xAxisEnt)
  //               .call(d3.axisLeft(y).ticks(Math.round(height/50)));

  rectUpd.exit().remove()

  function NbTicksX(data, width){
      var valMax = d3.format(",.0f")(d3.max(data));
      var valMin = d3.format(",.0f")(d3.min(data));
      var lengthValMax = valMax.toString().length;
      var lengthValMin = valMin.toString().length;
      var lengthMax;
      if (lengthValMin <= lengthValMax){
        lengthMax = lengthValMax + 1 ;
      }
      if (lengthValMin <= lengthValMax){
        lengthMax = lengthValMin + 1 ;
      }
      var tickSize = 6*lengthMax + 25 ;
      var nbTick = Math.floor(width / tickSize) ;
      return nbTick<1?1:nbTick ;
    }
  }else data = 0
}
/////////////////////Line chart////////////////////////////
vRender["Lines"].render = function(svg, data, properties){


if (d3.select('svg').select("g.lineChart").empty()){

  svg.html("")

}

if(data == null || properties == null) return;
if( typeof properties.columns_name.Measure === 'undefined'
      || typeof properties.columns_name.Measure[0] === 'undefined')
    properties.columns_name.Measure = "__count__"
else
  properties.columns_name.Measure = properties.columns_name.Measure[0];
properties.columns_name.Category = properties.columns_name.Category[0];
var fieldLegend = true;
if( typeof properties.columns_name.Legend === 'undefined')
  fieldLegend = false;
else
  properties.columns_name.Legend = properties.columns_name.Legend[0];

var series_values_all = fieldLegend?data.map(d => d[properties.columns_name.Legend]):[properties.columns_name.Measure]
var series_values =  series_values_all.filter((d, i) => i == series_values_all.indexOf(d))

var categories_values_all = data.map(d => d[properties.columns_name.Category])
var categories_values =  categories_values_all.filter((d, i) => i == categories_values_all.indexOf(d))
                                              .sort((a, b) => a > b)

properties.series_names = series_values
properties.series_colors = properties.series_names.map((d, i) => properties.series_colors[i % properties.series_colors.length])


data = properties.series_names.map(
    serie_name => {
        var unsorted_serie = data.filter(d => !fieldLegend || d[properties.columns_name.Legend]===serie_name)
        var sorted_serie = []
        unsorted_serie.forEach(d => {
          var category_index = categories_values.indexOf(d[properties.columns_name.Category])
          sorted_serie[category_index] = isNaN(parseFloat(d[properties.columns_name.Measure]))?0:parseFloat(d[properties.columns_name.Measure])
        })
        return sorted_serie;
    })

var i = 0;
var graphData = data.map(d => {
  var ret = {
  "values":d
  ,"color":properties.series_colors[i]
  ,"names":properties.series_names[i]
  ,"xAxis_format":properties.xAxis_format[0]
  ,"tooltip_format":properties.tooltip_format[i]
  ,"columns_name":properties.columns_name
  }
  i++;
  return ret;
})

var margin = {top: 10, right: 20, bottom: 20, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    lineVisUpd = svg.selectAll("g.lineChart").data([1]);
var  lineVisEnt = lineVisUpd.enter().append("g").classed('lineChart', true),
    lineVis = lineVisUpd.merge(lineVisEnt).attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var max = d3.max(graphData,function(c){ return d3.max(c.values)})
var min = d3.min(graphData,function(c){ return d3.min(c.values)})
var namesLength = d3.max(graphData,function(d){ return d.names.length}) > 8 ? 8 : d3.max(graphData,function(d){ return d.names.length})

var x = d3.scaleLinear()
    .domain([0, graphData[0].values.length])
    .rangeRound([0, width > 100 ? width - namesLength*5 : width]);

var y = d3.scaleLinear()
    .domain([min,max])
    .range([height, 0]);


var valueline = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y(d); })
    .curve(d3.curveCatmullRom.alpha(0.5));

//////////// PATH ////////////
var pathUpd =  lineVis.selectAll("path.v-line-line").data(graphData)
var pathEnt = pathUpd.enter().append("path").classed("v-line-line",true)
          .style('stroke',d => d.color)
          .attr("d", (d) => valueline(d.values.map(d => 0)))

var path = pathUpd.merge(pathEnt).style('stroke',d => d.color)
             .transition()
             .duration(1000)
             .attr("d", (d) => valueline(d.values))

pathUpd.exit().remove()



//////////// Legend ////////////
if (width > 100 && height>100){

var legendUpd = lineVis.selectAll('g.v-line-legend').data(graphData)
var legendEnt = legendUpd.enter().append('g').attr('class','v-line-legend')


legendEnt.append('text')
legendEnt.append('circle')
          .attr('r',3)
          .attr('cx',-6)
          .attr('cy',-3)

var legend = legendUpd.merge(legendEnt)
      .attr('transform',(d,i) => 'translate(' + (width - namesLength*4) + ',' + i*15 + ')')

legend.select('text').text(d => d.names).style('fill', d => d.color)
legend.select('circle').style('fill', d => d.color)

}

//////////// Dot on Line ////////////
var dotUpd = lineVis.selectAll('g.v-line-dots').data(graphData)
var dotEnt = dotUpd.enter().append('g').classed('v-line-dots',true)
var dot = dotUpd.merge(dotEnt).style('fill', d => d.color) // How to fill with color every circle when the data used is only d.values
// data(d => d.values)
var circUpd = dot.selectAll('circle').data(d => d.values)
var circEnt = circUpd.enter().append('circle')
    .attr('class','v-line-dots-dot')
    .attr('r', 3)
    .attr('cx', function(d, i) { return x(i); })
    .attr('cy', height)

circEnt.on("mouseover",function(d){
    var pos = this.getBoundingClientRect()
        , y = window.scrollY
        , x = window.scrollX
        , tooltip = d3.select('body').append('div')
            .attr('class','tooltip')

      tooltip.style('left', (pos.left + x)+"px")
      .style('top', (pos.top + y - 15)+"px")
      .text(d3.format(properties.tooltip_format)(d))

    })
circEnt.on("mouseout",function(d){
      d3.selectAll('.tooltip')
        .transition()
        .duration(500)
        .style('opacity',0.5)
        .remove()

  })

var circ = circUpd.merge(circEnt)
    .style('fill', d => d.color)
    .attr('cx', function(d, i) { return x(i); })
    .transition().duration(1000)
    .attr('cy', function(d) { return y(d); })

//////////// Value on Dot ////////////
var valueUpd = lineVis.selectAll('g.v-line-values').data(graphData)
var valueEnt = valueUpd.enter().append('g').classed('v-line-values',true)
var value = valueUpd.merge(valueEnt)

// data(d => d.values)
var textValueUpd = value.selectAll('text.v-line-values-text').data((d,i)=>
       d.values.map(v => {return  {"val":v,"serie":i}})
  )

var textValueEnt = textValueUpd.enter().append('text').classed('v-line-values-text',true).attr('x',0).style('text-anchor','middle')



var textValue = textValueUpd.merge(textValueEnt)
    .text(d => d3.format(properties.tooltip_format)(d.val))
    .transition()
    .duration(500)
    .style("display", function(d,i){
      var labLength = 6;
      var serie = graphData[0].values.length
      var labSize = labLength * 6;
      var distanceX = width/serie
      var labPerColumn = Math.ceil(labSize/distanceX)

      if (i%labPerColumn != 0){
        return 'none'
      }
      return 'block'
    })
    .attr('x', ((d,i) =>  x(i)))
    .attr('y', function(d,i){
      var iVal = i
      var iSerie = d.serie;
      var val = y(d.val);
      var threshold = 20
      var overlaps = false;
      var distinctVal = val + iSerie * 0.00000000001
      var dif = 0;
      var sortArray = graphData
                    .map(v => { return y(v.values[iVal] + dif)})
                    .sort((a, b) => a > b)
      // console.log(sortArray)
      if (val >= height - 20){
        return val - 10
      }
      if (val <= 0 + 20){

        return val + 10
      }
      for(var i = 1; i < graphData.length; i++) {
        var distY = sortArray[i] - sortArray[i-1]

        if(distY<threshold){
           overlaps = true;
         }
         // console.log(iVal, overlaps)
         if(overlaps) {
        //calcular ma position
          var distinctVal = val + (iSerie + 1) * 0.00000000001
          var myRank =  sortArray
                        .map(v => { return v + ((iSerie + 1) * 0.00000000001)})
                        .indexOf(distinctVal)

          var myHeight = (height / graphData.length)
          var myPos = myRank*myHeight + (myHeight*50)/100
          if(iVal%2 == 0){
            myPos += 15
          }

          return myPos

        }
      }

      return y(d.val) - 5

  })
//////////// xAxis ////////////
var line_xAxisDef = d3.axisBottom(x)
  .ticks(NbTicksX(graphData,width),"s");

var line_xAxisUpd = lineVis.selectAll('g.v-line-xAxis').data([1])
var line_xAxisEnt = line_xAxisUpd.enter().append('g')
  .classed('v-line-xAxis',true)
var line_xAxis = line_xAxisUpd.merge(line_xAxisEnt)
  .transition().duration(500)
  .attr("transform", "translate(0," + height + ")")
  .call(line_xAxisDef)


//////////// yAxis ////////////
var line_yAxisDef = d3.axisLeft(y)
    .ticks(Math.round(height/50));

var line_yAxisUpd = lineVis.selectAll('g.v-line-yAxis').data([1])
var line_yAxisEnt = line_yAxisUpd.enter().append('g')
  .classed('v-line-yAxis',true)
var line_yAxis = line_yAxisUpd.merge(line_yAxisEnt)
  .transition().duration(500)
  .call(line_yAxisDef)



function NbTicksX(data, width){
    var valMax = d3.format(".2s")(d3.max(data,function(d,i) { return i}));
    var valMin = d3.format(".2s")(d3.min(data,function(d,i) {return i}));
    var lengthValMax = valMax.toString().length;
    var lengthValMin = valMin.toString().length;
    var lengthMax;
    if (lengthValMin <= lengthValMax){
      lengthMax = lengthValMax + 1 ;
    }
    if (lengthValMin <= lengthValMax){
      lengthMax = lengthValMin + 1 ;
    }
    var tickSize = 6*lengthMax + 25 ;
    var nbTick = Math.floor(width / tickSize) ;
    return nbTick<1?1:nbTick ;
  }
}

vRender["Filter"].render = function(svg, data) {
  var data = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var addTo =g.selectAll("rect").data(data).enter()
   addTo.append('rect')
        .attr("class", "area").attr("clip-path", "url(#clip)")
        .attr('x', 0)
        .attr('y', function(d, i) {return i*(20+1)})
        .attr('width', width)
        .attr('height', 20)
        .style('fill', "#333333");
   addTo.append('text')
        .attr("class", "area").attr("clip-path", "url(#clip)")
        .attr('x', width/2)
        .attr('y', function(d, i) {return (i+1)*(20+1)-5})
        .attr('font-size', 13)
        .attr('fill', "#DDDDDD")
        .attr('alignment-baseline',"middle")
        .attr("text-anchor","middle")
        .text(function (d) {return d;});


}

vRender["Table"].render = function(svg, data) {
  var data = {"columnNames":["Nom", "Prenom", "Age"]
              ,"rows":[
                  ["Birrien", "Marie", "35"]
                  ,["Péron", "Camille", "35"]
                  ,["Bourdon", "Loïc", "20"]
                  ,["Ramirez", "Javiera", "56"]
                  ,["Riara", "Sev", "39"]
                  ,["Grenapin", "Clémence", "23"]
                  ,["Rieiro", "Maï", "37"]
               ]
               ,"widths":[0.4, 0.4, 0.2]
               ,"font-family":"Verdana"
               ,"font-size":10
               ,"background-color":"#FFFFFF"
               ,"background-color-inter":"#F3F3F3"
               }

  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    rowHeight = data["font-size"]+2;
  var xCol = 0,
    i = 0;
  const colPositions = data.widths.map(w => r = {"from":xCol,"to":(xCol+=width*w), "index":i++})

  //Defs for column positions
  const uDef = svg.selectAll("defs").data([1])
  const eDef = uDef.enter().append("defs")
  uDef.exit().remove();

  //Paths in def for each column
  const uPaths = uDef.merge(eDef).selectAll("path").data(colPositions, d => d.index +"_"+d.left+"_"+d.width);
  const ePaths = uPaths.enter().append("path")
                       .attr("id", d => "colpos"+d.index)
                       .attr("d", d => "M "+d.from+" "+(data["font-size"]+1)+" H "+ d.to)
  uPaths.exit().remove();

  //G containers for each row
  const uRows = svg.selectAll("g").data([data.columnNames].concat(data.rows));
  const eRows = uRows.enter().append("g").attr("transform", (d, i) => "translate(" + margin.left + "," + (margin.top + (i+1)*rowHeight) + ")");
  uRows.exit().remove();
  const aRows = uRows.merge(eRows);
  //Text for each row
  eRows.append("text");
  const aRowText = aRows.selectAll("text")
    .attr("font-family", data["font-family"])
    .attr("font-size", data["font-size"])
  ;

  //Text path for each cell
  const uCell = aRowText.selectAll("textPath").data(d => d);
  const eCell = uCell.enter().append("textPath");
  uCell.exit().remove();
  const aCell = uCell.merge(eCell)
                 .attr("xlink:href", (d, i) => "#colpos"+i)
                 .text(d => d);
}
