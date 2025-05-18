import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface ContactsHeaderProps {
  totalContacts: number;
  toggleFilters: () => void;
  isFiltersVisible: boolean;
}

export function ContactsHeader({ 
  totalContacts, 
  toggleFilters,
  isFiltersVisible
}: ContactsHeaderProps) {
  const { searchTerm } = useStore();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {searchTerm ? 'Search Results' : 'Contacts'}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilters}
            className="gap-2"
          >
            <FilterIcon size={16} />
            {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        {searchTerm ? (
          <p>Found {totalContacts} contact{totalContacts !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;</p>
        ) : (
          <p>{totalContacts} contact{totalContacts !== 1 ? 's' : ''} total</p>
        )}
      </div>
    </div>
  );
}