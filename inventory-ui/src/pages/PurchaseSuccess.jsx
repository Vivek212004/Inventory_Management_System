import {
  Link,
  useLocation
} from "react-router-dom";

function PurchaseSuccess() {

  const location =
    useLocation();

  const purchase =
    location.state?.purchase;

  return (

    <div className="success-container">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Purchase Successful!
        </h1>

        <p>
          Your purchase order has been
          successfully submitted.
        </p>

        {purchase && (

          <div className="purchase-summary">

            {purchase.purchaseId && (

              <p>
                <strong>
                  Purchase ID:
                </strong>{" "}
                {purchase.purchaseId}
              </p>

            )}

            {purchase.vendorId && (

              <p>
                <strong>
                  Vendor ID:
                </strong>{" "}
                {purchase.vendorId}
              </p>

            )}

            {purchase.materialCategoryId && (

              <p>
                <strong>
                  Category:
                </strong>{" "}
                {
                  purchase.materialCategoryId
                }
              </p>

            )}

            {purchase.materialTypeId && (

              <p>
                <strong>
                  Material Type:
                </strong>{" "}
                {
                  purchase.materialTypeId
                }
              </p>

            )}

            {purchase.quantity && (

              <p>
                <strong>
                  Quantity:
                </strong>{" "}
                {purchase.quantity}
              </p>

            )}

            {purchase.price && (

              <p>
                <strong>
                  Price:
                </strong>{" "}
                {purchase.price}
              </p>

            )}

            {purchase.purchaseDate && (

              <p>
                <strong>
                  Purchase Date:
                </strong>{" "}
                {
                  purchase.purchaseDate
                }
              </p>

            )}

          </div>

        )}

        <div className="home-buttons">

          <Link
            to="/purchase"
            className="btn"
          >
            New Purchase
          </Link>

          <Link
            to="/reports"
            className="btn secondary"
          >
            View Reports
          </Link>

        </div>

      </div>

    </div>

  );

}

export default PurchaseSuccess;