"use client";

import { FilterIcon, SortAscIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption, SortOption } from "@/types";
import { useStore } from "@/lib/store";

export function ContactFilters() {
  const { 
    sortOption, 
    filterOption, 
    setSortOption, 
    setFilterOption 
  } = useStore();

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const handleFilterChange = (value: string) => {
    setFilterOption(value as FilterOption);
  };

  return (
    <motion.div 
      className="rounded-lg border p-4 bg-card shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SortAscIcon size={16} />
            <span>Sort by</span>
          </div>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="lastContacted">Last Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FilterIcon size={16} />
            <span>Filter</span>
          </div>
          <Select value={filterOption} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="recent">Recently Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}