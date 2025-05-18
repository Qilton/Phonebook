import { Contact } from "@/types";

export const demoContacts: Contact[] = [
  {
    id: "1",
    name: "John Smith",
    phoneNumber: "1234567890",
    email: "john.smith@example.com",
    isBlocked: false,
    isFavorite: true,
    dateAdded: new Date().toISOString(),
    lastContacted: new Date().toISOString(),
    notes: "Work colleague",
    tags: ["work", "friend"]
  },
  {
    id: "2",
    name: "Emma Johnson",
    phoneNumber: "2345678901",
    email: "emma.j@example.com",
    isBlocked: false,
    isFavorite: true,
    dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastContacted: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "Book club member",
    tags: ["friend", "book club"]
  },
  {
    id: "3",
    name: "Michael Brown",
    phoneNumber: "3456789012",
    email: "michael.b@example.com",
    isBlocked: true,
    isFavorite: false,
    dateAdded: new Date(Date.now() - 86400000 * 10).toISOString(),
    tags: ["work"]
  },
  {
    id: "4",
    name: "Sarah Davis",
    phoneNumber: "4567890123",
    email: "sarah.d@example.com",
    isBlocked: false,
    isFavorite: false,
    dateAdded: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastContacted: new Date(Date.now() - 86400000 * 10).toISOString(),
    notes: "Neighbor"
  },
  {
    id: "5",
    name: "James Wilson",
    phoneNumber: "5678901234",
    email: "james.w@example.com",
    isBlocked: false,
    isFavorite: false,
    dateAdded: new Date(Date.now() - 86400000 * 20).toISOString(),
    tags: ["family"]
  },
  {
    id: "6",
    name: "Lisa Thompson",
    phoneNumber: "6789012345",
    isBlocked: false,
    isFavorite: true,
    dateAdded: new Date(Date.now() - 86400000 * 25).toISOString(),
    lastContacted: new Date(Date.now() - 86400000).toISOString(),
    notes: "Dentist",
    tags: ["healthcare"]
  },
  {
    id: "7",
    name: "Robert Garcia",
    phoneNumber: "7890123456",
    email: "robert.g@example.com",
    isBlocked: false,
    isFavorite: false,
    dateAdded: new Date(Date.now() - 86400000 * 30).toISOString()
  }
];