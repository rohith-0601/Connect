import UserLayout from "@/layout/ClientLayout";
import Dashboardlayout from "@/layout/Dashboardlayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConnectionRequest } from "@/config/redux/action/Authaction";
import { BASE_URL } from "@/config";

function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getConnectionRequest({ token }));
    }
  }, [dispatch]);

  const connections = authState.connections?.filter(
    (conn) => conn.status === true
  ) || [];

  return (
    <UserLayout>
      <Dashboardlayout>
        <div className="container py-4">
          <h2 className="mb-4">👥 My Connections</h2>

          {connections.length === 0 ? (
            <p>No connections found.</p>
          ) : (
            <div className="row">
              {connections.map((conn, index) => {
  if (!conn || !conn.userId || !conn.connectionId) return null;

  const currentUserId = authState.user?._id;
  const connectionUser =
    conn.connectionId._id === currentUserId ? conn.userId : conn.connectionId;

  if (!connectionUser) return null;

  return (
    <div className="col-md-4 mb-4" key={index}>
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <img
            src={`${BASE_URL}/uploads/${connectionUser.Profile}`}
            alt="Profile"
            className="rounded-circle mb-3"
            width="80"
            height="80"
            style={{ objectFit: "cover" }}
          />
          <h5 className="card-title">{connectionUser.name}</h5>
          <p className="card-text">@{connectionUser.username}</p>
          <p className="text-muted">{connectionUser.email}</p>
        </div>
      </div>
    </div>
  );
})}

            </div>
          )}
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export default MyConnections;
