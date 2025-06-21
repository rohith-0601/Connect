import { BASE_URL, ClientServer } from "@/config";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Dashboardlayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth); // ✅

  console.log("profiles: ", authState.all_users);

  useEffect(() => {
    console.log("profiles:", authState.all_users); // ✅
  }, [authState]);

  return (
    <div className="container mt-5 text-center">
      <div className="row">
        <div className="col-3  ">
          <div
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            className="m-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="40"
              height="40"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <h4 style={{ margin: 0 }}>Home</h4>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            className="m-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              width="40"
              height="40"
              onClick={() => {
                router.push("/discover");
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <h4 style={{ margin: 0 }}>Search</h4>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            className="m-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              width="40"
              height="40"
              onClick={() => {
                router.push("/myConnections");
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>

            <h4 style={{ margin: 0 }}>My connections</h4>
          </div>
        </div>
        <div className="col-6  ">{children}</div>
        <div className="col-3">
          <h1>Top profiles</h1>
          {authState.all_profiles_fetched &&
            authState.all_users?.map((profile) => {
              const name = profile?.userId?.name || profile?.name || "Unknown";
              const profilePic = profile?.userId?.Profile || profile?.Profile;

              return (
                <div key={profile._id}>
                  {profilePic && (
                    <img
                      src={`${BASE_URL}/uploads/${profilePic}`}
                      alt="Profile"
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  )}
                  <p>{name}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Dashboardlayout;
