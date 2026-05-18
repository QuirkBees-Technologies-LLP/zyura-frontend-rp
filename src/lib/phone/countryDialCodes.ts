export type CountryDialCode = {
  iso2: string;
  dialCode: string;
  name: string;
  continent: "Asia" | "Europe" | "NorthAmerica" | "Africa" | "Oceania";
};

// Curated list (extend as needed).
export const countryDialCodes: CountryDialCode[] = [
  // Asia (incl GCC + South Asia)
  { iso2: "AE", dialCode: "+971", name: "United Arab Emirates", continent: "Asia" },
  { iso2: "BH", dialCode: "+973", name: "Bahrain", continent: "Asia" },
  { iso2: "BD", dialCode: "+880", name: "Bangladesh", continent: "Asia" },
  { iso2: "IN", dialCode: "+91", name: "India", continent: "Asia" },
  { iso2: "JO", dialCode: "+962", name: "Jordan", continent: "Asia" },
  { iso2: "KW", dialCode: "+965", name: "Kuwait", continent: "Asia" },
  { iso2: "NP", dialCode: "+977", name: "Nepal", continent: "Asia" },
  { iso2: "OM", dialCode: "+968", name: "Oman", continent: "Asia" },
  { iso2: "PK", dialCode: "+92", name: "Pakistan", continent: "Asia" },
  { iso2: "QA", dialCode: "+974", name: "Qatar", continent: "Asia" },
  { iso2: "SA", dialCode: "+966", name: "Saudi Arabia", continent: "Asia" },
  { iso2: "LK", dialCode: "+94", name: "Sri Lanka", continent: "Asia" },

  // Europe
  { iso2: "DE", dialCode: "+49", name: "Germany", continent: "Europe" },
  { iso2: "ES", dialCode: "+34", name: "Spain", continent: "Europe" },
  { iso2: "FR", dialCode: "+33", name: "France", continent: "Europe" },
  { iso2: "GB", dialCode: "+44", name: "United Kingdom", continent: "Europe" },
  { iso2: "IT", dialCode: "+39", name: "Italy", continent: "Europe" },
  { iso2: "NL", dialCode: "+31", name: "Netherlands", continent: "Europe" },

  // North America (per decision: +1 shows US only)
  { iso2: "US", dialCode: "+1", name: "United States", continent: "NorthAmerica" },

  // Africa
  { iso2: "EG", dialCode: "+20", name: "Egypt", continent: "Africa" },

  // Oceania
  { iso2: "AU", dialCode: "+61", name: "Australia", continent: "Oceania" },
];

