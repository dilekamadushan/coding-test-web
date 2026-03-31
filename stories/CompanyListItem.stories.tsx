import React from "react";
import CompanyListItem from "../app/components/Companies/CompanyList/CompanyListItem/CompanyListItem";
import { companies } from "../data/companies";

export default {
  title: "CompanyListItem",
  component: CompanyListItem,
};

export const Default = () => (
  <CompanyListItem
    company={companies[0]}
    isExpanded={false}
    onToggle={() => {}}
  />
);

export const Expanded = () => (
  <CompanyListItem
    company={companies[0]}
    isExpanded={true}
    onToggle={() => {}}
  />
);
