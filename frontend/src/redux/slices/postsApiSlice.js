// src/redux/slices/postsApiSlice.js
import { apiSlice } from './apiSlice';

const POSTS_URL = '/api/posts';

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all posts for the feed
    getFeedPosts: builder.query({
      query: () => ({
        url: `${POSTS_URL}/feed`,
        method: 'GET',
      }),
      providesTags: ['Post'], // This query provides a 'Post' tag to the cache
    }),
    // Mutation to create a new post
    createPost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Post'], // Creating a post invalidates the 'Post' tag
    }),
    // Mutation to like/unlike a post
    likePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}/like`,
        method: 'PUT',
      }),
      invalidatesTags: ['Post'], // Liking a post invalidates the 'Post' tag
    }),
    // Mutation to add a comment
    addComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `${POSTS_URL}/${postId}/comment`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Post'], // Commenting invalidates the 'Post' tag
    }),
  }),
});

export const {
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
} = postsApiSlice;