import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";    

const EditProduct = ({id, closeDrawer, refreshProducts}) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [code, setCode] = useState("");
    const [manufactureDate, setManufactureDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("");
    const [productImages, setProductImages] = useState([]);
    const [previousImages, setPreviousImages] = useState([]);
    const [disablePrice, setDisablePrice] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setDisablePrice(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/api/v1/product/${id}`);

                if (res.data.success) {
                    const product = res.data.data;

                    setName(product.name || "");
                    setCategory(product.category || "");
                    setPrice(product.price || "");
                    setCode(product.code || "");
                    setManufactureDate(product.manufactureDate?.split("T")[0] || "");
                    setExpiryDate(product.expiryDate?.split("T")[0] || "");
                    setStatus(product.status || "Available");

                    if (product.images?.length > 0) {
                        setPreviousImages(product.images.map(image => `${BASE_URL}/${image}`));
                    } else {
                        setPreviousImages([]);
                    }

                    if (product.priceChangedDate) {
                        const lastUpdate = moment(product.priceChangedDate);
                        const todayStart = moment().startOf("day");

                        if (lastUpdate.isAfter(todayStart)) {
                            setDisablePrice(true);
                            // toast.warning("Price can only be updated once per day!");
                        } else {
                            setDisablePrice(false);
                        }
                    } else {
                        setDisablePrice(false);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("code", code);
        formData.append("manufactureDate", manufactureDate);
        formData.append("expiryDate", expiryDate);
        formData.append("status", status);

        if (productImages.length > 0) {
            Array.from(productImages).forEach(image => {
                formData.append("productImage", image);
            });
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You are not authorized");
                navigate("/login");
                return;
            }

            const res = await axios.put(`${BASE_URL}/api/v1/product/update/${id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },  
            });

            if (res.data.success) {
                toast.success("Product updated successfully!");

                setTimeout(() => closeDrawer(), 2000);
                refreshProducts();
            } else {
                toast.error(res.data.message || "Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-500 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Product</h2>

                <form onSubmit={handleUpdateProduct} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Product Name:</label>
                            <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Category:</label>
                            <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Price:</label>
                        <input type="number" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            value={price} onChange={(e) => setPrice(e.target.value)} required disabled={disablePrice} />
                        {disablePrice && (
                            <p className="text-red-500 text-sm mt-1">[price can only be updated once per day.]</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Product Code:</label>
                        <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            value={code} onChange={(e) => setCode(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Manufacture Date:</label>
                            <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Expiry Date:</label>
                            <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Status:</label>
                        <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </div>

                 
                    {previousImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-gray-700 font-medium">Current Images:</p>
                                
                            <div className="flex flex-wrap gap-2 mt-2">
                                {previousImages.map((image, index) => (
                                    <div key={index} className="relative">

                                        {image.endsWith(".pdf") ? (
                                            <a href={image} target="_blank" rel="noopener noreferrer" 
                                            className="text-blue-600 font-semibold hover:underline">
                                                📄 PDF {index + 1}
                                            </a>
                                        ) : (
                                            <img src={image} alt={`Product ${index}`}
                                            className="w-24 h-24 object-cover rounded-md shadow" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                  
                    <div className="mt-4">
                        <label className="text-gray-700 font-medium">Product Images / PDFs:</label>
                        <div className="relative border border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center">
                            <input
                                type="file"
                                accept="image/*, application/pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    setProductImages(files);
                                    setPreviousImages(files.map(file => URL.createObjectURL(file)));
                                }}
                            />
                            <p className="text-gray-500 text-sm font-medium">Click to upload or drag & drop files here</p>
                        </div>

                       
                        {productImages.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {Array.from(productImages).map((file, index) => (
                                    <p key={index} className="text-gray-700 text-sm truncate">
                                        📄 {file.name}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                    py-3 rounded-md font-semibold transition-all duration-300">
                        Update Product
                    </button>
                </form>

                <ToastContainer position="top-right" autoClose={2000} />
            </div>
        </div>
    );
};

export default EditProduct;
