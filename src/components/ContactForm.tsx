import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Contact {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Omit<Contact, "uuid">) => void;
  onCancel: () => void;
}

export const ContactForm = ({ contact, onSave, onCancel }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    address: contact?.address || "",
  });

  // Sync when contact changes (Edit vs Add)
  useEffect(() => {
    setFormData({
      name: contact?.name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      address: contact?.address || "",
    });
  }, [contact]);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Form submit triggered");  // ✅ Step 1
  if (formData.name.trim()) {
    console.log("Calling onSave with:", formData);  // ✅ Step 2
    onSave(formData);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {contact ? "Edit Contact" : "Add New Contact"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="warm" className="flex-1" > 
                {contact ? "Update" : "Save"} Contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// export interface ContactData {
//   name: string;
//   email?: string;
//   phone: string;
//   address?: string;
// }

// interface  ContactFormProps{
//   contact?: ContactData;
//   onClose?: () => void;
//   onSaved?: (saved: any) => void;
// }

// const ContactForm: React.FC< ContactFormProps> = ({ contact, onClose, onSaved }) => {
//   const [formData, setFormData] = useState<ContactData>({
//     name: contact?.name || "",
//     email: contact?.email || "",
//     phone: contact?.phone || "",
//     address: contact?.address || "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // basic validation
//     if (!formData.name || !formData.phone) {
//       setError("Name and Phone are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // If your frontend proxies /api to backend, use relative path.
//       // Otherwise replace with full backend URL e.g. http://localhost:5000/api/contacts
//       const url = "/api/contacts";
//       const method = contact ? "PUT" : "POST";
//       const endpoint = contact && (contact as any).id ? `${url}/${(contact as any).id}` : url;

//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         const text = await res.text().catch(() => null);
//         throw new Error(text || `Request failed: ${res.status}`);
//       }

//       const saved = await res.json();
//       if (onSaved) onSaved(saved);
//       if (onClose) onClose();
//     } catch (err: any) {
//       setError(err.message || "Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md w-full">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {error && <div className="text-sm text-red-600">{error}</div>}
//         <div>
//           <label className="block text-sm font-medium">Name *</label>
//           <input
//             name="name"
//             placeholder="Full name"
//             value={formData.name}
//             onChange={handleChange}
//             className="mt-1 block w-full"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             name="email"
//             placeholder="email@example.com"
//             value={formData.email}
//             onChange={handleChange}
//             className="mt-1 block w-full"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Phone *</label>
//           <input
//             name="phone"
//             placeholder="Phone number"
//             value={formData.phone}
//             onChange={handleChange}
//             className="mt-1 block w-full"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="mt-1 block w-full"
//             rows={3}
//           />
//         </div>

//         <div className="flex gap-2">
//           <button type="button" onClick={onClose} className="px-4 py-2 border">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
//           >
//             {loading ? "Saving..." : contact ? "Update Contact" : "Save Contact"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ContactForm;
