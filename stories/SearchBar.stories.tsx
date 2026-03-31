import React from "react";
import SearchBar from "../app/components/SearchBar/SearchBar";

export default {
  title: "SearchBar",
  component: SearchBar,
};

export const Default = () => (
  <SearchBar onSearchInputChanged={() => {}} loading={false} />
);
export const Loading = () => (
  <SearchBar onSearchInputChanged={() => {}} loading={true} />
);
