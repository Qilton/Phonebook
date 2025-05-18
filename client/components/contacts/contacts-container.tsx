"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ContactList } from "@/components/contacts/contact-list";
import { ContactsHeader } from "@/components/contacts/contacts-header";
import { ContactFilters } from "@/components/contacts/contact-filters";
import { useStore } from "@/lib/store";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactsContainer() {
  const { filteredContacts, initializeContacts } = useStore();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8000/api/phonebook/getAll");
        
        if (response.data.success) {
          initializeContacts(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch contacts");
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load contacts. Please try again.");
        } else {
          setError("Failed to load contacts. Please try again.");
        }
        toast.error("Failed to load contacts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [initializeContacts]);

  const contacts = filteredContacts();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <ContactsHeader 
          totalContacts={0}
          toggleFilters={() => setIsFiltersVisible(!isFiltersVisible)}
          isFiltersVisible={isFiltersVisible}
        />
        <div className="text-center py-8 text-destructive">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-primary underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ContactsHeader 
        totalContacts={contacts.length}
        toggleFilters={() => setIsFiltersVisible(!isFiltersVisible)}
        isFiltersVisible={isFiltersVisible}
      />
      
      {isFiltersVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContactFilters />
        </motion.div>
      )}
      
      <ContactList contacts={contacts} />
    </div>
  );
}