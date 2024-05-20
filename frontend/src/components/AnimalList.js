
import React, { useRef, useEffect, useState } from "react";
import { Grid, h, html, createRef as gCreateRef } from "gridjs";
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
        "id",
        "address",
        "age_month",
        "age_month_from",
        "age_month_to",
        "age_year",
        "age_year_from",
        "age_year_to",
        "breed_id",
        "created_at",
        "description",
        "latitude",
        "longitude",
        "name",
        "public_url",
        "rfid_code",
        "sex",
        "species",
        "tag_id",
        "updated_at"
      ],
    server: {
      url: "http://localhost:8000/api/v1/animal/animals",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      then: data => data.map(animal => [
        animal.id,
        animal.address,
        animal.age_month,
        animal.age_month_from,
        animal.age_month_to,
        animal.age_year,
        animal.age_year_from,
        animal.age_year_to,
        animal.breed_id,
        animal.created_at,
        animal.description,
        animal.latitude,
        animal.longitude,
        animal.name,
        html(`<img src="${animal.public_url}" alt="Animal Image" width="200" height="300">`),
        animal.rfid_code,
      ]),
      total: data => data.length
    }});
  
  useEffect(() => {
    grid.render(wrapperRef.current);
  });
  
  return <div ref={wrapperRef} />;
}

export default History;