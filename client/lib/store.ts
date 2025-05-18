import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Contact, FilterOption, SortOption } from "@/types";

interface ContactStore {
  contacts: Contact[];
  searchTerm: string;
  sortOption: SortOption;
  filterOption: FilterOption;
  
  // Actions
  initializeContacts: (contacts: Contact[]) => void;
  addContact: (contact: Omit<Contact, "_id" | "createdAt">) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  toggleBlocked: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
  
  // Derived data
  filteredContacts: () => Contact[];
}

export const useStore = create<ContactStore>((set, get) => ({
  contacts: [],
  searchTerm: "",
  sortOption: "name",
  filterOption: "all",
  
  initializeContacts: (contacts) => {
    // Only initialize if contacts array is empty
    set((state) => {
      if (state.contacts.length === 0) {
        return { contacts };
      }
      return state;
    });
  },
  
  addContact: (contactData) => {
    const newContact: Contact = {
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...contactData
    };
    
    set((state) => ({
      contacts: [...state.contacts, newContact]
    }));
  },
  
  updateContact: (id, updatedData) => {
    set((state) => ({
      contacts: state.contacts.map((contact) => 
        contact._id === id 
          ? { ...contact, ...updatedData } 
          : contact
      )
    }));
  },
  
  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact._id !== id)
    }));
  },
  
  toggleBlocked: (id) => {
    set((state) => ({
      contacts: state.contacts.map((contact) => 
        contact._id === id 
          ? { ...contact, blocked: !contact.blocked } 
          : contact
      )
    }));
  },
  
  toggleFavorite: (id) => {
    set((state) => ({
      contacts: state.contacts.map((contact) => 
        contact._id === id 
          ? { ...contact, favourite: !contact.favourite } 
          : contact
      )
    }));
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOption: (option) => set({ sortOption: option }),
  setFilterOption: (option) => set({ filterOption: option }),
  
  filteredContacts: () => {
    const { contacts, searchTerm, sortOption, filterOption } = get();
    
    // First, filter based on search term and filter option
    let result = contacts.filter((contact) => {
      // Search filtering
      const matchesSearch = 
        searchTerm === "" ||
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.number.includes(searchTerm) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filtering
      let matchesFilter = true;
      if (filterOption === "blocked") {
        matchesFilter = contact.blocked;
      } else if (filterOption === "favorites") {
        matchesFilter = contact.favourite;
      }
      // Removed the "recent" filter option since it relied on lastContacted
      
      return matchesSearch && matchesFilter;
    });
    
    // Then, sort the filtered results
    return result.sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "dateAdded") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Removed the "lastContacted" sort option since it's not in the schema
      return 0;
    });
  }
}));