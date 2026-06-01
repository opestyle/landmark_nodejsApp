import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Code2,
  Cloud,
  Cpu,
  Boxes,
  Settings,
  Gauge,
  Send,
  Trash2,
  Users,
  Clock,
  Globe2,
} from "lucide-react";

function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width, R = size / 2 - 10, cx = size / 2, cy = size / 2;
    let angle = 0;
    const landPoints: [number, number][] = [];
    const continents = [
      { lonRange: [-0.15, 0.55] as [number,number], latRange: [0.6, 1.2] as [number,number], density: 60 },
      { lonRange: [-0.3, 0.8] as [number,number], latRange: [-0.3, 0.6] as [number,number], density: 80 },
      { lonRange: [0.6, 2.2] as [number,number], latRange: [0.2, 1.2] as [number,number], density: 90 },
      { lonRange: [1.8, 2.6] as [number,number], latRange: [-0.6, 0.0] as [number,number], density: 40 },
      { lonRange: [-2.0, -1.0] as [number,number], latRange: [0.4, 1.3] as [number,number], density: 70 },
      { lonRange: [-1.4, -0.6] as [number,number], latRange: [-0.9, 0.3] as [number,number], density: 50 },
    ];
    for (const c of continents)
      for (let i = 0; i < c.density; i++)
        landPoints.push([c.lonRange[0] + Math.random() * (c.lonRange[1] - c.lonRange[0]), c.latRange[0] + Math.random() * (c.latRange[1] - c.latRange[0])]);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const grad = ctx.createRadialGradient(cx - 15, cy - 15, R * 0.1, cx, cy, R);
      grad.addColorStop(0, "rgba(59,130,246,0.15)");
      grad.addColorStop(1, "rgba(30,64,175,0.08)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = "rgba(96,165,250,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = "rgba(96,165,250,0.1)"; ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        const r = R * Math.cos((lat * Math.PI) / 180), y = cy - R * Math.sin((lat * Math.PI) / 180);
        ctx.beginPath(); ctx.ellipse(cx, y, r, r * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
      }
      for (const [lon, lat] of landPoints) {
        const rotLon = lon + angle, x3d = Math.cos(lat) * Math.sin(rotLon), y3d = Math.sin(lat), z3d = Math.cos(lat) * Math.cos(rotLon);
        if (z3d < 0) continue;
        ctx.beginPath(); ctx.arc(cx + x3d * R, cy - y3d * R, 1.2 + z3d * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${0.3 + z3d * 0.7})`; ctx.fill();
      }
      angle += 0.004;
      requestAnimationFrame(draw);
    }
    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={280} height={280} className="mx-auto" />;
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const diff = nextYear.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000), hours = Math.floor((diff % 86400000) / 3600000),
    minutes = Math.floor((diff % 3600000) / 60000), seconds = Math.floor((diff % 60000) / 1000);
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="text-white/70 text-sm tracking-widest uppercase">Live Clock</span>
      </div>
      <div className="text-4xl font-bold text-blue-400 font-mono tracking-wider">{now.toLocaleTimeString()}</div>
      <div className="text-white/80 text-lg">{now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      <div className="pt-4 border-t border-blue-400/20">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Countdown to {nextYear.getFullYear()}</p>
        <div className="flex justify-center gap-3">
          {[{ val: days, label: "Days" }, { val: hours, label: "Hrs" }, { val: minutes, label: "Min" }, { val: seconds, label: "Sec" }].map((t) => (
            <div key={t.label} className="bg-blue-900/60 rounded-lg px-3 py-2 min-w-[56px]">
              <div className="text-xl font-mono font-bold text-blue-400">{String(t.val).padStart(2, "0")}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [contact, setContact] = useState(""); const [address, setAddress] = useState("");
  const [country, setCountry] = useState(""); const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: contacts = [], isLoading, refetch } = trpc.contacts.list.useQuery();
  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => { setName(""); setEmail(""); setContact(""); setAddress(""); setCountry(""); refetch(); toast.success("Contact saved successfully!"); },
    onError: (error: any) => toast.error(`Failed to save: ${error.message}`),
  });
  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Contact deleted!"); },
    onError: (error: any) => toast.error(`Failed to delete: ${error.message}`),
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !contact.trim() || !address.trim() || !country.trim()) { toast.error("Please fill in all fields"); return; }
    setIsSubmitting(true);
    try { await createContact.mutateAsync({ name: name.trim(), email: email.trim(), contact: contact.trim(), address: address.trim(), country: country.trim() }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-300 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-blue-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="LMU Logo" className="w-12 h-12 rounded-full object-cover border-2 border-blue-400/50" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider leading-tight">LANDMARK</h1>
              <span className="text-xs text-blue-300 font-light tracking-widest">METROPOLITAN UNIVERSITY</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button onClick={() => navigate("/topics")} className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm">Topics</Button>
            <Button onClick={() => navigate("/interview")} className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm">Interview</Button>
            <Button onClick={() => navigate("/resume")} className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm">Resume</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-5 pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img src="/logo.jpg" alt="LMU Logo" className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-blue-400/50 shadow-lg shadow-blue-500/20" />
          <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tighter mb-4">
            LANDMARK <span className="text-blue-400">DEVOPS</span>
          </div>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto font-light tracking-wide">
            A comprehensive teaching platform for modern DevOps practices
          </p>
          <p className="text-base text-blue-300 max-w-3xl mx-auto">
            Learn containerization, orchestration, infrastructure automation, and CI/CD pipelines through hands-on demonstrations.
          </p>
        </div>
      </section>

      {/* Globe + Clock + Calendar */}
      <section className="relative z-5 px-4 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-blue-900/40 border-blue-400/30 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span className="text-white/70 text-sm tracking-widest uppercase">World Globe</span>
            </div>
            <RotatingGlobe />
          </Card>
          <Card className="p-6 bg-blue-900/40 border-blue-400/30 flex flex-col justify-center">
            <LiveClock />
          </Card>
          <Card className="p-6 bg-blue-900/40 border-blue-400/30 flex flex-col items-center justify-center">
            <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-md" />
          </Card>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-5 px-4 pb-12" id="contact">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 bg-blue-900/40 border-blue-400/30">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wider">SUBMIT YOUR DETAILS</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Name", type: "text", value: name, set: setName, ph: "Enter your name..." },
                  { label: "Email", type: "email", value: email, set: setEmail, ph: "Enter your email..." },
                  { label: "Contact", type: "tel", value: contact, set: setContact, ph: "Enter your phone number..." },
                  { label: "Country", type: "text", value: country, set: setCountry, ph: "Enter your country..." },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-white font-bold mb-2 tracking-wider">{f.label}</label>
                    <Input type={f.type} placeholder={f.ph} value={f.value} onChange={(e) => f.set(e.target.value)}
                      className="bg-blue-900/50 border-blue-400/50 text-white placeholder:text-white/50" disabled={isSubmitting} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-white font-bold mb-2 tracking-wider">Address</label>
                <Input type="text" placeholder="Enter your address..." value={address} onChange={(e) => setAddress(e.target.value)}
                  className="bg-blue-900/50 border-blue-400/50 text-white placeholder:text-white/50" disabled={isSubmitting} />
              </div>
              <Button type="submit" disabled={isSubmitting || createContact.isPending}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold tracking-wider gap-2 w-full">
                <Send className="w-4 h-4" />{isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Contacts Table */}
      <section className="relative z-5 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white tracking-wider">SUBMITTED CONTACTS ({contacts.length})</h2>
          </div>
          {isLoading ? (
            <p className="text-white/70 text-center py-12">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <Card className="p-12 text-center bg-blue-900/40 border-blue-400/30">
              <p className="text-white/70">No contacts yet. Be the first to submit!</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-900/40 border-b-2 border-blue-400/50">
                    {["Name", "Email", "Contact", "Address", "Country", "Date", "Action"].map((h) => (
                      <th key={h} className={`px-6 py-4 text-white font-bold tracking-wider ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c: any) => (
                    <tr key={c.id} className="border-b border-blue-400/20 hover:bg-blue-900/20 transition-colors">
                      <td className="px-6 py-4 text-white">{c.name}</td>
                      <td className="px-6 py-4 text-white">{c.email}</td>
                      <td className="px-6 py-4 text-white">{c.contact}</td>
                      <td className="px-6 py-4 text-white">{c.address}</td>
                      <td className="px-6 py-4 text-white">{c.country}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Button onClick={() => deleteContact.mutate({ id: c.id })} variant="ghost" size="sm"
                          className="text-red-400 hover:text-red-300" disabled={deleteContact.isPending}>
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
      </section>

      {/* Features */}
      <section className="relative z-5 py-20 px-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-white text-center mb-4 tracking-wider">PLATFORM FEATURES</h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              [
                { Icon: Boxes, title: "Docker & Containers", desc: "Multi-stage builds, docker-compose, and volume demonstrations" },
                { Icon: Cpu, title: "Kubernetes", desc: "Pods, Deployments, StatefulSets, and advanced orchestration" },
                { Icon: Gauge, title: "CI/CD Pipelines", desc: "GitHub Actions, CircleCI, and Jenkins configurations" },
              ],
              [
                { Icon: Cloud, title: "AWS & Terraform", desc: "Infrastructure as Code with S3 remote state management" },
                { Icon: Code2, title: "Data Persistence", desc: "Contact form demonstrating database persistence" },
                { Icon: Settings, title: "Full Documentation", desc: "Comprehensive READMEs for every topic and tool" },
              ],
            ].map((col, ci) => (
              <div key={ci} className="space-y-6">
                {col.map(({ Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-400/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wider">{title}</h3>
                      <p className="text-white/70">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-5 border-t border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-blue-800/20 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img src="/logo.jpg" alt="LMU Logo" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-blue-400/30" />
          <p className="text-white/70 mb-4">Landmark Metropolitan University — DevOps Demo Platform</p>
          <p className="text-white/50 text-sm">Built for teaching modern DevOps practices and infrastructure automation</p>
        </div>
      </footer>
    </div>
  );
}
