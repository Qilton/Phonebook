"use client";

import { useState } from "react";
import { MoonIcon, PlusIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contacts/contact-form";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function PageHeader() {
  const { theme, setTheme } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useStore();
  const router = useRouter();

  const handleSuccess = () => {
    setIsFormOpen(false); 
   window.location.reload(); 
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">Phonebook</h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "h-9 w-[200px] lg:w-[300px] rounded-md border border-input px-3 py-1",
                "bg-background text-sm ring-offset-background",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            />
          </div>

          <Button size="sm" variant="outline" onClick={() => setIsFormOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Contact
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <ContactForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </header>
  );
}