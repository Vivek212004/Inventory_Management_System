import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8082";

function PurchaseEntry() {

    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [materialTypes, setMaterialTypes] = useState([]);
    const [units, setUnits] = useState([]);

    const [selectedVendor, setSelectedVendor] =
        useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [purchase, setPurchase] = useState({
        vendorName: "",
        materialCategoryId: "",
        materialTypeId: "",
        unitId: "",
        brandName: "",
        quantity: "",
        purchaseAmount: "",
        purchaseDate: ""
    });

    useEffect(() => {
        loadVendors();
        loadCategories();
    }, []);


    // =========================
    // LOAD VENDORS
    // =========================

    const loadVendors = async () => {

        try {

            const response =
                await fetch(`${BASE_URL}/vendors`);

            if (!response.ok) {
                throw new Error("Unable to load vendors");
            }

            const data = await response.json();

            setVendors(
                Array.isArray(data) ? data : []
            );

        } catch (err) {
            setError(err.message);
        }
    };


    // =========================
    // LOAD CATEGORIES
    // =========================

    const loadCategories = async () => {

        try {

            const response =
                await fetch(`${BASE_URL}/categories`);

            if (!response.ok) {
                throw new Error(
                    "Unable to load material categories"
                );
            }

            const data = await response.json();

            setCategories(
                Array.isArray(data) ? data : []
            );

        } catch (err) {
            setError(err.message);
        }
    };


    // =========================
    // VENDOR SELECTION
    // =========================

    const handleVendorChange = (event) => {

        const vendorName = event.target.value;

        const vendor =
            vendors.find(
                item =>
                    item.vendorName === vendorName
            );

        setSelectedVendor(vendor || null);

        setPurchase(previous => ({
            ...previous,
            vendorName: vendorName
        }));
    };


    // =========================
    // NORMAL INPUT
    // =========================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setPurchase(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================
    // CATEGORY CHANGE
    // =========================

    const handleCategoryChange =
        async (event) => {

            const categoryId =
                event.target.value;

            setPurchase(previous => ({
                ...previous,
                materialCategoryId:
                    categoryId,
                materialTypeId: "",
                unitId: ""
            }));

            setMaterialTypes([]);
            setUnits([]);

            if (!categoryId) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/getUnitAndTypeList`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                materialCategoryId:
                                    categoryId
                            })
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        "Unable to load material types and units"
                    );

                }

                const data =
                    await response.json();

                setMaterialTypes(
                    data.materialTypeList || []
                );

                setUnits(
                    data.unitList || []
                );

            } catch (err) {

                setError(err.message);

            }
        };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");
            setLoading(true);

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/addPurchaseDetail`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify(purchase)
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to save purchase"
                    );

                }

                navigate(
                    "/purchase-success",
                    {
                        state: {
                            purchase:
                                data.purchase ||
                                data
                        }
                    }
                );

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }
        };


    return (

        <div className="purchase-page">

            <div className="purchase-card">

                {/* =========================
                    HEADER
                   ========================= */}

                <div className="purchase-header">

                    <div>

                        <span className="page-label">
                            PURCHASE MANAGEMENT
                        </span>

                        <h1>
                            Purchase Order
                        </h1>

                        <p>
                            Enter the details below to
                            create a new purchase order.
                        </p>

                    </div>

                    <div className="order-badge">
                        New Order
                    </div>

                </div>


                {/* =========================
                    ERROR
                   ========================= */}

                {error && (

                    <div className="error">

                        <span>⚠</span>

                        {error}

                    </div>

                )}


                <form onSubmit={handleSubmit}>


                    {/* =========================
                        VENDOR SECTION
                       ========================= */}

                    <div className="form-section">

                        <div className="section-title">

                            <div className="section-number">
                                01
                            </div>

                            <div>
                                <h2>
                                    Vendor Information
                                </h2>

                                <p>
                                    Select a vendor for
                                    this purchase.
                                </p>
                            </div>

                        </div>


                        <label htmlFor="vendorName">
                            Vendor
                        </label>

                        <select
                            id="vendorName"
                            name="vendorName"
                            value={purchase.vendorName}
                            onChange={handleVendorChange}
                            required
                        >

                            <option value="">
                                Select Vendor
                            </option>

                            {vendors.map(vendor => (

                                <option
                                    key={vendor.vendorId}
                                    value={vendor.vendorName}
                                >
                                    {vendor.vendorName}
                                </option>

                            ))}

                        </select>


                        {/* =========================
                            SELECTED VENDOR DETAILS
                           ========================= */}

                        {selectedVendor && (

                            <div className="vendor-details">

                                <div className="vendor-details-header">

                                    <div className="vendor-avatar">
                                        {selectedVendor.vendorName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                selectedVendor.vendorName
                                            }
                                        </h3>

                                        <span>
                                            Vendor ID:{" "}
                                            {
                                                selectedVendor.vendorId
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div className="vendor-info-grid">

                                    <div className="vendor-info">

                                        <span className="info-label">
                                            Contact Person
                                        </span>

                                        <strong>
                                            {
                                                selectedVendor.contactPerson ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                    <div className="vendor-info">

                                        <span className="info-label">
                                            Contact Number
                                        </span>

                                        <strong>
                                            {
                                                selectedVendor.contactNumber ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                    <div className="vendor-info vendor-address">

                                        <span className="info-label">
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

                    </div>


                    {/* =========================
                        MATERIAL SECTION
                       ========================= */}

                    <div className="form-section">

                        <div className="section-title">

                            <div className="section-number">
                                02
                            </div>

                            <div>

                                <h2>
                                    Material Information
                                </h2>

                                <p>
                                    Select category,
                                    material type and unit.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* Category */}

                            <div className="form-group">

                                <label htmlFor="materialCategoryId">
                                    Material Category
                                </label>

                                <select
                                    id="materialCategoryId"
                                    name="materialCategoryId"
                                    value={
                                        purchase.materialCategoryId
                                    }
                                    onChange={
                                        handleCategoryChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        category => (

                                            <option
                                                key={
                                                    category.categoryId
                                                }
                                                value={
                                                    category.categoryId
                                                }
                                            >
                                                {
                                                    category.categoryName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Material Type */}

                            <div className="form-group">

                                <label htmlFor="materialTypeId">
                                    Material Type
                                </label>

                                <select
                                    id="materialTypeId"
                                    name="materialTypeId"
                                    value={
                                        purchase.materialTypeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        materialTypes.length === 0
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Material Type
                                    </option>

                                    {materialTypes.map(
                                        type => (

                                            <option
                                                key={type.typeId}
                                                value={type.typeId}
                                            >
                                                {
                                                    type.typeName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Unit */}

                            <div className="form-group">

                                <label htmlFor="unitId">
                                    Unit
                                </label>

                                <select
                                    id="unitId"
                                    name="unitId"
                                    value={purchase.unitId}
                                    onChange={handleChange}
                                    disabled={
                                        units.length === 0
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Unit
                                    </option>

                                    {units.map(
                                        unit => (

                                            <option
                                                key={
                                                    unit.unitId
                                                }
                                                value={
                                                    unit.unitId
                                                }
                                            >
                                                {
                                                    unit.unitName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Brand */}

                            <div className="form-group">

                                <label htmlFor="brandName">
                                    Brand Name
                                </label>

                                <input
                                    id="brandName"
                                    type="text"
                                    name="brandName"
                                    value={
                                        purchase.brandName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Kanchi"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        PURCHASE DETAILS
                       ========================= */}

                    <div className="form-section">

                        <div className="section-title">

                            <div className="section-number">
                                03
                            </div>

                            <div>

                                <h2>
                                    Purchase Details
                                </h2>

                                <p>
                                    Enter quantity,
                                    amount and purchase date.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid three-columns">


                            {/* Quantity */}

                            <div className="form-group">

                                <label htmlFor="quantity">
                                    Quantity
                                </label>

                                <input
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={
                                        purchase.quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    placeholder="0"
                                    required
                                />

                            </div>


                            {/* Amount */}

                            <div className="form-group">

                                <label htmlFor="purchaseAmount">
                                    Purchase Amount
                                </label>

                                <div className="input-prefix">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        id="purchaseAmount"
                                        type="number"
                                        name="purchaseAmount"
                                        value={
                                            purchase.purchaseAmount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Date */}

                            <div className="form-group">

                                <label htmlFor="purchaseDate">
                                    Purchase Date
                                </label>

                                <input
                                    id="purchaseDate"
                                    type="date"
                                    name="purchaseDate"
                                    value={
                                        purchase.purchaseDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        SUMMARY
                       ========================= */}

                    {purchase.quantity &&
                        purchase.purchaseAmount && (

                            <div className="purchase-summary-box">

                                <div>

                                    <span>
                                        Order Summary
                                    </span>

                                    <strong>
                                        {purchase.vendorName ||
                                            "Select vendor"}
                                    </strong>

                                </div>

                                <div className="summary-total">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹{" "}
                                        {Number(
                                            purchase.purchaseAmount
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2
                                            }
                                        )}
                                    </strong>

                                </div>

                            </div>

                        )}


                    {/* =========================
                        ACTIONS
                       ========================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-purchase-btn"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Saving Purchase...
                                </>
                            ) : (
                                <>
                                    Submit Purchase
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default PurchaseEntry;