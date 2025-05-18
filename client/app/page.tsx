"use client";

import { useEffect,useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ContactsContainer } from "@/components/contacts/contacts-container";
import { useStore } from "@/lib/store";
import { toast } from "sonner"

import axios from "axios";
export default function HomePage() {
  const { initializeContacts } = useStore();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState<null|string>(null);
  const [loading, setIsLoading] = useState(false);
useEffect(() => {
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(
        "https://phonebook-4k9e.vercel.app/api/phonebook/getAll",
      );

      if (response.data.success) {
        const formattedContacts = response.data.data.map((contact: any) => ({
          _id: contact._id,
          name: contact.name,
          number: contact.number,
          email: contact.email,
          notes: contact.notes,
          isBlocked: contact.blocked || false,
          isFavorite: contact.favourite || false,
          tags: contact.tags || [],
          dateAdded: contact.createdAt || new Date().toISOString(),
          lastContacted: contact.lastContacted
        }));

        setContacts(formattedContacts);
        initializeContacts(formattedContacts);
      } else {
        throw new Error(response.data.message || "Failed to fetch contacts");
      }
    } catch (err) {
    console.error("Failed to fetch contacts:", err);
    let errorMessage = "Failed to load contacts. Please try again.";
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    setError(errorMessage);
    toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (contacts.length === 0) {
    fetchContacts();
  }
}, [initializeContacts, contacts.length]);
  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader />
      <div className="flex-1 container py-6 md:py-10 max-w-7xl mx-auto">
        <ContactsContainer />
      </div>
    </main>
  );
}