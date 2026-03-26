"use client";

import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import { Company } from "../types/companies";
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

  return (
    <main className={latinFont.className}>
      <h2>Quartr</h2>
      <p>Trending companies</p>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {companies.map((company) => (
            <li key={company.companyId}>
              <strong>{company.displayName}</strong> ({company.companyTicker})
              &mdash; {company.companyCountry}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
