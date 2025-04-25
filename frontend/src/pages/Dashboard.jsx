import { useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { FaPlus, FaSignOutAlt, FaEdit, FaTrash, FaFilePdf, FaBars, FaTimes } from 'react-icons/fa';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import AddCategory from './AddCategory';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import SortableRow from './SortableRow';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categories, setCategories] = useState([]);

    const addProductRef = useRef(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get(`/product/get?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleAddProduct = () => {
        setEditProductId(null);
        setIsDrawerOpen(true);
    }

    const handleEditProduct = (id) => {
        setEditProductId(id);
        setIsDrawerOpen(true);
    }

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
            console.log("category fetching error", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const sensors = useSensors(useSensor(PointerSensor,{activationConstraint:{distance: 5,}}))

    return (
        <div className="p-6 bg-gray-200 min-h-screen">
            <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>

                <button
                    onClick={() => navigate('/categories')}
                    className='bg-blue-500 text-white px-4 p-3 rounded-md hover:bg-blue-700'>
                    Categories
                </button>


                <div className="flex space-x-4">
                    <button onClick={() => setShowAddCategory(true)} className='bg-green-500 text-white px-4 rounded-md hover:bg-green-700'>
                        Add Category
                    </button>

                    <button
                        onClick={handleAddProduct}
                        className="bg-gray-800 text-white p-3 rounded-md px-5 focus:outline-none"
                    > Add Product
                    </button>
                    <button
                        className='w-full flex items-center bg-red-500 hover:bg-red-600
                        text-white px-4 py-3 rounded-md'
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search by name or category"
                className="w-full p-3 border rounded-xl mb-4 shadow-sm focus:outline-none text-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto rounded-xl">
                <table className="w-full bg-white shadow-lg rounded-lg border border-gray-300 
                text-md font-semibold">
                    <thead className="bg-gray-300">
                        <tr className="text-left">
                            {['Name', 'Category', 'Price', 'Code', 'Manf. Date', 'Exp. Date', 'Status', 'Files', 'Actions'].map(header => (
                                <th key={header} className="border border-gray-300 px-4 py-3 font-semibold">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <DndContext
                        sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                                if (active.id !== over?.id) {
                                    const oldIndex = products.findIndex(p => p._id === active.id);
                                    const newIndex = products.findIndex(p => p._id === over?.id);
                                    setProducts((items) => arrayMove(items, oldIndex, newIndex));
                                }
                            }}
                        >
                            <SortableContext
                                items={products.map(p => p._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <SortableRow
                                            key={product._id}
                                            product={product}
                                            onEdit={handleEditProduct}
                                            onDelete={(id) => {
                                                setModalOpen(true);
                                                setSelectedProductId(id);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center p-6 text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </SortableContext>
                        </DndContext>

                    </tbody>
                </table>
            </div>


            {isDrawerOpen && (

                <div
                    className="fixed inset-0 bg-black/30 bg-opacity-20 backdrop-blur-sm justify-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div
                        className={`fixed top-0 right-0 w-[600px] h-full bg-white shadow-xl rounded-lg transform 
                        transition-transform duration-500 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
                        style={{ maxHeight: "100vh", overflowX: "auto" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {editProductId ? (
                            <EditProduct id={editProductId} closeDrawer={() => setIsDrawerOpen(false)} refreshProducts={fetchProducts} />
                        ) : (
                            <AddProduct ref={addProductRef} closeDrawer={() => setIsDrawerOpen(false)} refreshProducts={fetchProducts} />
                        )}

                    </div>
                </div>
            )}

            {showAddCategory && (
                <div
                    className='fixed inset-0 bg-black/30 bg-opacity-20 backdrop-blur-sm justify-end'
                    onClick={() => setShowAddCategory(false)}
                >
                    <div
                        className={`fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl rounded-lg transform 
                        transition-transform duration-500 ${showAddCategory ? "translate-x-0" : "translate-x-full"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddCategory
                            closeDrawer={() => setShowAddCategory(false)}
                            refreshCategories={() => {
                                if (addProductRef.current) {
                                    addProductRef.current.refreshCategories()
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            <DeleteModal isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProductId(null);
                }}
                productId={selectedProductId}
                onDeleteSuccess={fetchProducts}
            />
        </div>
    );
};

export default Dashboard;
