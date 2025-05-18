"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ContactCard } from "@/components/contacts/contact-card";
import { Contact } from "@/types";

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <ContactCard contact={contact} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-8 text-center"
          >
            <p className="text-muted-foreground">No contacts found</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}