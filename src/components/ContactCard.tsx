import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge"; // removed (unused)
import { Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";

interface Contact {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface ContactCardProps {
  contact: {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onEdit: (contact: Contact) => void;
  onDelete: () => void;
}


export const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const initials = contact.name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <Card className="group hover:shadow-medium transition-smooth animate-scale-in bg-card border border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {initials || "?"}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground">{contact.name}</h3>
              <div className="space-y-1 mt-2">
                {contact.email && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate">{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(contact)}
              className="hover:bg-accent"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete()}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};