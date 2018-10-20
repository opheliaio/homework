// @TODO: YOUR CODE HERE!
var width = parseInt(d3.select("#scatter").style("width"));

// define the height of the graph
var height = width - width/3.9;

// margin for spacing of graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var paddingBot = 40;
var paddingTop = 40;

// Create the canvas for the graph
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// define  circles radius

var circRadius;
function crGet(){
    if(width <=530){
        circRadius = 5;
    }
    else {
        circRadius = 10;
    }
}

crGet();

// Labels for axes

// Bottom axis

svg.append("g").attr("class", "xText");

// references xText
var xText = d3.select(".xText");

// give xText a transform property

function xTextRefresh(){
    xText.attr("transform", "translate(" + 
    ((width - labelArea) /2 + labelArea) +
     ", " + 
     (height - margin - paddingBot) + 
     ")");
}

xTextRefresh();

// We use xText to append 3 text names for the axis
// 1) Poverty
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")

// 2) Age
xText
    .append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");

// 3) Income
xText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");

// Left Axis
var leftTextX = margin + paddingLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// add a second label group
svg.append("g").attr("class", "yText");

// refer to yText
var yText = d3.select(".yText");

// similar to xTextRefresh
function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
        );
}

yTextRefresh();

// append text to y axis
// 1) Obesity
yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");

// 2) Smokes
yText
    .append("text")
    .attr("y", 0)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

// 3) Lacks Healthcare
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Health Care (%)");

d3.csv("assets/data/data.csv").then(function(data) {
    visualize(data)
})

// create visualization function
// purpose of function is to manipulate all the visual elements

function visualization(theData){
    var curX = "poverty";
    var curY = "obesity";

    //we need empty variables to store the max and min values
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // create a tool tip functionality
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d)){
            var theX;
            // Grab the state name
            var the State = "<div>" + d.state + "</div>";
            // grab the y value's key and value
            var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
            // If the x key is poverty
            if (curX === "poverty") {
                //grab the x key and its value
                theX = "<div>" + curX + ": " + d[curX] + "%</div>"
            }
            else {
                theX = "<div>" + curX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
            }
            return theState + theX + theY
        })

    svg.call(toolTip);

    // create a function to find the maximum and minimum values of the columns
    function xMinMax(){
        xMin = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 0.90;
            })
    
    function yMinMax(){
        xMin = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 1.10;
            })
    }

    // change classes and appearance when a different label is clicked

    function labelChange(axis, clickedText) {
        //switch the currently active to inactive
        d3
            .selectAll(".atext")
            .filter("." + axis)
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true)
    
        // switch the text just clicked to active
        clickedText.classed("inactive", false).classed("active", true);
    }

    // scatter plot
    xMinMax();
    yMinmax();

    // now that the min and max values for the x and y are defined
    // we can build our scales
    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin]);

    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelArea, margin]);

    // pass the scales into the axis methods to create our axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // determine x and y tick counts
    function tickCount() { 
        if (width <= 500) {
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }

    tickCount();

    // append axis to the svg as group elements
    svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0, " + (height - margin - labelArea) + ")");

    svg
        .append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

    // we append the circles for each row of data
    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    theCircles
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[curX]);
        })
        .attr("cy", function(d) {
            return yScale(d[curY]);
        })
        .attr("r", circRadius)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
        })
        .on("mouseover", function(d){
            // show the tooltip when the mouse is on circle
            toolTip.show(d, this);
            // highlight the state cirlce's boarder
            d3.select(this).style("stroke", "#32323232");
        })
        .on("mouseout", function(d) {
            // remove the tooltip
            toolTip.hide(d);
            // remove the highlight
            d3.select(this.style("stroke", "#e3e3e3"))
        });

        theCircles
            .append("text")
            .text(function(d){
                    return d.abbr
            })
            .attr("dx", function(d) {
                return xScale(d[curX]);
            })
            .attr("dy", function(d) {
                // when size of the text is the raidus
                // add a third of the radius to the height
                // pushes it to the middle of the circle
                return yScale(d[curY]) + circRadius / 2.5;
            })
            .attr("font-size", circRadius)
            .attr("class", "stateText")
            .on("mouseover", function(d) {
                toolTip.show(d);

                d3.select("." + d.abbr).style("stroke", "#323232");
            })
            .on("mouseover", function(d) {
                toolTip.show(d);

                d3.select("." + d.abbr).style("stroke", "#e3e3e3");
            })

            // make the graph dynamic
            d3.selectAll(".aText").on("click", function() {
                var self = d3.select(this)

                // we only want to select inactive labels

                if self.classed("inactive")) {
                    // grab the name and axis saved in the label
                    var axis = self.attr("data-axis")
                    var name = self.attr("data-name")

                    if (axis ==="x"){
                        curX = name;

                        // change the min and max

                        xMinMax();

                        // update the domain of y
                        yScale.domain([yMin, yMax]);

                        // update the domain of x
                        xScale.domain([xMin, xMax]);

                        svg.select(".xAxis").transition().duration(300).call(xAxis);

                        // with the axis change, change location of circles
                        d3.selectAll("circle").each(function() {
                            d3
                                .select(this)
                                .transition(
                                .attr("cx", function(d) {
                                    return xScale(d[curX]);
                                })
                                .duration(300);
                        });

                        d3.selectAll(".stateText").each(function() {
                            d3
                                .select(this)
                                .transition(
                                .attr("dx", function(d) {
                                    return xScale(d[curX]);
                                })
                                .duration(300);
                        });

                        //
                        labelChange(axis, self);
                    }

                    else {
                        // when y is clicked, do this
                        curY = name;

                        // change the min and max of y axis
                        yMinMax();

                        // update the y axis
                        svg.select(".yAxis").transition(300).call(yAxis);

                        // with the axis change, change location of circles
                        d3.selectAll("circle").each(function() {
                            d3
                                .select(this)
                                .transition(
                                .attr("cy", function(d) {
                                    return yScale(d[curY]);
                                })
                                .duration(300);
                        });

                        d3.selectAll(".stateText").each(function() {
                            d3
                                .select(this)
                                .transition(
                                .attr("dy", function(d) {
                                    return yScale(d[curY]);
                                })
                                .duration(300);
                        });

                        //
                        labelChange(axis, self);
                    }
                }
            })
}