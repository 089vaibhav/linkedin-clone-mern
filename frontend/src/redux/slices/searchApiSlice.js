// src/redux/slices/searchApiSlice.js
import { apiSlice } from './apiSlice';

const SEARCH_URL = '/api/search';

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: (searchTerm) => ({
        url: `${SEARCH_URL}?q=${searchTerm}`,
      }),
    }),
  }),
});

// We use `useLazy...Query` because we want to trigger the search on demand, not on component load.
export const { useLazySearchQuery } = searchApiSlice;