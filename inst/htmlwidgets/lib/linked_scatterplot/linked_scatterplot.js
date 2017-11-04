function linked_scatterplot(x, el) {
    d3el = Plotly.d3.select("#" + el.id);
    
    var groups = x.groups.filter(onlyUnique);
    groups.sort();
    var traces = new Array();
    for (var i = 0; i < groups.length; i ++) {
      
      var ind_this = findAll(x.groups, groups[i]);
      var xcoords = new Array(),
        ycoords = new Array(),
        links = new Array(),
        text = new Array();
      for (var j = 0; j < ind_this.length; j ++) {
        xcoords.push(x.x[ind_this[j]]);
        ycoords.push(x.y[ind_this[j]]);
        links.push(x.links[ind_this[j]]);
        text.push(x.text[ind_this[j]]);
      }
      traces.push({name: groups[i],
        x:xcoords,
        y:ycoords,
        links: links,
        text: text,
        hoverinfo: "text",
        mode: "markers",
        marker: {color: x.colors[i]}
      });
    }
    console.log(x.xlim);
    var layout = {
      title: x.title, 
      hovermode: "closest",
      autosize: true,
      xaxis: {title: x.xlab, 
        range: x.xlim},
      yaxis: {title: x.ylab, 
        range: x.ylim},
      margin: {l: 40, r: 30, t: 50, b: 50}
    };
 
    Plotly.newPlot(el, traces, layout);

    el.on("plotly_click",
        function(data) {
          for(var i=0; i < data.points.length; i++){
            var pn = data.points[i].pointNumber;
            var link = data.points[i].data.links[data.points[i].pointNumber];
            window.location = link;
          };

          Plotly.restyle(el.id, update);
        })
};


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}



function findAll(array, value_to_find) {
    var indices = new Array();
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value_to_find) {
            indices.push(i);
        }
    }
    return indices;
}
