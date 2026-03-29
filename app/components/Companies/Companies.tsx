"use client";

import { useEffect, useRef, useState } from "react";
import { Company } from "../../../types/companies";
import CompanyList from "./CompanyList/CompanyList";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import { fetchCompanies } from "../../../services/companies";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../../constants";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // useRef over useState — to prevent re-rendering
  const searchQueryRef = useRef<string | undefined>(undefined);

  const searchCompanies = (
    searchQuery?: string,
    targetPage = DEFAULT_PAGE_NUMBER,
    limit = pageSize,
  ) => {
    setLoading(true);
    setError(null);

    fetchCompanies(searchQuery, targetPage, limit)
      .then((data) => {
        setCompanies(data.companies);
        setPage(targetPage);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (query?: string) => {
    searchQueryRef.current = query;
    searchCompanies(query);
  };

  const handlePageChange = (nextPage: number) => {
    searchCompanies(searchQueryRef.current, nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    searchCompanies(searchQueryRef.current, DEFAULT_PAGE_NUMBER, nextPageSize);
  };

  // fetch once on mount only
  useEffect(() => {
    searchCompanies();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    const searchBar = (
      <SearchBar onSearchInputChanged={handleSearch} loading={loading} />
    );

    if (loading)
      return (
        <>
          {searchBar}
          <LoadingIndicator />
        </>
      );

    if (error)
      return (
        <>
          {searchBar}
          <ErrorMessage message={error} />
        </>
      );

    return (
      <>
        {searchBar}
        <CompanyList companies={companies} />
        <Pagination
          page={page}
          totalCount={totalCount}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    );
  };

  return <main>{renderContent()}</main>;
}
