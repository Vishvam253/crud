import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaPlus, FaSignOutAlt, FaEdit, FaTrash, FaFilePdf, FaBars, FaTimes } from 'react-icons/fa';

const SortableRow = ({ product, index, onEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product._id });
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="text-gray-700 border-b hover:bg-gray-100 cursor-move"
        >
            <td className="border px-4 py-3"
               >
                {product.name}
            </td>
            <td className="border px-4 py-3">{product.category?.name || "N/A"}</td>
            <td className="border px-4 py-3">₹{product.price}</td>
            <td className="border px-4 py-3">{product.code}</td>
            <td className="border px-4 py-3">{new Date(product.manufactureDate).toLocaleDateString()}</td>
            <td className="border px-4 py-3">{new Date(product.expiryDate).toLocaleDateString()}</td>
            <td className="border px-4 py-3">{product.status}</td>
            <td className="border px-4 py-3">
                <div className="flex space-x-2">
                    {product?.images?.map((img, index) => {
                        const cleanPath = img.replace(/^public\//, '').replace(/\\/g, '/');
                        return img.endsWith(".pdf") ? (
                            <a key={index} href={`${BASE_URL}/${cleanPath}`} target="_blank" rel="noopener noreferrer">
                                <FaFilePdf size={40} className="text-red-500" />
                            </a>
                        ) : (
                            <img key={index} src={`${BASE_URL}/${cleanPath}`} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                        );
                    })}
                </div>
            </td>
            <td className="border px-4 py-3">
                <button onClick={() => onEdit(product._id)} className="mr-2 text-blue-600 hover:text-blue-800">
                    <FaEdit size={21} />
                </button>
                <button onClick={() => onDelete(product._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash size={19} />
                </button>
            </td>
        </tr>
    );
};

export default SortableRow;