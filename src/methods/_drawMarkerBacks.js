    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_drawMarkerBacks.js
    dimple._drawMarkerBacks = function (lineDataRow, chart, series, duration, className, lineShape) {
        var markerBacks,
            markerBackClasses = ["dimple-marker-back", className, lineDataRow.keyString],
            rem,
            shapes;
        if (series.lineMarkers) {
            if (series._markerBacks === null || series._markerBacks === undefined || series._markerBacks[lineDataRow.keyString] === undefined) {
                markerBacks = series._group.selectAll("." + markerBackClasses.join(".")).data(lineDataRow.markerData);
            } else {
                markerBacks = series._markerBacks[lineDataRow.keyString].data(lineDataRow.markerData, function (d) { return d.key; });
            }

            // Add
            if (lineShape.nextSibling && lineShape.nextSibling.id) {
                shapes = markerBacks.enter().insert("circle", '#' + lineShape.nextSibling.id);
            } else {
                shapes = markerBacks.enter().append("circle");
            }
            shapes
                .attr("id", function (d) { return dimple._createClass([d.key + " Marker Back"]); })
                .attr("class", function (d) {
                    var fields = [];
                    if (series.x._hasCategories()) {
                        fields = fields.concat(d.xField);
                    }
                    if (series.y._hasCategories()) {
                        fields = fields.concat(d.yField);
                    }
                    return dimple._createClass(fields) + " " + markerBackClasses.join(" ");
                })
                .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin); })
                .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin); })
                .attr("r", 0)
                .attr("fill", "white")
                .attr("stroke", "none");

            // Update
            chart._handleTransition(markerBacks.merge(shapes), duration, chart)
                .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                .attr("r", 2 + series.lineWeight);

            // Remove
            rem = chart._handleTransition(markerBacks.exit(), duration, chart)
                .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin); })
                .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin); })
                .attr("r", 0);

            // Run after transition methods
            if (duration === 0) {
                rem.remove();
            } else {
                rem.each("end", function () {
                    d3.select(this).remove();
                });
            }

            if (series._markerBacks === undefined || series._markerBacks === null) {
                series._markerBacks = {};
            }
            series._markerBacks[lineDataRow.keyString] = markerBacks;
        }
    };
