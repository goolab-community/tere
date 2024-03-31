import React, { useRef, useEffect, useState } from "react";
import { Grid, h, createRef as gCreateRef } from "gridjs";
import "gridjs/dist/theme/mermaid.css";


function History () {
  const wrapperRef = useRef(null);

  // Chartist options
  const opts = {
    height: '30px',
    showPoint: false,
    fullWidth:true,
    chartPadding: {top: 0,right: 0,bottom: 0,left: 0},
    axisX: {showGrid: false, showLabel: false, offset: 0},
    axisY: {showGrid: false, showLabel: false, offset: 0}
  };
  const grid = new Grid({
    sort: true,
    columns: [
      'Symbol',
      'Last price',
      { 
        name: 'Difference', 
        formatter: (cell) => {
          return h('b', { style: {
            'color': cell > 0 ? 'green' : 'red'
          }}, cell);
        }
      },
      {
        name: 'Trend',
        sort: false,
        width: '20%',
        formatter: (cell) => {
          const ref = gCreateRef();
          const chart = h('div', { ref: ref })
          
          // setTimeout to ensure that the chart wrapper is mounted
          setTimeout(() => {
          }, 0);
          
          return chart;
        }
      }],
    data: [
      ['AAPL', 360.2, 20.19, [360, 363, 366, 361, 366, 350, 370]],
      ['ETSY', 102.1, 8.22, [90, 91, 92, 90, 94, 95, 99, 102]],
      ['AMZN', 2734.8, -30.01, [2779, 2786, 2792, 2780, 2750, 2765, 2740, 2734]],
      ['TSLA', 960.85, -40.91, [993, 990, 985, 983, 970, 985, 988, 960]],
    ]
  });
  
  useEffect(() => {
    grid.render(wrapperRef.current);
  });
  
  return <div ref={wrapperRef} />;
}

export default History;