
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import CategoryPage from './pages/Categories/CategoryPage'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (

    <Routes>

      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/add-product' element={<AddProduct />}></Route>
      <Route path='/edit-Product/:id' element={<EditProduct />}></Route>
      <Route path='/categories' element={<CategoryPage />} />

      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>}>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
     
    
  )
}

export default App
