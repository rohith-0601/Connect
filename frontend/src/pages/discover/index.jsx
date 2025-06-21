import { BASE_URL } from "@/config";
import { getAllUsers } from "@/config/redux/action/Authaction";
import UserLayout from "@/layout/ClientLayout";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function discoverPage() {
  const authstate = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    if (!authstate.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
      <Dashboardlayout>
        <h1>Discover</h1>
        <div className="container mt-4">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {authstate.all_profiles_fetched &&
              authstate.all_users.map((user) => (
                <div className="col" key={user._id}>
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={`${BASE_URL}/uploads/${user.userId.Profile}`}
                      className="card-img-top"
                      alt="profile"
                      onError={(e) => (e.target.src = "/default.jpg")}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{user.userId.name}</h5>
                      <h6 className="card-title text-muted" style={{cursor:"pointer"}}
                      onClick={()=>{
                        router.push(`/view_profile/${user.userId.username}`)
                      }}
                      >{user.userId.username}</h6>
                      
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export default discoverPage;
