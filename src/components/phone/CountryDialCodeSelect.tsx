import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countryDialCodes, type CountryDialCode } from "@/lib/phone/countryDialCodes";

type ContinentKey = CountryDialCode["continent"];

const continentLabel: Record<ContinentKey, string> = {
  Asia: "Asia",
  Europe: "Europe",
  NorthAmerica: "North America",
  Africa: "Africa",
  Oceania: "Oceania",
};

const continentOrder: ContinentKey[] = [
  "Asia",
  "Europe",
  "NorthAmerica",
  "Africa",
  "Oceania",
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export type CountryDialCodeSelectValue = {
  dialCode: string;
  iso2: string;
  name: string;
};

export default function CountryDialCodeSelect(props: {
  valueDialCode: string;
  onChange: (v: CountryDialCodeSelectValue) => void;
  disabled?: boolean;
}) {
  const { valueDialCode, onChange, disabled } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => {
    return (
      countryDialCodes.find((c) => c.dialCode === valueDialCode) ??
      countryDialCodes[0]
    );
  }, [valueDialCode]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return countryDialCodes;

    return countryDialCodes.filter((c) => {
      const hay = `${c.name} ${c.dialCode} ${c.iso2}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<ContinentKey, CountryDialCode[]>();
    for (const key of continentOrder) map.set(key, []);
    for (const item of filtered) {
      map.get(item.continent)?.push(item);
    }
    for (const key of continentOrder) {
      map.set(
        key,
        (map.get(key) || []).slice().sort((a, b) => a.name.localeCompare(b.name)),
      );
    }
    return map;
  }, [filtered]);

  const select = (c: CountryDialCode) => {
    onChange({ dialCode: c.dialCode, iso2: c.iso2, name: c.name });
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 text-left"
        >
          {selected ? `${selected.dialCode} ${selected.name}` : "Select"}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[320px] p-0">
        <div className="p-2 border-b">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or code…"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-auto p-2">
          {continentOrder.map((continent) => {
            const items = grouped.get(continent) || [];
            if (items.length === 0) return null;

            return (
              <div key={continent} className="mb-2">
                <div className="px-2 py-1 text-xs font-semibold text-[#64748B]">
                  {continentLabel[continent]}
                </div>
                <div className="space-y-1">
                  {items.map((c) => {
                    const isActive = c.dialCode === selected?.dialCode;
                    return (
                      <button
                        key={`${c.iso2}-${c.dialCode}`}
                        type="button"
                        onClick={() => select(c)}
                        className={`w-full text-left px-2 py-2 rounded-md hover:bg-gray-100 ${
                          isActive ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="font-medium">{c.dialCode}</span>{" "}
                        <span className="text-sm text-[#09090B]">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-2 py-6 text-sm text-[#64748B]">No matches</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

