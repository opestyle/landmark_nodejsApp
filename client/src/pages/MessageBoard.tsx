import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowLeft, Database, Send, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Poll the database status every 10 seconds so the UI updates automatically
  // once the database pod is deployed in Kubernetes.
  const { data: dbStatus } = trpc.dbStatus.useQuery(undefined, {
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
  });
  const dbAvailable = dbStatus?.available ?? false;

  // Query contacts
  const { data: contacts = [], isLoading, refetch } = trpc.contacts.list.useQuery(undefined, {
    refetchInterval: dbAvailable ? 30_000 : false,
  });

  // Mutations
  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setContact("");
      setAddress("");
      setCountry("");
      refetch();
      toast.success("Contact saved successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to save contact: ${error.message}`);
    },
  });

  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Contact deleted!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !contact.trim() || !address.trim() || !country.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await createContact.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        contact: contact.trim(),
        address: address.trim(),
        country: country.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || createContact.isPending || !dbAvailable;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-400/30 bg-gradient-to-r from-orange-900/20 to-orange-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-cream hover:text-yellow-400 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          {/* Live database status indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
            dbAvailable
              ? "bg-green-900/40 border border-green-400/40 text-green-300"
              : "bg-red-900/40 border border-red-400/40 text-red-300"
          }`}>
            <Database className="w-4 h-4" />
            {dbAvailable ? "Database Connected" : "Database Offline"}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">

        {/* ── Database Unavailable Banner ─────────────────────────────────── */}
        {!dbAvailable && (
          <div className="mb-8 flex items-start gap-4 p-5 rounded-xl border border-amber-400/50 bg-amber-900/30 text-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 text-lg">Database Not Available</p>
              <p className="mt-1 text-sm leading-relaxed">
                The application is running but the database service has not been deployed yet.
                You can browse the page normally, but contact submissions are disabled until
                the database pod is running and healthy.
              </p>
              <p className="mt-2 text-xs text-amber-400/80 font-mono">
                Kubernetes: deploy the MySQL StatefulSet to enable data persistence.
              </p>
            </div>
          </div>
        )}

        {/* ── Contact Form ─────────────────────────────────────────────────── */}
        <Card className={`p-8 mb-12 bg-orange-900/40 border-orange-400/30 ${
          !dbAvailable ? "opacity-75" : ""
        }`}>
          <div className="flex items-center gap-3 mb-8">
            <Send className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-cream tracking-wider">SUBMIT CONTACT</h2>
            {!dbAvailable && (
              <span className="ml-auto text-xs font-semibold px-2 py-1 rounded bg-red-900/50 border border-red-400/40 text-red-300">
                SUBMISSIONS DISABLED
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Phone Number</label>
                <Input
                  type="text"
                  placeholder="Enter your phone number..."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Country</label>
                <Input
                  type="text"
                  placeholder="Enter your country..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isFormDisabled}
                />
              </div>
            </div>
            <div>
              <label className="block text-cream font-bold mb-2 tracking-wider">Address</label>
              <Input
                type="text"
                placeholder="Enter your address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                disabled={isFormDisabled}
              />
            </div>
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="bg-yellow-400 text-orange-900 hover:bg-yellow-300 font-bold tracking-wider gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting
                ? "Saving..."
                : !dbAvailable
                ? "Database Required to Submit"
                : "Submit"}
            </Button>
          </form>
        </Card>

        {/* ── Contacts Table ───────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-cream tracking-wider">
              SUBMITTED CONTACTS ({contacts.length})
            </h2>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-cream/70">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <Card className="p-12 text-center bg-orange-900/40 border-orange-400/30">
              <p className="text-cream/70 mb-4">
                {dbAvailable
                  ? "No contacts yet. Be the first to submit!"
                  : "No data — database is not connected."}
              </p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-900/40 border-b-2 border-yellow-400/50">
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Date</th>
                    <th className="px-6 py-4 text-center text-cream font-bold tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c: any) => (
                    <tr
                      key={c.id}
                      className="border-b border-orange-400/20 hover:bg-orange-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-cream">{c.name}</td>
                      <td className="px-6 py-4 text-cream">{c.email}</td>
                      <td className="px-6 py-4 text-cream">{c.contact}</td>
                      <td className="px-6 py-4 text-cream">{c.address}</td>
                      <td className="px-6 py-4 text-cream">{c.country}</td>
                      <td className="px-6 py-4 text-cream/60 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => deleteContact.mutate({ id: c.id })}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          disabled={deleteContact.isPending || !dbAvailable}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
