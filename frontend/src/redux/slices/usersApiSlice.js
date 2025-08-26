// src/redux/slices/usersApiSlice.js
import { apiSlice } from './apiSlice';

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    getUser: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5, // Keep data for 5 seconds after unmounting
    }),

    // --- New Endpoints for Network Page ---
    getPendingRequests: builder.query({
      query: () => ({
        url: `${USERS_URL}/requests`,
        method: 'GET',
      }),
      providesTags: ['Request'], // This query provides the 'Request' tag
    }),
    
    acceptRequest: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Request'], // Accepting invalidates the 'Request' tag
    }),
    
    rejectRequest: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['Request'], // Rejecting also invalidates the 'Request' tag
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    
  }),
});

// Export the new hook
export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetUserQuery, useGetPendingRequestsQuery, useAcceptRequestMutation, useRejectRequestMutation, useGetUsersQuery} = usersApiSlice;