import React from "react";
import Pagination from "../app/components/Pagination/Pagination";

export default {
  title: "Pagination",
  component: Pagination,
};

export const FirstPage = () => (
  <Pagination
    page={1}
    totalCount={100}
    totalPages={10}
    pageSize={10}
    onPageChange={() => {}}
    onPageSizeChange={() => {}}
  />
);
export const MiddlePage = () => (
  <Pagination
    page={5}
    totalCount={100}
    totalPages={10}
    pageSize={10}
    onPageChange={() => {}}
    onPageSizeChange={() => {}}
  />
);
export const LastPage = () => (
  <Pagination
    page={10}
    totalCount={100}
    totalPages={10}
    pageSize={10}
    onPageChange={() => {}}
    onPageSizeChange={() => {}}
  />
);
