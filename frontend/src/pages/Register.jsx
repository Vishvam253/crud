import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
 const[serverError, setServerError] = useState("")
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
    .min(3, "Name must be atleast 3 characters")
    .required("Name is required"),
    email: Yup.string()
     .email("Invalid email format")
     .required("Email is required"),
    password: Yup.string()
     .min(5, "Password must be atleast 5 characters")
     .required("Password is required"),
  });

  const handleRegister = async (values) => {
  
    try { 
      const res = await axios.post("http://localhost:8081/api/v1/auth/register", values);
      console.log("Response", res.data);
      
      if (res.data.success) {
        // alert("Registered successfully!");
        navigate("/login");
      } else {
       setServerError(res.data.message)
      }
    } catch (error) {
      console.error(error);
      setServerError("Registration Failed!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {serverError && <p className="text-red-500 text-center mb-3">{serverError}</p>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="block font-medium">Name</label>
                <Field
                  id = "name"
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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
                className="w-full bg-blue-500 text-xl text-white p-2 rounded hover:bg-blue-600"
              >Register
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3 text-center text-gray-600">
      Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
