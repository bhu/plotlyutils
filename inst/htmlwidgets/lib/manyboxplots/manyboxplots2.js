 // manyboxplots2.js

// Top panel is like ~500 box plots:
//   lines are drawn at the 0.1 1, 10, 25, 50, 75, 90, 99, 99.9 percentiles
//   for each of ~500 distributions
// Hover over a column in the top panel and the corresponding distribution
//   is show below; click for it to persist; click again to make it go away.
//

function draw2(data, el) {

  var d3 = Plotly.d3;
   // dimensions of SVG
  var w = 1000,
    h = 450,
    pad = {left:60, top:20, right:60, bottom: 40}

   // y-axis limits for top figure
  var topylim = [data.quant[0][0], data.quant[0][1]];
  for (var i = 0; i < data.quant.length; i ++){
    for (var j = 0; j < data.quant[i].length; j ++) {
      var x = data.quant[i][j]
      topylim[0] = x < topylim[0] ? x : topylim[0];
      topylim[1] = x > topylim[1] ? x : topylim[1];
    }
  }
  topylim[0] = Math.floor(topylim[0]);
  topylim[1] = Math.ceil(topylim[1]);

   // y-axis limits for bottom figure
  var botylim = [0, data.counts[0][1]]
  for (var i = 0; i < data.counts.length; i ++) { 
    for (var j = 0; j < data.counts[i].length; j ++) {
      var x = data.counts[i][j];
      botylim[1] = x > botylim[1] ? x : botylim[1]
    }
  }

  var indindex = d3.range(data.ind.length);

   // adjust counts object to make proper histogram
  var br2 = [];

  for (var i = 0; i < data.breaks.length; i ++) {
    br2.push(data.breaks[i])
    br2.push(data.breaks[i])
  }

  function fix4hist(d) {
        var x = [0]
        for (var i = 0; i < d.length; i ++) {   
           x.push(d[i])
           x.push(d[i])
        }
        x.push(0)
    return(x)
    }

  for (var i = 0; i < data.counts.length; i ++) {
    data.counts[i] = fix4hist(data.counts[i])
  }

   // number of quantiles
  var nQuant = data.quant.length;
  var midQuant = (nQuant+1)/2 - 1;

  // x and y scales for top figure
  var xScale = d3.scale.linear()
    .domain([-1, data.ind.length])
    .range([pad.left, w-pad.right])

  // width of rectangles in top panel
  var recWidth = xScale(1) - xScale(0)

  var yScale = d3.scale.linear()
    .domain(topylim)
    .range([h-pad.bottom, pad.top])

  // function to create quantile lines
  quline = function(j) {
    return d3.svg.line()
      .x(function(d) {
        return xScale(d);
      }).y(function(d) {
        return yScale(data.quant[j][d]);
      });
  };

  var svg = d3.select("#" + el.id).append("svg")
          .attr("width", w)
          .attr("height", h)

  // gray background
  svg.append("rect")
    .attr("x", pad.left)
    .attr("y", pad.top)
    .attr("height", h-pad.top-pad.bottom)
    .attr("width", w-pad.left-pad.right)
    .attr("stroke", "none")
    .attr("fill", d3.rgb(200, 200, 200))
    .attr("pointer-events", "none")

  // axis on left
  var LaxisData = yScale.ticks(6)
  var Laxis = svg.append("g").attr("id", "Laxis")

  // axis: white lines
  Laxis.append("g").selectAll("empty")
    .data(LaxisData)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("class", "axis")
    .attr("x1", pad.left)
    .attr("x2", w-pad.right)
    .attr("y1", function(d) {
      return(yScale(d));
    })
    .attr("y2", function(d) {
      return(yScale(d));
    })
    .attr("stroke", "white")
    .attr("pointer-events", "none")

  // axis: labels
  Laxis.append("g").selectAll("empty")
    .data(LaxisData)
    .enter()
    .append("text")
    .attr("class", "axis")
    .text(function(d) {
      return(d3.format(".0f")(d))
    })
    .attr("x", pad.left*0.9)
    .attr("y", 
      function (d) { 
        return(yScale(d))
      })
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "end")

  // axis on bottom
  BaxisData = xScale.ticks(10)
  Baxis = svg.append("g").attr("id", "Baxis")

  // axis: white lines
  Baxis.append("g").selectAll("empty")
    .data(BaxisData)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("class", "axis")
    .attr("y1", pad.top)
    .attr("y2", h-pad.bottom)
    .attr("x1", function(d) {
      return(xScale(d-1));
    })
    .attr("x2", function(d) {
      return(xScale(d-1))
    })
    .attr("stroke", "white")
    .attr("pointer-events", "none")

  // axis: labels
  Baxis.append("g").selectAll("empty")
    .data(BaxisData)
    .enter()
    .append("text")
    .attr("class", "axis")
    .text(function(d) {
      return(d) 
    })
    .attr("y", h-pad.bottom*0.75)
    .attr("x", function(d) {
      return(xScale(d-1))
    })
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")

  // colors for quantile curves
  var colindex = d3.range((nQuant-1)/2);
  var tmp = d3.scale.category10().domain(colindex);
  var qucolors = [];
  for (var j = 0; j < colindex.length; j ++) {
    qucolors.push(tmp(colindex[j]))
  }
  qucolors.push("black");
  colindex.reverse();
  for (j = 0; j < colindex.length; j ++) {
    qucolors.push(tmp(colindex[j]))
  }

  // curves for quantiles
  var curves = svg.append("g").attr("id", "curves")

  for (var j = 0; j < nQuant; j++) {
    curves.append("path")
       .datum(indindex)
       .attr("d", quline(j))
       .attr("class", "line")
       .attr("stroke", qucolors[j])
       .attr("pointer-events", "none")
  }

  // vertical rectangles representing each array
  indRectGrp = svg.append("g").attr("id", "indRect")

  indRect = indRectGrp.selectAll("empty")
    .data(indindex)
    .enter()
    .append("rect")
    .attr("x", 
      function(d) {
        return(xScale(d) - recWidth / 2)
      })
    .attr("y", 
      function(d) {
        return(yScale(data.quant[nQuant-1][d]))
      })
    .attr("id", 
      function(d) {
        return("rect" + data.ind[d])
      })
    .attr("width", recWidth)
    .attr("height", 
      function(d) {
        return(yScale(data.quant[0][d]) - yScale(data.quant[nQuant-1][d]))
      })
    .attr("fill", "purple")
    .attr("stroke", "none")
    .attr("opacity", "0")
    .attr("pointer-events", "none")

  // vertical rectangles representing each array
  longRectGrp = svg.append("g").attr("id", "longRect")

  longRect = indRectGrp.selectAll("empty")
                 .data(indindex)
                 .enter()
                 .append("rect")
                 .attr("x", 
                  function(d) {
                    return(xScale(d) - recWidth/2)
                  })
                 .attr("y", pad.top)
                 .attr("width", recWidth)
                 .attr("height", h - pad.top - pad.bottom)
                 .attr("fill", "purple")
                 .attr("stroke", "none")
                 .attr("opacity", "0")

  // label quantiles on right
  rightAxis = svg.append("g").attr("id", "rightAxis")

  rightAxis.selectAll("empty")
       .data(data.qu)
       .enter()
       .append("text")
       .attr("class", "qu")
       .text( function(d) {
          return(d * 100 + "%")
        })
       .attr("x", w)
       .attr("y", function(d,i) {
          return(yScale(((i+0.5)/nQuant/2 + 0.25) * (topylim[1] - topylim[0]) + topylim[0]))
        })
       .attr("fill", function(d,i) {
          return(qucolors[i]);
        })
       .attr("text-anchor", "end")
       .attr("dominant-baseline", "middle")

  // box around the outside
  svg.append("rect")
     .attr("x", pad.left)
     .attr("y", pad.top)
     .attr("height", h-pad.top-pad.bottom)
     .attr("width", w-pad.left-pad.right)
     .attr("stroke", "black")
     .attr("stroke-width", 2)
     .attr("fill", "none")

  // lower svg
  lowsvg = d3.select("#" + el.id).append("svg")
             .attr("height", h)
             .attr("width", w)

  lo = data.breaks[0] - (data.breaks[1] - data.breaks[0])
  hi = data.breaks[data.breaks.length-1] + (data.breaks[1] - data.breaks[0])

  lowxScale = d3.scale.linear()
             .domain([lo, hi])
             .range([pad.left, w-pad.right])

  lowyScale = d3.scale.linear()
             .domain([0, botylim[1]+1])
             .range([h-pad.bottom, pad.top])

  // gray background
  lowsvg.append("rect")
     .attr("x", pad.left)
     .attr("y", pad.top)
     .attr("height", h-pad.top-pad.bottom)
     .attr("width", w-pad.left-pad.right)
     .attr("stroke", "none")
     .attr("fill", d3.rgb(200, 200, 200))

  // axis on left
  lowBaxisData = lowxScale.ticks(8)
  lowBaxis = lowsvg.append("g").attr("id", "lowBaxis")

  // axis: white lines
  lowBaxis.append("g").selectAll("empty")
     .data(lowBaxisData)
     .enter()
     .append("line")
     .attr("class", "line")
     .attr("class", "axis")
     .attr("y1", pad.top)
     .attr("y2", h-pad.bottom)
     .attr("x1", function(d) {return(lowxScale(d))})
     .attr("x2", function(d) {return(lowxScale(d))})
     .attr("stroke", "white")

  // axis: labels
  lowBaxis.append("g").selectAll("empty")
     .data(lowBaxisData)
     .enter()
     .append("text")
     .attr("class", "axis")
     .text(function(d) {return(d3.format(".0f")(d))})
     .attr("y", h-pad.bottom*0.75)
     .attr("x", function(d) {return(lowxScale(d))})
     .attr("dominant-baseline", "middle")
     .attr("text-anchor", "middle")

  grp4BkgdHist = lowsvg.append("g").attr("id", "bkgdHist")

  histline = d3.svg.line()
        .x(function(d,i) {return(lowxScale(br2[i]))})
        .y(function(d) {return(lowyScale(d))})

  randomInd = indindex[Math.floor(Math.random()*data.ind.length)]

  hist = lowsvg.append("path")
    .datum(data.counts[randomInd])
       .attr("d", histline)
       .attr("id", "histline")
       .attr("fill", "none")
       .attr("stroke", "purple")
       .attr("stroke-width", "2")


  histColors = ["blue", "red", "green", "MediumVioletRed", "black"]

  lowsvg.append("text")
        .datum(randomInd)
        .attr("x", pad.left*1.1)
        .attr("y", pad.top*2)
        .text(function(d) {return(data.ind[d])})
        .attr("id", "histtitle")
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("fill", "blue")

  clickStatus = []
  for (var d = 0; d < indindex.length; d ++) {
    clickStatus.push(0)
  }

  longRect
    .on("mouseover", 
      function(d) {
        d3.select("rect#rect" + data.ind[d])
        .attr("opacity", "1")
        d3.select("#histline")
        .datum(data.counts[d])
        .attr("d", histline)
        d3.select("#histtitle")
        .datum(d)
        .text(function(d) {return(data.ind[d])})
      })

    .on("mouseout", 
      function(d) {
        if (!clickStatus[d]) {
          d3.select("rect#rect" + data.ind[d]).attr("opacity", "0")
        }
      })

    .on("click", function(d) {
        // console.log("Click: " + data.ind[d] + "(" + d + ")")
        clickStatus[d] = 1 - clickStatus[d]
        d3.select("rect#rect" + data.ind[d]).attr("opacity", clickStatus[d])
        if (clickStatus[d]) {
          curcolor = histColors.shift()
          histColors.push(curcolor)

          d3.select("rect#rect" + data.ind[d]).attr("fill", curcolor)

          grp4BkgdHist.append("path")
                .datum(data.counts[d])
                .attr("d", histline)
                .attr("id", "path" + data.ind[d])
                .attr("fill", "none")
                .attr("stroke", curcolor)
                .attr("stroke-width", "2")
        } else {
          d3.select("path#path" + data.ind[d]).remove()
        }
    })

  // box around the outside
  lowsvg.append("rect")
     .attr("x", pad.left)
     .attr("y", pad.top)
     .attr("height", h-pad.bottom-pad.top)
     .attr("width", w-pad.left-pad.right)
     .attr("stroke", "black")
     .attr("stroke-width", 2)
     .attr("fill", "none")

  svg.append("text")
     .text("Outcome")
     .attr("x", pad.left*0.2)
     .attr("y", h/2)
     .attr("fill", "blue")
     .attr("transform", "rotate(270 " + pad.left*0.2 + " " + h/2 + ")")
     .attr("dominant-baseline", "middle")
     .attr("text-anchor", "middle")

  lowsvg.append("text")
     .text("Outcome")
     .attr("x", (w-pad.left-pad.bottom)/2+pad.left)
     .attr("y", h-pad.bottom*0.2)
     .attr("fill", "blue")
     .attr("dominant-baseline", "middle")
     .attr("text-anchor", "middle")

  svg.append("text")
     .text("Individuals, sorted by median")
     .attr("x", (w-pad.left-pad.bottom)/2+pad.left)
     .attr("y", h-pad.bottom*0.2)
     .attr("fill", "blue")
     .attr("dominant-baseline", "middle")
     .attr("text-anchor", "middle")

  // add legend
  text = "The top panel is like " + data.ind.length + " boxplots:\n"
  text += "lines are drawn at the "
  for (var i = 0; i < data.qu.length; i ++ ){ 
    var q = data.qu[i];
    if (i > 0) {
      text += ", "
    }
    text += q * 100
    text += " percentiles for each of " + data.ind.length + " distributions.\n"
  }

  d3.select("div#legend")
    .style("margin-left", "70px")
    .style("width", "500px")
    .append("p")
    .text(text)

  d3.select("div#legend").append("p")
    .text("Hover over a column in the top panel and the corresponding histogram is shown below; " +
          "click for it to persist; click again to make it go away.")

}
