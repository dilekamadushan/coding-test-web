"use client";

import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import { Company } from "../types/companies";
import CompanyList from "./components/CompanyList/CompanyList";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { fetchCompanies } from "../services/companies";
const latinFont = Inter({ subsets: ["latin"] });

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies()
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error: any) => {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) return <LoadingIndicator />;

    if (error) return <ErrorMessage message={error} />;

    return <CompanyList companies={companies} />;
  };

  return <main className={latinFont.className}>{renderContent()}</main>;
}
