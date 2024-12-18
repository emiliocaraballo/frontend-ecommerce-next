/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "config";
import { User } from "../types/User";
import { Coupon } from "../types/Coupon";

console.log(API_URL, "API_URL");
console.log(process.env.NEXT_PUBLIC_API_URL, "API_URL");

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost/back-user/api" }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/v1/user/login",
        method: "POST",
        body: body,
      }),
    }),
    // user API
    getUsers: builder.query<User[], void>({
      query: () => "/v1/user/list",
    }),
    getFrequentCustomers: builder.query<any[], void>({
      query: () => "/v1/user/frequent-customers",
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/v1/user/update/" + body.id,
        method: "PUT",
        body: body.updatedUser,
      }),
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/v1/user/create",
        method: "POST",
        body: body,
      }),
    }),
    // user API
    // product API
    getProducts: builder.query<any[], { name?: string; tradeMark?: string; status?: string }>({
      query: ({ name, tradeMark, status }) => {
        if(status==="ALL"){
          status=null;
        }
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (tradeMark!== "ALL") params.append('tradeMark', tradeMark);
        if (status) params.append('status', status);
    
        return `/v1/product/list?${params.toString()}`;
      },
    }),
    getRecentProducts: builder.query<any[], void>({
      query: () => "/v1/product/recent-products",
    }),
    getBestSellers: builder.query<any[], void>({
      query: () => "/v1/product/best-sellers",
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/v1/product/create",
        method: "POST",
        body: body,
      }),
    }),
    updateProduct: builder.mutation({
      query: (body) => ({
        url: "/v1/product/update/" + body.id,
        method: "PUT",
        body: body.updatedProduct,
      }),
    }),
    // product API

    // coupon API
    getCoupons: builder.query<Coupon[], void>({
      query: () => "/v1/coupon/list",
    }),
    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/v1/coupon/create",
        method: "POST",
        body: body,
      }),
    }),
    updateCoupon: builder.mutation({
      query: (body) => ({
        url: "/v1/coupon/update/" + body.id,
        method: "PUT",
        body: body.updatedCoupon,
      }),
    }),
    // coupon API
  }),
});

export const {
  // user API
  useLoginMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetFrequentCustomersQuery,
  // user API

  // product API
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetRecentProductsQuery,
  useGetBestSellersQuery,
  // product API

  // coupon API
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  // coupon API

} = api;
