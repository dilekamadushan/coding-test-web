import React from "react";
import CompanyList from "../app/components/Companies/CompanyList/CompanyList";
import { companies } from "../data/companies";

export default {
  title: "CompanyList",
  component: CompanyList,
};

export const Default = () => <CompanyList companies={companies} />;
export const Empty = () => <CompanyList companies={[]} />;
