import React from "react";
import logo from "../assets/logo.png";
import emptyuser from "../assets/empty-user.png";
import { Dropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BarraSuperiorUP.css"; 

function BarraSuperiorUP() {
  return (
    <div className="barra-superior d-flex justify-content-between align-items-center px-4 py-2">
      <img src={logo} alt="Logo" className="logo" />

      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="user-toggle">
          <FaUser className="me-2" />
          Kanye West
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/logout">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default BarraSuperiorUP;
