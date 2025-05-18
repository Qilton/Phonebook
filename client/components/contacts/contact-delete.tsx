"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangleIcon } from "lucide-react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface ContactDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  contactName: string;
  onSuccess?: () => void; // Optional callback after successful deletion
}

export function ContactDelete({
  isOpen,
  onClose,
  contactId,
  contactName,
  onSuccess,
}: ContactDeleteProps) {
  const { deleteContact } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // First delete from the API
      const response = await axios.delete(
        `https://phonebook-4k9e.vercel.app/api/phonebook/delete/${contactId}`,
      );

      if (response.data.success) {
        // Then update the local store
        deleteContact(contactId);
        
       toast.success("contact deleted successfully");
        
        // Optional success callback
        if (onSuccess) onSuccess();
        
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            </motion.div>
            Delete Contact
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{contactName}</span> from your
            contacts.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-2 sm:mt-0"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : "Delete Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}