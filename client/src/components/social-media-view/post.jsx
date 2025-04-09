import { FaUtensils, FaRegCommentAlt, FaMapMarkerAlt, FaTrash } from "react-icons/fa"; // Fork and knife, square comment, location icons
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../common/loading-spinner";
import { formatPostDate } from "../../utils/date";

// Post component with changes applied
const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const postOwner = post?.user || {};
  const isLiked = post?.likes?.includes(postOwner._id);
  const isMyPost = postOwner._id === post?.user?._id;

  const formattedDate = formatPostDate(post?.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:5300/api/social-media/post/${post?._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:5300/api/social-media/post/like/${post?._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post?._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:5300/api/social-media/post/comment/${post?._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-6 border-b border-orange-500 h-auto">
        {/* Smaller profile image */}
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profileImg || "/avatar-placeholder.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-96 object-contain rounded-lg border border-orange-500"
                alt="Post Image"
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            {/* Icons section */}
            <div className="flex gap-6 items-center w-2/3 justify-between">
              {/* Comments icon */}
              <div
                className="flex gap-2 items-center cursor-pointer group mt-2"
                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
              >
                <FaRegCommentAlt className="w-6 h-6 text-orange-500 group-hover:text-orange-400" />
                <span className="text-lg text-orange-500 group-hover:text-orange-400">
                  {post.comments.length}
                </span>
              </div>
              <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
                <div className="modal-box rounded border border-orange-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-4 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={comment?.user?.profileImg || "/avatar-placeholder.png"}
                              alt="Commenter Avatar"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{comment?.user?.fullName}</span>
                            <span className="text-gray-700 text-sm">
                              @{comment?.user?.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-orange-600 pt-7"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-2 resize-none border-2 border-orange-500 focus:outline-none"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn bg-orange-500 text-black rounded-lg btn-lg px-6 py-3">
                      {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              {/* Location icon */}
              <div className="flex gap-2 items-center group cursor-pointer mt-2">
                <FaMapMarkerAlt className="w-6 h-6 text-orange-500 group-hover:text-orange-400" />
                <span className="text-lg text-orange-500 group-hover:text-orange-400">0</span>
              </div>
              {/* Fork, plate, knife icon with orange border */}
              <div className="flex gap-2 items-center group cursor-pointer mt-2" onClick={handleLikePost}>
                {isLiking && <LoadingSpinner size="sm" />}
                <div className="w-8 h-8 flex justify-center items-center border-2 border-orange-500 rounded-full">
                  <FaUtensils className="w-5 h-5 text-orange-500" />
                </div>
                <span
                  className={`text-lg group-hover:text-orange-500 ${
                    isLiked ? "text-orange-500" : "text-slate-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
