import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphViewer = ({ apiUrl, show }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!apiUrl) return;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => drawGraph(data))
      .catch((err) => console.error("Failed to fetch graph:", err));
  }, [apiUrl, show]);

  const drawGraph = (graph) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove();

    const container = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.01, 20])
        .on("zoom", (event) => container.attr("transform", event.transform))
    );

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id((d) => d.id)
          .distance((d) => 100 / d.weight)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("collision", d3.forceCollide().radius(10))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = container
      .append("g")
      .attr("stroke", "grey")
      // .attr("stroke-opacity", 0.5)
      // .attr("stroke-width", 0.5)
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line");

    const node = container
      .append("g")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) => {
        if (d.color) return d.color == "lightblue" ? "green" : "red";
        return d.lightblue > d.red ? "green" : "red";
      })
      .attr("cursor", "grab")
      .call(drag(simulation))
      .on("click", (event, d) => {
        console.log("Clicked node:", d.id, d);
      });

    if (show) {
      const labels = container
        .append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text((d) =>
          Number(
            d.lightblue > d.red
              ? d.lightblue / (d.lightblue + d.red)
              : d.red / (d.lightblue + d.red)
          ).toFixed(2)
        )
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dy", 3);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
      });
    } else {
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });
    }
  };
  const drag = (simulation) =>
    d3
      .drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphViewer;
