import React from "react";
import Modal from "react-modal";
import axios from "axios";  
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const DeleteModal = ({ isOpen, onClose, productId, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const handleDelete = async () => {
        if (!productId) {
            alert("Invalid product ID!");
            return;
        }
        try {
            // console.log("Deleting product with ID:", productId);
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8081/api/v1/product/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
             
            if(typeof onDeleteSuccess === 'function'){
                toast.success("Product deleted successfully!");
                setTimeout(()=> { onDeleteSuccess(); 
                navigate("/dashboard")}, 2000);
            }   
            onClose();
        } catch (error) {2
            console.error("Delete Error:", error);
            alert("Failed to delete product!");
        }
    };
   
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirm Delete"
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border"
            overlayClassName="fixed inset-0 backdrop-blur-sm bg-opacity-20 flex justify-center items-center"
        >
            <h2 className="text-xl font-bold">⚠Confirm Delete</h2>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded" 
                disabled ={!productId}>Delete</button>
            </div>
           <ToastContainer position="top-right" autoClose = {2000}/>
        </Modal>
    );
};

export default DeleteModal;
