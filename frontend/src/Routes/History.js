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


  function health_scale_chart(cell) {
    let style = 'green';
    if (cell  < 3) {
      style = 'red';
    }else if (cell < 5) {
      style = 'orange';
    }else if (cell < 7) {
      style = 'yellow';
    }else {
      style = 'green';
    }
    const chart = h('b', { style: {
      'color': style,
    }}, cell);
    return chart;
  }

  
  const grid = new Grid({
    sort: true,
    resizable: true,
    search: true,
    columns: [
      "Animal_id",
      // "Animal",
      "Type",
      "User ID",
      // "User",
      { 
        name: 'Health', 
        formatter: (cell) => {
          return health_scale_chart(cell);
        }
      },
      "Description",
      "Date",
      "Media Link",
      {
        name: "Autocheck",
        sort: false,
        width: '20%',
        formatter: (cell) => {
          const ref = gCreateRef();
          const chart = h('div', { ref: ref });
          // setTimeout to ensure that the chart wrapper is mounted
          setTimeout(() => {
          }, 0);
          return chart;
        }
      }],
      server: {
        url: "http://localhost:8000/api/v1/history/list",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        then: data => data.map(history => [
          history.animal_id,
          // history.animal.name,
          history.type,
          history.user_id,
          // history.user.username,
          history.health_scale,
          history.description,
          history.date,
          history.media_link,
          history.autocheck
        ]),
    },
  });
  
  useEffect(() => {
    // empty grid container first
    wrapperRef.current.innerHTML = "";
    grid.render(wrapperRef.current);
  });
  return <div style={{"margin-left": "3%", "margin-right": "5%"}} ref={wrapperRef} />;
}

export default History;