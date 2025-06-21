import { BASE_URL, ClientServer } from "@/config";
import { getAllposts } from "@/config/redux/action/Postaction";
import {
  getConnectionRequest,
  sendConnectionRequest,
} from "@/config/redux/action/Authaction";
import UserLayout from "@/layout/ClientLayout";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ViewProfile({ userProfile }) {
  const { userId, bio, currentPost, education, pastWork } = userProfile;
  const router = useRouter();
  const dispatch = useDispatch();

  const postState = useSelector((state) => state.post);
  const authstate = useSelector((state) => state.auth);

  const [userposts, setuserposts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");

  // ✅ Fetch posts & connection requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getAllposts());
      dispatch(getConnectionRequest({ token }));
    }
  }, [dispatch]);

  // ✅ Filter posts for viewed profile
  useEffect(() => {
    if (!router.query.username || !postState.posts.length) return;
    const filtered = postState.posts.filter(
      (post) => post.userId?.username === router.query.username
    );
    setuserposts(filtered);
  }, [postState.posts, router.query.username]);

  // ✅ Determine connection status (handle both directions)
  useEffect(() => {
    if (!userProfile?.userId?._id || !authstate?.connections) return;

    const targetId = userProfile.userId._id;

    const isConnected = authstate.connections?.some(
      (conn) =>
        (conn.connectionId?._id === targetId ||
          conn.userId?._id === targetId) &&
        conn.status === true
    );
    if (isConnected) {
      setConnectionStatus("connected");
      return;
    }

    const isPending = authstate.connections?.some(
      (conn) =>
        (conn.connectionId?._id === targetId ||
          conn.userId?._id === targetId) &&
        conn.status === false
    );
    if (isPending) {
      setConnectionStatus("pending");
      return;
    }

    setConnectionStatus("none");
  }, [authstate, userProfile]);

  // ✅ Handle connect button
  const handleConnect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found.");
      return;
    }

    dispatch(
      sendConnectionRequest({
        token,
        connectionId: userId._id,
      })
    ).then(() => {
      dispatch(getConnectionRequest({ token }));
    });
  };

  // ✅ Render button based on connection status
  const renderConnectionButton = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <button className="btn btn-success mt-3" disabled>
            Connected
          </button>
        );
      case "pending":
        return (
          <button className="btn btn-outline-secondary mt-3" disabled>
            Request Sent
          </button>
        );
      default:
        return (
          <button
            className="btn btn-outline-primary mt-3"
            onClick={handleConnect}
          >
            Connect
          </button>
        );
    }
  };

  return (
    <UserLayout>
      <Dashboardlayout>
        <div className="container py-5 bg-light min-vh-100">
          <div
            className="card mx-auto shadow-lg rounded"
            style={{ maxWidth: "800px" }}
          >
            <div
              className="position-relative bg-primary mb-3"
              style={{ height: "180px" }}
            >
              <div className="position-absolute top-100 start-50 translate-middle">
                <img
                  src={`${BASE_URL}/uploads/${userId.Profile}`}
                  alt="Profile"
                  className="rounded-circle border border-white shadow"
                  width="140"
                  height="140"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="card-body text-center mt-5">
              <h3 className="card-title mb-0">{userId.name}</h3>
              <p className="text-muted mb-1">@{userId.username}</p>
              <p className="text-muted">{userId.email}</p>
              {bio && <p className="text-dark">{bio}</p>}
              {currentPost && (
                <p className="fst-italic text-secondary">
                  Currently: {currentPost}
                </p>
              )}
              <div className="d-flex justify-content-center gap-2 mt-3">
                {renderConnectionButton()}
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={async () => {
                    try {
                      const response = await ClientServer.get(
                        `/user/download_resume?user_id=${userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/uploads/${response.data.message}`,
                        "_blank"
                      );
                    } catch (error) {
                      console.error("Resume download failed:", error);
                      alert("Resume not available or download failed.");
                    }
                  }}
                >
                  Resume
                </button>
              </div>
            </div>

            <hr className="my-0" />

            <div className="card-body">
              <h5 className="card-title">🎓 Education</h5>
              <div className="row">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <div className="border rounded p-3 bg-light">
                        <strong>{edu.degree || "Degree"}</strong>
                        <p className="mb-1">{edu.school}</p>
                        <small className="text-muted">{edu.fieldofstudy}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No education added</p>
                )}
              </div>
            </div>

            <hr className="my-0" />

            <div className="card-body">
              <h5 className="card-title">💼 Work Experience</h5>
              <div className="row">
                {pastWork.length > 0 ? (
                  pastWork.map((job, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <div className="border rounded p-3 bg-light">
                        <strong>{job.position || "Position"}</strong>
                        <p className="mb-1">{job.company}</p>
                        <small className="text-muted">{job.years}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No work experience added</p>
                )}
              </div>
            </div>

            <hr className="my-0" />

            <div className="card-body">
              <h5 className="card-title">📝 Posts</h5>
              {userposts.length > 0 ? (
                userposts.map((post, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">
                        {new Date(post.createdAt).toLocaleString()}
                      </h6>
                      <p className="card-text">{post.body}</p>
                      {post.filetype !== "none" && post.media && (
                        <div className="mt-2">
                          {["png", "jpg", "jpeg", "gif"].includes(
                            post.filetype.toLowerCase()
                          ) && (
                            <img
                              src={`${BASE_URL}/uploads/${post.media}`}
                              alt="Post Media"
                              className="img-fluid rounded"
                            />
                          )}
                          {["mp4", "webm"].includes(
                            post.filetype.toLowerCase()
                          ) && (
                            <video controls className="w-100 rounded">
                              <source
                                src={`${BASE_URL}/uploads/${post.media}`}
                                type={`video/${post.filetype}`}
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {post.filetype === "pdf" && (
                            <a
                              href={`${BASE_URL}/uploads/${post.media}`}
                              className="btn btn-sm btn-outline-secondary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View PDF
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const { data } = await ClientServer.get("/user/getuser", {
    params: { username: context.query.username },
  });

  if (!data || !data.userProfile) return { notFound: true };

  return { props: { userProfile: data.userProfile } };
}

export default ViewProfile;
