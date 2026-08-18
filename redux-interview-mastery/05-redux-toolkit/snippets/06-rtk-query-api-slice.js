// Minimal RTK Query API slice: declarative endpoints -> auto-generated hooks.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products',
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Product', id })),
        { type: 'Product', id: 'LIST' },
      ],
    }),
    addProduct: builder.mutation({
      query: (body) => ({ url: 'products', method: 'POST', body }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = productsApi;

// Wire into the store alongside regular slices:
// import { configureStore } from '@reduxjs/toolkit';
// const store = configureStore({
//   reducer: { [productsApi.reducerPath]: productsApi.reducer },
//   middleware: (getDefault) => getDefault().concat(productsApi.middleware),
// });
