import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm  }from "@/components/ContactForm";
import { SearchBar } from "@/components/SearchBar";
import { Plus, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/config"; // Axios instance with baseURL and token
import { v4 as uuidv4 } from 'uuid';
interface Contact {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const { toast } = useToast();

  useEffect(() => {
    isMounted.current = true;

    const fetchContacts = async () => {
      try {
        const res = await API.get(`/contacts/`);
        if (isMounted.current) setContacts(res.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchContacts();

    // Avoid state updates on unmount and double-invoke in StrictMode
    return () => {
      isMounted.current = false;
    };
  }, [toast]);

  const filteredContacts = contacts.filter((contact) => {
    const q = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.phone.includes(searchTerm)
    );
  });

  const refreshContacts = async () => {
    const res = await API.get(`/contacts/`);
    setContacts(res.data);
  };

  const handleSaveContact = async (contactData: Omit<Contact, "uuid">) => {
  console.log("Parent function reached, mode:", editingContact ? "EDIT" : "ADD");

  try {
    if (editingContact) {
      await API.put(`/contacts/${editingContact.uuid}`, contactData);
      toast({
        title: "Contact updated",
        description: `${contactData.name} has been updated.`,
      });
    } else {
      const newContact = {
        uuid: uuidv4(), // ✅ Generate UUID
        ...contactData,
      };

      await API.post(`/contacts/`, newContact);
      toast({
        title: "Contact added",
        description: `${contactData.name} has been added.`,
      });
    }

    await refreshContacts();
    setIsFormOpen(false);
    setEditingContact(undefined);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to save contact",
      variant: "destructive",
    });
    console.error(error);
  }
};


  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (uuid: string) => {
    try {
      await API.delete(`/contacts/${uuid}`);
      toast({
        title: "Contact deleted",
        description: "Contact has been removed.",
        variant: "destructive",
      });
      await refreshContacts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingContact(undefined); // ensures POST path
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center shadow-soft">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Contact Manager
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Keep your important connections organized and accessible. Manage your contacts with warmth and professionalism.
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name, email, or phone..." />
          </div>
          <Button onClick={handleAddNew} variant="warm" size="lg" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Contacts Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 animate-fade-in text-muted-foreground">Loading contacts…</div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? "No contacts found" : "No contacts yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `No contacts match "${searchTerm}". Try a different search term.`
                  : "Start building your contact list by adding your first contact."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddNew} variant="warm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact, index) => (
                <div key={contact.uuid} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ContactCard contact={contact}
  onEdit={handleEditContact}
  onDelete={() => handleDeleteContact(contact.uuid)}  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Count */}
        {filteredContacts.length > 0 && !loading && (
          <div className="mt-8 text-center text-muted-foreground animate-fade-in">
            {searchTerm ? (
              <p>
                Showing {filteredContacts.length} of {contacts.length} contacts
              </p>
            ) : (
              <p>
                {contacts.length} contact{contacts.length !== 1 ? "s" : ""} in your directory
              </p>
            )}
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {isFormOpen && <ContactForm contact={editingContact} onSave={handleSaveContact} onCancel={handleCloseForm} />}
    </div>
  );
};