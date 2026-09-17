import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav className="navbar">

      <div className="logo">
        Purchase Management System
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/purchase">
          Purchase Order
        </Link>

        <Link to="/reports">
          Purchase Reports
        </Link>

      </div>

    </nav>

  );

}

export default Navbar;