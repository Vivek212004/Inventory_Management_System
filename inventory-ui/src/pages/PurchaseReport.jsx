import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8082";

function PurchaseReport() {

    const [vendors, setVendors] = useState([]);

    const [vendorName, setVendorName] =
        useState("");

    const [selectedVendor, setSelectedVendor] =
        useState(null);

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [reports, setReports] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searched, setSearched] =
        useState(false);


    // =========================
    // LOAD VENDORS
    // =========================

    useEffect(() => {

        loadVendors();

    }, []);


    const loadVendors = async () => {

        try {

            setError("");

            const response =
                await fetch(
                    `${BASE_URL}/vendors`
                );

            if (!response.ok) {
                throw new Error(
                    "Unable to load vendors"
                );
            }

            const data =
                await response.json();

            setVendors(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            setError(err.message);

        }

    };


    // =========================
    // VENDOR CHANGE
    // =========================

    const handleVendorChange =
        (event) => {

            const name =
                event.target.value;

            setVendorName(name);

            const vendor =
                vendors.find(
                    item =>
                        item.vendorName === name
                );

            setSelectedVendor(
                vendor || null
            );

            // Clear previous report
            setReports([]);
            setSearched(false);
        };


    // =========================
    // GENERATE REPORT
    // =========================

    const generateReport =
        async (event) => {

            event.preventDefault();

            setError("");
            setReports([]);
            setSearched(false);

            if (!vendorName) {

                setError(
                    "Please select a vendor."
                );

                return;
            }

            if (!fromDate || !toDate) {

                setError(
                    "Please select both dates."
                );

                return;
            }

            if (fromDate > toDate) {

                setError(
                    "From date cannot be after To date."
                );

                return;
            }

            setLoading(true);

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/report/controller/getPurchaseDetails`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                fromDate:
                                    fromDate,

                                toDate:
                                    toDate,

                                vendorName:
                                    vendorName

                            })
                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to generate report."
                    );
                }

                const data =
                    await response.json();

                setReports(
                    Array.isArray(data)
                        ? data
                        : []
                );

                setSearched(true);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }
        };


    // =========================
    // CLEAR
    // =========================

    const clearFilters = () => {

        setVendorName("");
        setSelectedVendor(null);
        setFromDate("");
        setToDate("");
        setReports([]);
        setSearched(false);
        setError("");
    };


    // =========================
    // QUICK DATE RANGE
    // =========================

    const setQuickRange =
        (range) => {

            const today =
                new Date();

            const formatDate =
                (date) => {

                    const year =
                        date.getFullYear();

                    const month =
                        String(
                            date.getMonth() + 1
                        ).padStart(2, "0");

                    const day =
                        String(
                            date.getDate()
                        ).padStart(2, "0");

                    return `${year}-${month}-${day}`;
                };


            if (range === "month") {

                const firstDay =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                    );

                setFromDate(
                    formatDate(firstDay)
                );

                setToDate(
                    formatDate(today)
                );
            }


            if (range === "3months") {

                const date =
                    new Date(today);

                date.setMonth(
                    date.getMonth() - 3
                );

                setFromDate(
                    formatDate(date)
                );

                setToDate(
                    formatDate(today)
                );
            }


            if (range === "year") {

                const firstDay =
                    new Date(
                        today.getFullYear(),
                        0,
                        1
                    );

                setFromDate(
                    formatDate(firstDay)
                );

                setToDate(
                    formatDate(today)
                );
            }

        };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parts =
            date.split("-");

        if (parts.length !== 3) {
            return date;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };


    // =========================
    // TOTALS
    // =========================

    const totalAmount =
        reports.reduce(
            (total, item) =>
                total +
                Number(
                    item.purchaseAmount || 0
                ),
            0
        );


    const totalQuantity =
        reports.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    return (

        <div className="report-page">

            {/* =========================
                HEADER
               ========================= */}

            <div className="report-header">

                <div>

                    <span className="report-label">
                        PURCHASE ANALYTICS
                    </span>

                    <h1>
                        Vendor-wise Purchase Report
                    </h1>

                    <p>
                        View purchase transactions
                        for a selected vendor and
                        date range.
                    </p>

                </div>

                <div className="report-icon">
                    📊
                </div>

            </div>


            {/* =========================
                ERROR
               ========================= */}

            {error && (

                <div className="report-error">

                    <span>⚠</span>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =========================
                FILTER CARD
               ========================= */}

            <div className="report-filter-card">

                <div className="filter-heading">

                    <div className="filter-number">
                        01
                    </div>

                    <div>

                        <h2>
                            Report Filters
                        </h2>

                        <p>
                            Select vendor and
                            reporting period.
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={generateReport}
                >

                    <div className="report-filter-grid">


                        {/* Vendor */}

                        <div className="report-field vendor-field">

                            <label>
                                Vendor
                            </label>

                            <select
                                value={vendorName}
                                onChange={
                                    handleVendorChange
                                }
                                required
                            >

                                <option value="">
                                    Select Vendor
                                </option>

                                {vendors.map(
                                    vendor => (

                                        <option
                                            key={
                                                vendor.vendorId
                                            }
                                            value={
                                                vendor.vendorName
                                            }
                                        >
                                            {
                                                vendor.vendorName
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* From Date */}

                        <div className="report-field">

                            <label>
                                From Date
                            </label>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={
                                    event =>
                                        setFromDate(
                                            event.target.value
                                        )
                                }
                                required
                            />

                        </div>


                        {/* To Date */}

                        <div className="report-field">

                            <label>
                                To Date
                            </label>

                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    event =>
                                        setToDate(
                                            event.target.value
                                        )
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* Quick ranges */}

                    <div className="quick-range">

                        <span>
                            Quick range:
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setQuickRange(
                                    "month"
                                )
                            }
                        >
                            This Month
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setQuickRange(
                                    "3months"
                                )
                            }
                        >
                            Last 3 Months
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setQuickRange(
                                    "year"
                                )
                            }
                        >
                            This Year
                        </button>

                    </div>


                    {/* Actions */}

                    <div className="report-actions">

                        <button
                            type="button"
                            className="clear-btn"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="generate-btn"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>
                                    Generating...
                                </>

                            ) : (

                                <>
                                    Generate Report
                                    <span>→</span>
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>


            {/* =========================
                VENDOR DETAILS
               ========================= */}

            {selectedVendor && (

                <div className="report-vendor-card">

                    <div className="report-vendor-main">

                        <div className="report-vendor-avatar">

                            {
                                selectedVendor.vendorName
                                    ?.charAt(0)
                                    .toUpperCase()
                            }

                        </div>

                        <div>

                            <span className="small-label">
                                SELECTED VENDOR
                            </span>

                            <h2>
                                {
                                    selectedVendor.vendorName
                                }
                            </h2>

                            <span className="vendor-id">
                                ID: {
                                    selectedVendor.vendorId
                                }
                            </span>

                        </div>

                    </div>


                    <div className="report-vendor-info">

                        <div>

                            <span>
                                Contact Person
                            </span>

                            <strong>
                                {
                                    selectedVendor.contactPerson ||
                                    "-"
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Contact Number
                            </span>

                            <strong>
                                {
                                    selectedVendor.contactNumber ||
                                    "-"
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Address
                            </span>

                            <strong>
                                {
                                    selectedVendor.vendorAddress ||
                                    "-"
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================
                REPORT RESULTS
               ========================= */}

            {searched && (

                <div className="results-section">


                    {/* Results header */}

                    <div className="results-header">

                        <div>

                            <span className="report-label">
                                REPORT RESULTS
                            </span>

                            <h2>
                                Purchase Transactions
                            </h2>

                            <p>

                                {formatDate(fromDate)}
                                {" "}
                                to
                                {" "}
                                {formatDate(toDate)}

                            </p>

                        </div>


                        <div className="result-count">

                            <strong>
                                {reports.length}
                            </strong>

                            <span>
                                Transactions
                            </span>

                        </div>

                    </div>


                    {/* Statistics */}

                    {reports.length > 0 && (

                        <div className="report-stats">

                            <div className="stat-card">

                                <span className="stat-icon">
                                    ₹
                                </span>

                                <div>

                                    <span>
                                        Total Purchase
                                    </span>

                                    <strong>
                                        ₹{" "}
                                        {totalAmount.toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits:
                                                    2
                                            }
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div className="stat-card">

                                <span className="stat-icon">
                                    #
                                </span>

                                <div>

                                    <span>
                                        Total Quantity
                                    </span>

                                    <strong>
                                        {
                                            totalQuantity.toLocaleString(
                                                "en-IN"
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="stat-card">

                                <span className="stat-icon">
                                    📅
                                </span>

                                <div>

                                    <span>
                                        Date Range
                                    </span>

                                    <strong>
                                        {formatDate(
                                            fromDate
                                        )}
                                        {" - "}
                                        {formatDate(
                                            toDate
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* Table / empty */}

                    {reports.length === 0 ? (

                        <div className="empty-report">

                            <div className="empty-icon">
                                📋
                            </div>

                            <h3>
                                No purchases found
                            </h3>

                            <p>
                                There are no purchase
                                transactions for this
                                vendor within the
                                selected date range.
                            </p>

                        </div>

                    ) : (

                        <div className="report-table-card">

                            <div className="table-scroll">

                                <table className="purchase-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Brand
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Material
                                            </th>

                                            <th>
                                                Unit
                                            </th>

                                            <th className="number-column">
                                                Qty
                                            </th>

                                            <th className="amount-column">
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Transaction
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {reports.map(
                                            (purchase, index) => (

                                                <tr
                                                    key={
                                                        purchase.purchaseId ||
                                                        index
                                                    }
                                                >

                                                    <td>

                                                        <span className="purchase-id">
                                                            #
                                                            {
                                                                purchase.purchaseId
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            formatDate(
                                                                purchase.purchaseDate
                                                            )
                                                        }
                                                    </td>

                                                    <td>

                                                        <strong>
                                                            {
                                                                purchase.brandName ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </td>

                                                    <td>

                                                        <span className="code-badge">
                                                            {
                                                                purchase.materialCategoryId ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="code-badge">
                                                            {
                                                                purchase.materialTypeId ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="code-badge">
                                                            {
                                                                purchase.unitId ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td className="number-column">

                                                        {
                                                            purchase.quantity ??
                                                            "-"
                                                        }

                                                    </td>

                                                    <td className="amount-column">

                                                        <strong>
                                                            ₹{" "}
                                                            {Number(
                                                                purchase.purchaseAmount ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    minimumFractionDigits:
                                                                        2
                                                                }
                                                            )}
                                                        </strong>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                purchase.status ===
                                                                "Pending"
                                                                    ? "status-badge pending"
                                                                    : "status-badge"
                                                            }
                                                        >
                                                            {
                                                                purchase.status ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="transaction-id">
                                                            {
                                                                purchase.transactionId ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

export default PurchaseReport;