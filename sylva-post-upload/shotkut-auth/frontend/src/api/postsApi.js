import axiosClient from "./axiosClient.js";

export const fetchFeed = async (cursor) => {
  const { data } = await axiosClient.get("/posts", {
    params: cursor ? { cursor } : undefined,
  });
  return data; // { posts, nextCursor }
};

export const fetchUserPosts = async (userId) => {
  const { data } = await axiosClient.get(`/posts/user/${userId}`);
  return data.posts;
};

export const createPost = async ({ caption, mediaItems }) => {
  const { data } = await axiosClient.post("/posts", { caption, mediaItems });
  return data.post;
};

export const deletePost = async (postId) => {
  await axiosClient.delete(`/posts/${postId}`);
};
