import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Location } from "@/data/mozambiqueLocations";
import { Star } from "lucide-react";

interface CitySearchSelectProps {
  locations: Location[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  groupByProvince?: boolean;
}

export function CitySearchSelect({
  locations,
  value,
  onValueChange,
  placeholder,
  groupByProvince = true,
}: CitySearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Group locations by province
  const groupedLocations = useMemo(() => {
    if (!groupByProvince) {
      return { "Todas": locations };
    }
    return locations.reduce((acc, loc) => {
      if (!acc[loc.province]) {
        acc[loc.province] = [];
      }
      acc[loc.province].push(loc);
      return acc;
    }, {} as Record<string, Location[]>);
  }, [locations, groupByProvince]);

  // Filter locations based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedLocations;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, Location[]> = {};
    
    Object.entries(groupedLocations).forEach(([province, locs]) => {
      const matchingLocs = locs.filter(
        loc =>
          loc.name.toLowerCase().includes(query) ||
          loc.province.toLowerCase().includes(query) ||
          (loc.district?.toLowerCase().includes(query))
      );
      if (matchingLocs.length > 0) {
        filtered[province] = matchingLocs;
      }
    });
    
    return filtered;
  }, [groupedLocations, searchQuery]);

  const selectedLocation = locations.find(loc => loc.name === value);

  const totalFilteredCount = Object.values(filteredGroups).reduce(
    (sum, locs) => sum + locs.length,
    0
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedLocation ? (
            <span className="flex items-center gap-2">
              {selectedLocation.name}
              <span className="text-muted-foreground text-xs">
                ({selectedLocation.province})
              </span>
              {selectedLocation.type === "capital" && (
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Pesquisar cidade, distrito ou província..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CommandList className="max-h-[300px]">
            {totalFilteredCount === 0 ? (
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
            ) : (
              Object.entries(filteredGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([province, locs]) => (
                  <CommandGroup
                    key={province}
                    heading={`${province} (${locs.length})`}
                  >
                    {locs
                      .sort((a, b) => {
                        // Capitals first, then alphabetically
                        if (a.type === "capital" && b.type !== "capital") return -1;
                        if (a.type !== "capital" && b.type === "capital") return 1;
                        return a.name.localeCompare(b.name);
                      })
                      .map((loc) => (
                        <CommandItem
                          key={`${loc.province}-${loc.name}`}
                          value={loc.name}
                          onSelect={() => {
                            onValueChange(loc.name);
                            setOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === loc.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex items-center gap-2">
                            {loc.name}
                            {loc.type === "capital" && (
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            )}
                            {loc.district && (
                              <span className="text-xs text-muted-foreground">
                                ({loc.district})
                              </span>
                            )}
                          </span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
