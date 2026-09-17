import { Link } from "react-router-dom";

function Home() {

  return (

    <div className="home-container">

      <section className="hero">

        <h1>
          Purchase Management System
        </h1>

        <p>
          Manage purchase orders and generate
          vendor-wise purchase reports.
        </p>

        <div className="home-buttons">

          <Link
            to="/purchase"
            className="btn"
          >
            Enter Purchase Order
          </Link>

          <Link
            to="/reports"
            className="btn secondary"
          >
            Purchase Reports
          </Link>

        </div>

      </section>

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            📝
          </div>

          <h2>
            Purchase Order
          </h2>

          <p>
            Create and submit purchase orders
            with vendor and material information.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            🏢
          </div>

          <h2>
            Vendors
          </h2>

          <p>
            Select vendors and manage their
            purchase transactions.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            📊
          </div>

          <h2>
            Reports
          </h2>

          <p>
            Generate vendor-wise reports
            for a selected date range.
          </p>

        </div>

      </section>

    </div>

  );

}

export default Home;