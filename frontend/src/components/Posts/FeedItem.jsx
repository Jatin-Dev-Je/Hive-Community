import React, { useState } from "react";
import { HeartIcon, ChatBubbleLeftEllipsisIcon, ShareIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updatePost, deletePost, likePost, dislikePost } from "../../api/posts";
import { fetchRepliesByPost, createReply } from "../../api/replies";

export default function FeedItem({ item, currentUser, onPostUpdated, onPostDeleted }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTitle, setEditTitle] = useState(item.title);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replying, setReplying] = useState(false);

  const typeColors = {
    thread: "bg-blue-100 text-blue-700",
    question: "bg-yellow-100 text-yellow-700",
    milestone: "bg-green-100 text-green-700",
  };

  const isOwner = currentUser && (currentUser._id === item.authorId || currentUser.username === item.author);

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePost(item._id, { title: editTitle, content: editContent });
      setShowEdit(false);
      if (onPostUpdated) onPostUpdated();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deletePost(item._id);
      setShowDelete(false);
      if (onPostDeleted) onPostDeleted();
    } finally {
      setSaving(false);
    }
  };

  const handleShowReplies = async () => {
    setShowReplies((prev) => !prev);
    if (!showReplies) {
      setLoadingReplies(true);
      const res = await fetchRepliesByPost(item._id);
      setReplies(res.data?.replies || []);
      setLoadingReplies(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    setReplying(true);
    await createReply({ post: item._id, content: replyContent });
    setReplyContent("");
    // Refresh replies
    const res = await fetchRepliesByPost(item._id);
    setReplies(res.data?.replies || []);
    setReplying(false);
  };

  return (
    <div className="rounded-xl shadow p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.015] hover:shadow-lg group mb-6">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={item.avatar || "/avatar.svg"}
          alt={item.author}
          className="w-10 h-10 rounded-full object-cover border border-indigo-100 dark:border-gray-800 shadow-sm"
        />
        <div className="flex-1">
          <span className="font-semibold text-gray-900 dark:text-white mr-2">{item.author}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColors[item.type]}`}>{item.type.toUpperCase()}</span>
        </div>
        <span className="text-xs text-gray-400">{item.relativeTime || new Date(item.createdAt).toLocaleString()}</span>
        {isOwner && (
          <>
            <button className="ml-2 text-indigo-500 hover:text-indigo-700" onClick={() => setShowEdit(true)} title="Edit"><PencilIcon className="w-5 h-5" /></button>
            <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => setShowDelete(true)} title="Delete"><TrashIcon className="w-5 h-5" /></button>
          </>
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-700 transition">{item.title}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{item.content}</p>
      <div className="flex gap-2 flex-wrap mb-3">
        {item.tags.map((tag) => (
          <span key={tag} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-medium">#{tag}</span>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition text-sm font-medium" onClick={() => likePost(item._id)}>
          <HeartIcon className="w-5 h-5" /> Like
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition text-sm font-medium" onClick={handleShowReplies}>
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> Comment
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition text-sm font-medium">
          <ShareIcon className="w-5 h-5" /> Share
        </button>
      </div>
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleEdit}>
            <h3 className="text-lg font-bold mb-4">Edit Post</h3>
            <input
              className="w-full mb-2 px-3 py-2 border rounded"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
              placeholder="Title"
            />
            <textarea
              className="w-full mb-2 px-3 py-2 border rounded"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              required
              rows={4}
              placeholder="Content"
            />
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowEdit(false)} disabled={saving}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Delete Post?</h3>
            <p className="mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete} disabled={saving}>{saving ? "Deleting..." : "Delete"}</button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowDelete(false)} disabled={saving}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Replies Section */}
      {showReplies && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Comments</h4>
          {loadingReplies ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="space-y-3 mb-3">
              {replies.length === 0 ? (
                <div className="text-gray-400">No comments yet.</div>
              ) : (
                replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={reply.author?.avatar || "/avatar.svg"} alt={reply.author?.firstName || "User"} className="w-7 h-7 rounded-full object-cover border" />
                      <span className="font-medium text-gray-900 dark:text-white">{reply.author?.firstName || "User"}</span>
                      <span className="text-xs text-gray-400 ml-auto">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">{reply.content}</div>
                  </div>
                ))
              )}
            </div>
          )}
          <form className="flex gap-2" onSubmit={handleAddReply}>
            <input
              className="flex-1 px-3 py-2 border rounded"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Add a comment..."
              required
              disabled={replying}
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={replying || !replyContent}>{replying ? "Posting..." : "Post"}</button>
          </form>
        </div>
      )}
    </div>
  );
} 