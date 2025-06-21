import { getAboutUser, getAllUsers } from "@/config/redux/action/Authaction";
import {
  addComment,
  createPost,
  deletePost,
  getAllcomments,
  getAllposts,
  incrementLikes,
} from "@/config/redux/action/Postaction";
import UserLayout from "@/layout/ClientLayout";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTokenisThere,
  setTokenisNotThere,
} from "@/config/redux/reducer/authReducer";
import { BASE_URL } from "@/config";
import { resetpostId } from "@/config/redux/reducer/postReducer";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [postContent, setpostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      dispatch(setTokenisNotThere());
      router.push("/login");
      return;
    }

    dispatch(setTokenisThere());
    dispatch(getAllposts());
    dispatch(getAboutUser({ token }));

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const handleupload = (e) => {
    e.preventDefault();
    if (!postContent && !selectedFile) {
      alert("Post something or upload a file.");
      return;
    }
    dispatch(createPost({ media: selectedFile, body: postContent })).then(
      () => {
        dispatch(getAllposts());
      }
    );
    setpostContent("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <UserLayout>
      <Dashboardlayout>
        <div className="container">
          <div className="row">
            <div className="col">
              {authState.user?.userId?.Profile ? (
                <div className="d-flex align-items-start gap-3 p-3 border rounded shadow-sm">
                  {/* Profile Image */}
                  <img
                    src={`${BASE_URL}/uploads/${authState.user.userId.Profile}`}
                    alt="User profile"
                    width="60"
                    height="60"
                    className="rounded-circle object-fit-cover"
                  />

                  {/* Textarea and Buttons */}
                  <div className="flex-grow-1 d-flex flex-column gap-2">
                    <textarea
                      name="post"
                      id="textarea"
                      placeholder="What's up?"
                      className="form-control"
                      rows="3"
                      onChange={(e) => setpostContent(e.target.value)}
                      value={postContent}
                    ></textarea>

                    {/* BUTTON ROW */}
                    <div className="d-flex justify-content-end gap-2">
                      {/* Upload Button */}
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload
                      </button>

                      {/* Post Button */}
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-1"
                        onClick={handleupload}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          width="20"
                          height="20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        Post
                      </button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          console.log("Selected file:", file.name);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p>Loading user profile...</p>
              )}
            </div>
          </div>
          <div className="container mt-4">
            {postState.posts?.map((post) => {
              // If post.userId is missing, skip rendering this card
              if (!post?.userId || !authState?.user?.userId) return null;

              return (
                <div key={post._id} className="card shadow-sm mb-3">
                  <div className="card-body d-flex flex-column gap-3">
                    {/* Profile + Name */}
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${BASE_URL}/uploads/${post.userId.Profile}`}
                        alt="Profile"
                        width="50"
                        height="50"
                        className="rounded-circle object-fit-cover"
                      />
                      <h5 className="mb-0">{post.userId.name}</h5>
                    </div>

                    {/* Post Content */}
                    <p className="mb-2">{post.body}</p>

                    {/* Optional Media */}
                    {post.media && (
                      <img
                        src={`${BASE_URL}/uploads/${post.media}`}
                        alt="post-media"
                        className="img-fluid rounded"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    )}

                    {/* Delete Button for Post Owner */}
                    {post.userId._id === authState.user.userId._id && (
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() =>
                            dispatch(
                              deletePost({
                                token: localStorage.getItem("token"),
                                post_id: post._id,
                              })
                            ).then(() => {
                              dispatch(getAllposts());
                            })
                          }
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div className="d-flex align-items-start gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                          width="30"
                          height="30"
                          onClick={async () => {
                            await dispatch(
                              incrementLikes({ post_id: post._id })
                            );
                            dispatch(getAllposts());
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <span>{post.likes || 0} Likes</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width="30"
                        height="30"
                        onClick={async () => {
                          await dispatch(getAllcomments({ post_id: post._id }));
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {String(postState.postId) === String(post._id) && (
                    <div className="mt-3 p-3 border rounded bg-light">
                      <h6 className="mb-3">Comments</h6>

                      {postState.comments?.length > 0 ? (
                        postState.comments.map((comment, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start mb-3 gap-2"
                          >
                            {comment.userId?.Profile && (
                              <img
                                src={`${BASE_URL}/uploads/${comment.userId.Profile}`}
                                alt="Profile"
                                width="40"
                                height="40"
                                className="rounded-circle object-fit-cover"
                              />
                            )}
                            <div className="bg-white p-2 rounded shadow-sm flex-grow-1">
                              <div className="fw-bold">
                                {comment.userId?.name || "Anonymous"}
                              </div>
                              <div>{comment.body}</div>
                             
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No comments yet.</p>
                      )}

                      {/* Comment input */}
                      <div className="mt-3 d-flex gap-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            if (!newComment.trim()) return;
                            await dispatch(
                              addComment({
                                post_id: post._id,
                                body: newComment,
                              })
                            );
                            setNewComment("");
                            dispatch(getAllcomments({ post_id: post._id }));
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export default Dashboard;
