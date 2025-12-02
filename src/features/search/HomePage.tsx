// src/features/search/HomePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import PopularBranches from "./PopularBranches";
import {
  fetchBranches,
  fetchCountries,
  fetchCitiesByCountry,
  type Branch,
  type Country,
  type City,
} from "./api";

export default function HomePage() {
  const navigate = useNavigate();

  const [branch, setBranch] = useState<Branch | "">("");
  const [country, setCountry] = useState<Country | "">("");
  const [city, setCity] = useState<City | "">("");

  const branchesQ = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const countriesQ = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const {
    data: cities = [],
    isFetching: citiesLoading,
  } = useQuery({
    queryKey: ["cities", country],
    queryFn: () => fetchCitiesByCountry(country as Country),
    enabled: !!country,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    // kad promeniš državu, obriši selektovani grad
    setCity("");
  }, [country]);

  const canSubmit = useMemo(
    () => !!branch || !!country || !!city,
    [branch, country, city]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (branch) params.set("branch", branch);
    if (country) params.set("country", country);
    if (city) params.set("city", city);

    navigate(`/results?${params.toString()}`);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-extrabold leading-tight text-blue-900 md:text-3xl">
        Local services in the{" "}
        <span className="text-blue-600">language you understand</span>
      </h1>
      <p className="mt-1 mb-6 text-slate-600">
        Find trusted professionals near you
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Branch */}
        <div>
          <label className="mb-1 block text-sm font-medium">Branch</label>
          <select
            className="w-full rounded-lg border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={branch}
            onChange={(e) => setBranch(e.target.value as Branch | "")}
          >
            <option value="">Any branch</option>
            {branchesQ.data?.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="mb-1 block text-sm font-medium">Country</label>
          <select
            className="w-full rounded-lg border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={country}
            onChange={(e) => setCountry(e.target.value as Country | "")}
          >
            <option value="">Any country</option>
            {countriesQ.data?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* City – disabled dok nema country */}
        <div>
          <label className="mb-1 block text-sm font-medium">City</label>
          <select
            className={`w-full rounded-lg border bg-white px-3 py-2 focus:outline-none ${
              !country
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
            value={city}
            onChange={(e) => setCity(e.target.value as City | "")}
            disabled={!country}
          >
            <option value="">
              {country ? "Any city" : "Select country first"}
            </option>
            {country &&
              cities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
          </select>
          {country && citiesLoading && (
            <p className="mt-1 text-sm text-slate-500">Loading cities…</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 font-semibold md:w-auto ${
            canSubmit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-300 text-slate-600"
          }`}
        >
          Search
        </button>
      </form>

      {/* Popular branches grid */}
      <PopularBranches
        onPick={(b) => {
          setBranch(b);
          const params = new URLSearchParams();
          params.set("branch", b);
          if (country) params.set("country", country);
          if (city) params.set("city", city);
          navigate(`/results?${params.toString()}`);
        }}
      />
    </section>
  );
}
