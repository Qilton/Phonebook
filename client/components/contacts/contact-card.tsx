"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BlocksIcon, 
  MoreHorizontalIcon, 
  PencilIcon, 
  PhoneCallIcon, 
  StarIcon, 
  Trash2Icon 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatPhoneNumber, getInitials } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Contact } from "@/types";
import { ContactForm } from "@/components/contacts/contact-form";
import { ContactDelete } from "@/components/contacts/contact-delete";
import axios from "axios";
import { toast } from "sonner";

interface ContactCardProps {
  contact: Contact;
  onUpdate?: () => void; // Callback after successful update
}

export function ContactCard({ contact, onUpdate }: ContactCardProps) {
  const { toggleBlocked, toggleFavorite } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      setIsTogglingStatus(true);
      const newFavoriteStatus = !contact.favourite;
      
      // Update backend first
      const response = await axios.put(
        `http://localhost:8000/api/phonebook/update/${contact._id}`,
        { favourite: newFavoriteStatus },
      );

      if (response.data.success) {
        // Then update local state
        toggleFavorite(contact._id);
        {newFavoriteStatus?
          toast("Added to favorites") :
          toast("Removed from favorites")
        }
 
        onUpdate?.();
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleToggleBlocked = async () => {
    try {
      setIsTogglingStatus(true);
      const newBlockedStatus = !contact.blocked;
      
      // Update backend first
      const response = await axios.put(
        `http://localhost:8000/api/phonebook/update/${contact._id}`,
        { blocked: newBlockedStatus },
      );

      if (response.data.success) {
        // Then update local state
        toggleBlocked(contact._id);
        newBlockedStatus?
          toast("Contact blocked") :
          toast("Contact unblocked")
      
        onUpdate?.();
      }
    } catch (error) {
      console.error("Failed to toggle blocked status:", error);
     toast.error("Failed to update blocked status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <>
      <motion.div 
        className={`
          relative rounded-lg border bg-card shadow-sm p-4 contact-card
          ${contact.blocked ? "border-destructive/40" : ""}
        `}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg leading-none truncate">
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPhoneNumber(contact.number)}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="-mr-2"
                    disabled={isTogglingStatus}
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsEditing(true)}
                    disabled={isTogglingStatus}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleToggleFavorite}
                    disabled={isTogglingStatus}
                  >
                    <StarIcon 
                      className="w-4 h-4 mr-2" 
                      fill={contact.favourite ? "currentColor" : "none"} 
                    />
                    {contact.favourite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleToggleBlocked}
                    disabled={isTogglingStatus}
                  >
                    <BlocksIcon className="w-4 h-4 mr-2" />
                    {contact.blocked ? "Unblock" : "Block"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsDeleting(true)}
                    className="text-destructive focus:text-destructive"
                    disabled={isTogglingStatus}
                  >
                    <Trash2Icon className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {contact.email && (
              <p className="text-sm mt-1 text-muted-foreground truncate">
                {contact.email}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 rounded-full"
              >
                <PhoneCallIcon className="h-3.5 w-3.5 mr-1" />
                Call
              </Button>
              
              <div className="flex gap-1.5 flex-wrap">
                {contact.favourite && (
                  <Badge variant="outline" className="h-6 px-2 bg-warning/10 text-warning-foreground">
                    <StarIcon className="h-3 w-3 mr-1 fill-current" />
                    Favorite
                  </Badge>
                )}
                
                {contact.blocked && (
                  <Badge variant="outline" className="h-6 px-2 bg-destructive/10 text-destructive-foreground">
                    <BlocksIcon className="h-3 w-3 mr-1" />
                    Blocked
                  </Badge>
                )}
                
                {contact.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="h-6 px-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {contact.notes && (
              <p className="text-xs mt-2 text-muted-foreground line-clamp-2">
                {contact.notes}
              </p>
            )}
            
            <div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
              Added {formatDate(contact.createdAt)}
              {contact.lastContacted && (
                <> • Last contacted {formatDate(contact.lastContacted)}</>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      <ContactForm 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        existingContact={contact}
        onSuccess={() => {
          onUpdate?.();
          setIsEditing(false);
        }}
      />
      
      <ContactDelete
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        contactId={contact._id}
        contactName={contact.name}
        onSuccess={onUpdate}
      />
    </>
  );
}