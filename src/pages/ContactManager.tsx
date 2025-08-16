import { useState , useEffect} from "react";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm } from "@/components/ContactForm";
import { SearchBar } from "@/components/SearchBar";
import { Plus, Users, Heart } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import API from "@/lib/config"; // Axios instance with baseURL and token


interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Sample data for demonstration



export const ContactManager = () => {
const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const { toast } = useToast();

const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts");
      setContacts(res.data);
    } catch (error) {
     toast({ title: "Error", description: "Failed to load contacts", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchContacts();
}, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleSaveContact = async (contactData: Omit<Contact, 'id'>) => {
  try {
    if (editingContact) {
      // Update contact
      await API.put(`/contacts/${editingContact.id}`, contactData);
      toast({ title: "Contact Updated", description: `${contactData.name} has been updated.` });
    } else {
      // Create contact
      await API.post("/contacts", contactData);
      toast({ title: "Contact Added", description: `${contactData.name} has been added.` });
    }

    // Refresh contacts
    const res = await API.get("/contacts");
    setContacts(res.data);
    setIsFormOpen(false);
    setEditingContact(undefined);
  } catch (error) {
    toast({ title: "Error", description: "Failed to save contact", variant: "destructive" });
    console.error(error);
  }
};

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

const handleDeleteContact = async (id: string) => {
  try {
    await API.delete(`/contacts/${id}`);
    toast({ title: "Contact Deleted", description: "Contact has been removed.", variant: "destructive" });

    // Refresh contacts
    const res = await API.get("/contacts");
    setContacts(res.data);
  } catch (error) {
    toast({ title: "Error", description: "Failed to delete contact", variant: "destructive" });
    console.error(error);
  }
};

  const handleAddNew = () => {
    setEditingContact(undefined);
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
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, email, or phone..."
            />
          </div>
          <Button
            onClick={handleAddNew}
            variant="warm"
            size="lg"
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Contacts Grid */}
        <div className="space-y-6">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `No contacts match "${searchTerm}". Try a different search term.`
                  : 'Start building your contact list by adding your first contact.'
                }
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
                <div
                  key={contact.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ContactCard
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                </div>
              ))}
            </div> 
          )}
        </div>

        {/* Contact Count */}
        {filteredContacts.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground animate-fade-in">
            {searchTerm ? (
              <p>Showing {filteredContacts.length} of {contacts.length} contacts</p>
            ) : (
              <p>{contacts.length} contact{contacts.length !== 1 ? 's' : ''} in your directory</p>
            )}
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};