import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import FeedItem from "../../components/Posts/FeedItem";
import { useSelector } from "react-redux";

function relativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const fetchThreadAndPosts = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`/api/threads/${id}`),
      axios.get(`/api/posts/thread/${id}`)
    ])
      .then(([threadRes, postsRes]) => {
        setThread(threadRes.data.data.thread);
        setPosts(postsRes.data.data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load thread");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchThreadAndPosts();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {loading ? (
        <div className="flex flex-col items-center py-16 opacity-70">
          <svg className="animate-spin h-8 w-8 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
          <p className="text-lg text-gray-500">Loading thread...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-16 opacity-70">
          <UserCircleIcon className="w-16 h-16 text-red-200 mb-4" />
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : !thread ? (
        <div className="flex flex-col items-center py-16 opacity-70">
          <UserCircleIcon className="w-16 h-16 text-indigo-200 mb-4" />
          <p className="text-lg text-gray-500">Thread not found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl shadow p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={thread.author?.avatar || "/avatar.svg"}
                alt={thread.author?.firstName || "User"}
                className="w-10 h-10 rounded-full object-cover border border-indigo-100 dark:border-gray-800 shadow-sm"
              />
              <span className="font-semibold text-gray-900 dark:text-white mr-2">{thread.author?.firstName || "User"}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{thread.type?.toUpperCase()}</span>
              <span className="text-xs text-gray-400 ml-auto">{relativeTime(thread.createdAt)}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{thread.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{thread.description}</p>
            <div className="flex gap-2 flex-wrap">
              {thread.tags?.map((tag) => (
                <span key={tag} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-medium">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Replies</h3>
            {posts.length === 0 ? (
              <div className="text-gray-500">No replies yet.</div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <FeedItem
                    key={post._id}
                    item={{
                      ...post,
                      id: post._id,
                      type: post.type,
                      author: post.author?.firstName || "User",
                      avatar: post.author?.avatar,
                      title: post.title,
                      content: post.content,
                      createdAt: post.createdAt,
                      tags: post.tags || [],
                      relativeTime: relativeTime(post.createdAt),
                      authorId: post.author?._id,
                    }}
                    currentUser={user}
                    onPostUpdated={fetchThreadAndPosts}
                    onPostDeleted={fetchThreadAndPosts}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 