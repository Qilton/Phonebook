"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, StarIcon, TagIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/types";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    countryCode: z.string().min(2, { message: "Please select a country code" }),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits" })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only digits",
    }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
  blocked: z.boolean(),
  favourite: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  existingContact?: Contact;
  onSuccess: () => void; // Callback after successful operation
}

export function ContactForm({
  isOpen,
  onClose,
  existingContact,
  onSuccess,
}: ContactFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(existingContact?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!existingContact;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingContact?.name || "",
      phoneNumber: existingContact?.number || "",
      email: existingContact?.email || "",
      notes: existingContact?.notes || "",
      blocked: existingContact?.blocked || false,
      favourite: existingContact?.favourite || false,
    },
  });

  const watchedIsBlocked = watch("blocked");
  const watchedIsFavorite = watch("favourite");

  const onSubmit = async (data: FormValues) => {
    try {
       setIsSubmitting(true);
    const contactData: Omit<FormValues, "countryCode" | "phoneNumber"> & {
      countryCode?: string;
      phoneNumber?: string;
      phone: string;
      tags?: string[];
    } = {
      ...data,
      phone: `${data.countryCode}${data.phoneNumber}`, // Combine country code and number
      tags: tags.length > 0 ? tags : undefined,
    };
    delete contactData.countryCode;
    delete contactData.phoneNumber;

      if (isEditing && existingContact) {
        // Update existing contact
        const response = await axios.put(
          `https://phonebook-4k9e.vercel.app/api/phonebook/update/${existingContact._id}`,
          contactData,
         
        );

        if (response.data.success) {
          toast.success("Contact updated successfully");
          onSuccess();
          handleClose();
        }
      } else {
        // Add new contact
        const response = await axios.post(
          "https://phonebook-4k9e.vercel.app/api/phonebook/add",
          contactData,
         
        );

        if (response.data.success) {
          toast.success("Contact added successfully");
          onSuccess();
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error saving contact:", error);
     toast.error("Failed to save contact");
    } finally {
      setIsSubmitting(false);
    }
  };
  const countryCodes = [
  { code: "+1", name: "USA" },
  { code: "+91", name: "India" },
  { code: "+44", name: "UK" },
  // Add more country codes as needed
];

  const handleClose = () => {
    reset();
    setTags([]);
    setTagInput("");
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Contact" : "Add New Contact"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the contact details below."
                : "Fill in the contact details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className={errors.name ? "border-destructive" : ""}
                {...register("name")}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
  <div className="grid gap-2">
    <Label htmlFor="countryCode">Country Code</Label>
    <select
      id="countryCode"
      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      {...register("countryCode")}
    >
      <option value="">Select</option>
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.code} ({country.name})
        </option>
      ))}
    </select>
    {errors.countryCode && (
      <p className="text-xs text-destructive">{errors.countryCode.message}</p>
    )}
  </div>
  <div className="grid gap-2 col-span-2">
    <Label htmlFor="phoneNumber">Phone Number</Label>
    <Input
      id="phoneNumber"
      placeholder="1234567890"
      className={errors.phoneNumber ? "border-destructive" : ""}
      {...register("phoneNumber")}
    />
    {errors.phoneNumber && (
      <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
    )}
  </div>
</div>

          

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={errors.email ? "border-destructive" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Tags Field */}
            <div className="grid gap-2">
              <Label htmlFor="tags" className="font-medium">
                Tags (Optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag and press Enter"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={addTag}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="h-6 pr-1">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                          <span className="sr-only">Remove {tag}</span>
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Notes Field */}
            <div className="grid gap-2">
              <Label htmlFor="notes" className="font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this contact..."
                className="resize-none"
                {...register("notes")}
              />
            </div>

            {/* Toggle Switches */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="favourite"
                  checked={watchedIsFavorite}
                  onCheckedChange={(checked) => setValue("favourite", checked)}
                />
                <Label htmlFor="favourite" className="cursor-pointer flex items-center">
                  <StarIcon
                    className={`mr-1.5 h-4 w-4 ${
                      watchedIsFavorite ? "fill-warning text-warning" : ""
                    }`}
                  />
                  Favorite
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="blocked"
                  checked={watchedIsBlocked}
                  onCheckedChange={(checked) => setValue("blocked", checked)}
                />
                <Label htmlFor="blocked" className="cursor-pointer">
                  Block Contact
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {isEditing ? "Update Contact" : "Add Contact"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}