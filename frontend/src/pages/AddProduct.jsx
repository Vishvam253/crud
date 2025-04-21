import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = forwardRef((props, ref) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { closeDrawer, refreshProducts } = props;
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [code, setCode] = useState("");
    const [manufactureDate, setManufactureDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("Available");
    const [productImages, setProductImages] = useState([]);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("category", categoryId);
        formData.append("price", price);
        formData.append("code", code);
        formData.append("manufactureDate", manufactureDate);
        formData.append("expiryDate", expiryDate);
        formData.append("status", status);

        productImages.forEach((image) => {
            formData.append("productImages", image);
        });

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired! Please login again.");
            navigate("/login");
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/product/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.data.success) {
                toast.success("Product added successfully!");
                refreshProducts();
                setTimeout(() => {
                    closeDrawer();
                    navigate("/dashboard");
                }, 2000);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Response data:", error?.response?.data);

            alert("Failed to add product!");
        }
    };

    const handleImageChange = (e) => {
        const filesArray = Array.from(e.target.files);
        setProductImages(filesArray);
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/api/v1/category/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setCategories(res.data.data || []);
        } catch (error) {
            console.error("Error fetching categories", error)
        }
    };

    useImperativeHandle(ref, () => ({
        refreshCategories: fetchCategories,
    }))


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-500 p-4">
            <form
                onSubmit={handleAddProduct}
                className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-700">Add Product</h2>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Product Name:</label>
                    <input
                        type="text"
                        placeholder="Enter product name"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Category:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}> {cat.name} </option>
                        ))}
                    </select>
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Price:</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Product Code:</label>
                    <input
                        type="text"
                        placeholder="Enter product code"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Manufacture Date:</label>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={manufactureDate}
                        onChange={(e) => setManufactureDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Expiry Date:</label>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Status:</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">Upload Images/PDF:</label>
                    <input
                        type="file"
                        accept="image/*, application/pdf"
                        multiple
                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={handleImageChange}
                        required
                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold shadow-lg transition-all duration-300"
                >
                    Add Product
                </button>
            </form>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
});

export default AddProduct;
