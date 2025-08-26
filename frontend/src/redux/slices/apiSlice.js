// src/redux/slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Modify the baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5001',
  // This function prepares the headers for every request
  prepareHeaders: (headers, { getState }) => {
    // Get the user info from the Redux state
    const { userInfo } = getState().auth;
    // If we have a token, add it to the headers
    if (userInfo && userInfo.token) {
      headers.set('authorization', `Bearer ${userInfo.token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Post', 'Request'], // 'Request' tag was added in the previous step
  endpoints: (builder) => ({}),
});