import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Mail, Plus, Trash2, User, Bell, Edit2 } from "lucide-react";

interface Recipient {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  alert_types: string[];
  created_at: string;
}

const ALERT_TYPES = ["critical", "warning", "info"];

export function RecipientManager() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    alert_types: ["critical", "warning", "info"],
  });

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const { data, error } = await supabase
        .from("alert_recipients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recipients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecipient) {
        const { error } = await supabase
          .from("alert_recipients")
          .update({
            email: formData.email,
            name: formData.name || null,
            alert_types: formData.alert_types,
          })
          .eq("id", editingRecipient.id);

        if (error) throw error;
        toast({ title: "Success", description: "Recipient updated" });
      } else {
        const { error } = await supabase
          .from("alert_recipients")
          .insert({
            email: formData.email,
            name: formData.name || null,
            alert_types: formData.alert_types,
          });

        if (error) throw error;
        toast({ title: "Success", description: "Recipient added" });
      }

      setDialogOpen(false);
      setEditingRecipient(null);
      setFormData({ email: "", name: "", alert_types: ["critical", "warning", "info"] });
      fetchRecipients();
    } catch (error: any) {
      console.error("Error saving recipient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save recipient",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("alert_recipients")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;
      fetchRecipients();
    } catch (error) {
      console.error("Error toggling recipient:", error);
    }
  };

  const deleteRecipient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipient?")) return;

    try {
      const { error } = await supabase
        .from("alert_recipients")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Recipient deleted" });
      fetchRecipients();
    } catch (error) {
      console.error("Error deleting recipient:", error);
    }
  };

  const openEditDialog = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setFormData({
      email: recipient.email,
      name: recipient.name || "",
      alert_types: recipient.alert_types,
    });
    setDialogOpen(true);
  };

  const toggleAlertType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      alert_types: prev.alert_types.includes(type)
        ? prev.alert_types.filter(t => t !== type)
        : [...prev.alert_types, type]
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Email Recipients</h3>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => {
              setEditingRecipient(null);
              setFormData({ email: "", name: "", alert_types: ["critical", "warning", "info"] });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Alert Types</Label>
                <div className="flex gap-4 mt-2">
                  {ALERT_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={formData.alert_types.includes(type)}
                        onCheckedChange={() => toggleAlertType(type)}
                      />
                      <Label htmlFor={type} className="capitalize cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingRecipient ? "Update Recipient" : "Add Recipient"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : recipients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No recipients configured</p>
          <p className="text-sm">Add recipients to receive email alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                recipient.is_active ? "bg-background" : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{recipient.name || recipient.email}</p>
                  {recipient.name && (
                    <p className="text-sm text-muted-foreground">{recipient.email}</p>
                  )}
                  <div className="flex gap-1 mt-1">
                    {recipient.alert_types.map((type) => (
                      <Badge
                        key={type}
                        variant={type === "critical" ? "destructive" : type === "warning" ? "secondary" : "default"}
                        className="text-xs capitalize"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={recipient.is_active}
                  onCheckedChange={() => toggleActive(recipient.id, recipient.is_active)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openEditDialog(recipient)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteRecipient(recipient.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
