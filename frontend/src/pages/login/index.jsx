import UserLayout from "@/layout/ClientLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/Authaction";

function LoginComponent() {
  let [login, setlogin] = useState(true);
  let [username, setusername] = useState("");
  let [name, setname] = useState("");
  let [email, setemail] = useState("");
  let [password, setpassword] = useState("");

  const authState = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
  if (authState.isLoggedIn) {
    router.push("/dashboard");
  }
}, [authState.isLoggedIn]);

  return (
    <UserLayout>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        {login ? (
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mb-4 mb-md-0 text-center">
                <img
                  src="images/79.Login_.png"
                  alt="login"
                  className="img-fluid"
                />
              </div>
              <div className="col-12 col-md-6 mt-5 mt-md-5">
                <div className="container justify-content-center align-items-center">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dispatch(loginUser({ email, password }));
                    }}
                  >
                    <div className="row mb-3 text-center">
                      <h1>Login</h1>
                    </div>
                    <div className="row m-3">
                      <label htmlFor="email" className="mb-1 p-0">
                        Email:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="email"
                        id="email"
                        onChange={(e) => {
                          setemail(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <label htmlFor="email" className="mb-1 p-0">
                        Password:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        onChange={(e) => {
                          setpassword(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <button type="submit" className="btn btn-primary w-100 ">
                        {authState.isLoading ? "logging in.." : "Login"}
                        
                      </button>
                    </div>
                    <div className="row m-3 text-center">
                      <p>
                        New User?{" "}
                        <a
                          className=""
                          style={{ cursor: "pointer" }}
                          onClick={() => setlogin(false)}
                        >
                          Register
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 mt-3 mt-md-5 ">
                <div className="container justify-content-center align-items-center">
                  <div className="row mb-3 text-center">
                    <h1>Register</h1>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dispatch(
                        registerUser({ username, name, email, password })
                      );
                    }}
                  >
                    <div className="row m-3">
                      <label htmlFor="username" className="mb-1 p-0">
                        Username:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        id="Username"
                        onChange={(e) => {
                          setusername(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <label htmlFor="Name" className="mb-1 p-0">
                        Name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        id="Name"
                        onChange={(e) => {
                          setname(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <label htmlFor="email" className="mb-1 p-0">
                        Email:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="email"
                        id="email"
                        onChange={(e) => setemail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <label htmlFor="email" className="mb-1 p-0">
                        Password:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        onChange={(e) => setpassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="row m-3">
                      <button type="submit" className="btn btn-primary w-100 ">
                         {authState.isLoading ? "creating..." : "Register "}
                        
                      </button>
                    </div>
                    <div className="row m-3 text-center">
                      <p>
                        Already a User?{" "}
                        <a
                          className=""
                          style={{ cursor: "pointer" }}
                          onClick={() => setlogin(true)}
                        >
                          Login
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-12 col-md-6 mt-5 mb-4 mb-md-0 text-center">
                <img
                  src="images/78.Virtual-reality.png"
                  alt="login"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
