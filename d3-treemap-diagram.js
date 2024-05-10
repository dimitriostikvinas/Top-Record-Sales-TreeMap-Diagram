function drawTreemapDiagram(dataset, TITLE, DESCRIPTION){
    document.getElementById('title').innerHTML = TITLE;
    document.getElementById('description').innerHTML = DESCRIPTION;
    console.log(dataset.children[1].children[1]);

    const width="1160", height="870";

    const svg = d3.select("#tree-map")

    svg.selectAll("*").remove();
    svg.attr("width", width)
        .attr("height", height)
        .style("font", "10px sans-serif");

    const treemap = d3.treemap()
                .size([width, height])
                .padding(1);   

    // Prepare root data structure
    const root = d3.hierarchy(dataset)
                .sum(d => d.value) // The size of each leave is given in the 'value' field in input data
            .sort((a, b) => b.value - a.value);

    // Compute the treemap layout
    treemap(root);

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
        .attr("id", d => d.data.name)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
    
    // Append titles to the nodes
    leaf.append("text")
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .attr("x", 5)
        .attr("y", (d, i) => 13 + i * 10)
        .style("fill", "black")
        .text(d => d);
    
    var fader = function (color) {
        return d3.interpolateRgb(color, '#fff')(0.2);
    };
        
    var color = d3.scaleOrdinal().range(
        // Recreate .schemeCategory20
        [
            '#1f77b4',
            '#aec7e8',
            '#ff7f0e',
            '#ffbb78',
            '#2ca02c',
            '#98df8a',
            '#d62728',
            '#ff9896',
            '#9467bd',
            '#c5b0d5',
            '#8c564b',
            '#c49c94',
            '#e377c2',
            '#f7b6d2',
            '#7f7f7f',
            '#c7c7c7',
            '#bcbd22',
            '#dbdb8d',
            '#17becf',
            '#9edae5'
        ].map(fader)
    );

    const tooltip = d3.select("#tooltip");

    leaf
        .attr('id', d => d.data.id)
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('fill', d => color(d.data.category))
        .on("mouseover", function(event, d) {   
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px")
              .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`);
        })
        .on("mousemove", function(event, d) {
            tooltip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });

    var categories = root.leaves().map(d => d.data.category); 
        categories = categories.filter(function (category, index, self) {
        return self.indexOf(category) === index;
        });
        var legend = d3.select('#legend');
        var legendWidth = +legend.attr('width');
        const LEGEND_OFFSET = 10;
        const LEGEND_RECT_SIZE = 15;
        const LEGEND_H_SPACING = 150;
        const LEGEND_V_SPACING = 10;
        const LEGEND_TEXT_X_OFFSET = 3;
        const LEGEND_TEXT_Y_OFFSET = -2;
        var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);
    
        var legendElem = legend
        .append('g')
        .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            return (
            'translate(' +
            (i % legendElemsPerRow) * LEGEND_H_SPACING +
            ',' +
            (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
                LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
            ')'
            );
        });
    
        legendElem
        .append('rect')
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', function (d) {
            return color(d);
        });
    
        legendElem
        .append('text')
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(function (d) {
            return d;
        });
        
};

