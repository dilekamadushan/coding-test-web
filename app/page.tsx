"use client";

import { useEffect, useState } from "react";
import { Company } from "../types/companies";
import CompanyList from "./components/CompanyList/CompanyList";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import SearchBar from "./components/SearchBar/SearchBar";
import { fetchCompanies } from "../services/companies";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = (searchQuery?: string) => {
    setLoading(true);
    setError(null);

    fetchCompanies(searchQuery)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    searchCompanies();
  }, []);

  const renderPageContent = () => {
    if (loading) return <LoadingIndicator />;

    if (error) return <ErrorMessage message={error} />;

    return <CompanyList companies={companies} />;
  };

  return (
    <main>
      <SearchBar onSearchInputChanged={searchCompanies} loading={loading} />
      {renderPageContent()}
    </main>
  );
}
