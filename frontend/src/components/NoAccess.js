import React from "react";

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


function NoAccess() {

  return (
    <div style={{"width": "500px", "margin-left": "10%", "margin-top": "100px"}}>
      <Button variant="outline-primary" href="/login">
          Login
      </Button>
    </div>
  );
}

export default NoAccess;
