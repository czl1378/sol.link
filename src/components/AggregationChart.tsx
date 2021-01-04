import React, { useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  width: number;
  height: number;
  data: any;
  value?: number;
  loading?: boolean;
}

function AggregationChart({ width, height, data, value, loading }: Props) {

  const calcPos = function(idx, x = true) {
    const padding = 50;
    let radius = height/2 - padding;
    let angle = (idx/(data.length/2)) * Math.PI;
    return padding + (radius * (x?Math.cos:Math.sin)(angle)) + radius;
  }

  useEffect(() =>{
    let svg = d3.select("#aggregation_chart_svg");

    if (svg.empty()) {
      svg = d3.select("#aggregation_chart")
        .append("svg")
        .attr("id", "aggregation_chart_svg")
        .attr("width", width)
        .attr("height", height);
    }

    const tooltip = d3.select("body").append("div")
      .attr("class", "chart-tooltip")
      .attr("opacity", 0.0);
  
    svg.select("#center").remove();
    
    
    // update submission
    svg.selectAll(".oracle-submission")
      .data(data || [])
      .each(function(d) {
        console.log(this, d, data);
        d3.select(this)
          .text("$" + d.submission.toString());
      });

    const gsUpdate = svg.selectAll(".oracle").data(data || []);

    gsUpdate.exit().remove();

    let gsEnter = gsUpdate.enter();

    const oracle = gsEnter.append("g")
      .attr("class", "oracle");

    oracle.append("line")
      .style("stroke", "#2c2c2c")
      .attr("stroke-dasharray", 400)
      .attr("stroke-dashoffset", 400)
      .attr("stroke-width", 0.5)
      .attr("x1", (d, i) => calcPos(i))
      .attr("y1", (d, i) => calcPos(i, false))
      .attr("x2", height/2-20)
      .attr("y2", height/2-20)
      .transition()
      .delay((d, i) => (i+3)*(100 + Math.random()*50))
      .duration(100)
      .attr("stroke-dashoffset", 0);

    oracle.append("circle")
      .attr("class", "oracle-circle")
      .style("cursor", "pointer")
      .style("stroke", "#2c2c2c")
      .style("opacity", "0")
      .attr("stroke-width", 1)
      .attr("fill", "#2c2c2c")
      .attr("cx", (d, i) => calcPos(i))
      .attr("cy", (d, i) => calcPos(i, false))
      .attr("r", 8)
      .on("mouseover", function(e, d) {
       
        d3.select(this)
          .transition()
          .duration(100)
          .style("fill","#6c6c6c");
        
        tooltip.html(
            `
              <div class="title">Oracle</div>
              <div class="name">${d.description?.trim()}</div>
              <div class="submission">$${d.submission?.toString()}</div>
            `
          )
          .style("left", (e.pageX)+"px")
          .style("top", (e.pageY+20)+"px")
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(100)
          .style("fill","#2c2c2c");
        
        tooltip.style("opacity", 0);
      })
      .transition()
      .delay((d, i) => i*100)
      .duration(100)
      .style("opacity", 1);
    
    // description
    oracle.append("text")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("color", "#2c2c2c")
      .attr("x", (d, i) => calcPos(i))
      .attr("y", (d, i) => calcPos(i, false))
      .attr("dx", 15)
      .attr("dy", -5)
      .text(d => d.description.trim())
      .transition()
      .delay((d, i) => (i+1)*100)
      .duration(200)
      .style("opacity", 1);
    
    // submission
    oracle.append("text")
      .attr("class", "oracle-submission")
      .style("color", "#2c2c2c")
      .style("font-size", "12px")
      .style("opacity", "0")
      .attr("x", (d, i) => calcPos(i))
      .attr("y", (d, i) => calcPos(i, false) + 15)
      .attr("dx", 15)
      .attr("dy", -5)
      .text(d => "$" + d.submission.toString())
      .transition()
      .delay((d, i) => (i+2)*100)
      .duration(100)
      .style("opacity", "1");
    
    // draw center circle
    
    const center = svg.append("g").attr("id", "center");

    center.attr("transform", `translate(${height/2-20},${height/2-20})`)
      .style("cursor", "pointer")
      .append("circle")
      .style("stroke", "#2c2c2c")
      .style("fill", "#f0f2f5")
      .attr("stroke-width", 0.5)
      .attr("r", 48);
    
    center.append("path")
      .attr("transform", "translate(-15,-25)scale(.03)")
      .attr("d", "M 866.9 169.9 L 527.1 54.1 C 523 52.7 517.5 52 512 52 s -11 0.7 -15.1 2.1 L 157.1 169.9 c -8.3 2.8 -15.1 12.4 -15.1 21.2 v 482.4 c 0 8.8 5.7 20.4 12.6 25.9 L 499.3 968 c 3.5 2.7 8 4.1 12.6 4.1 s 9.2 -1.4 12.6 -4.1 l 344.7 -268.6 c 6.9 -5.4 12.6 -17 12.6 -25.9 V 191.1 c 0.2 -8.8 -6.6 -18.3 -14.9 -21.2 Z M 810 654.3 L 512 886.5 L 214 654.3 V 226.7 l 298 -101.6 l 298 101.6 v 427.6 Z m -405.8 -201 c -3 -4.1 -7.8 -6.6 -13 -6.6 H 336 c -6.5 0 -10.3 7.4 -6.5 12.7 l 126.4 174 a 16.1 16.1 0 0 0 26 0 l 212.6 -292.7 c 3.8 -5.3 0 -12.7 -6.5 -12.7 h -55.2 c -5.1 0 -10 2.5 -13 6.6 L 468.9 542.4 l -64.7 -89.1 Z");
   
    center.append("text")
      .attr("transform", `translate(0, 25)`)
      .style("color", "#2c2c2c")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text(!data ? "loading..." : "$" + (value || 0))

  }, [data]);

  return (
    <div id={`aggregation_chart`}></div>
  );
}

export default React.memo(AggregationChart);