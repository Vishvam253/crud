import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";


const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, values);

      if (res.data.success) {
        console.log("Token received", res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success("Login successfully!")
        setTimeout(()=>{
          navigate('/dashboard')
        },[2000])
      } else {
        if (res.data.message === "User not found") {
          alert("User not found!");
          navigate("/register");
        } else {
          setServerError(res.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === "User not found") {
        alert("User not found!");
        navigate("/register");
      } else {
        setServerError("Login failed!");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {serverError && <p className="text-red-500 text-center mb-3">{serverError}</p>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="block font-medium">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose= {2000}/>
    </div>
  );
};

export default Login;
