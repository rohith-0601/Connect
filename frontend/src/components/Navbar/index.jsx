import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { reset } from "@/config/redux/reducer/authReducer";

function Navbar() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  const router = useRouter();
  return (
    <div className="container">
      <div className="row">
        <nav className="navbar border-bottom ">
          <h3
            onClick={() => {
              router.push("/");
            }}
            style={{ cursor: "pointer" }}
          >
            <b>Connect</b>
          </h3>
          {authState.isProfileFetched ? (
            <div className="d-flex align-items-center gap-3">
              <h4 className="m-0 ">Hey {authState.user.userId.name} 🖐🏻</h4>
              <button
              onClick={() => {
                router.push("/login");
                dispatch(reset())
              }}
              className="btn btn-primary "
            >
              Logout
            </button>
              <FontAwesomeIcon style={{fontSize:"2.5rem"}} icon={faUser} />
              
            </div>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="btn btn-primary "
            >
              Be a part
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
