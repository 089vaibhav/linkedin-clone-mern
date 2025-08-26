// src/redux/slices/messagesApiSlice.js
import { apiSlice } from './apiSlice';

const MESSAGES_URL = '/api/messages';

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (otherUserId) => ({
        url: `${MESSAGES_URL}/${otherUserId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApiSlice;