import { useState } from "react";

// shadcn/ui
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input }   from "@/components/ui/input";
import { Label }   from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea }  from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// recharts
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

// lucide
import {
  HeartPulse, CalendarDays, ClipboardList, Award, CalendarClock,
  Bell, Search, Plus, LogOut, Settings, FileText, User, ChevronDown,
  Activity, Stethoscope, Smile, Clock, CheckCircle, AlertCircle,
  Menu, X, Trash2, Home, BookOpen, ChevronRight, Shield, TrendingUp, Phone, MapPin, Mail
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const R   = "#dc2626";
const RD  = "#b91c1c";
const RL  = "#fef2f2";
const P   = "#f43f5e";
const PL  = "#fff1f2";
const RO  = "#fb7185";
const BD  = "#fde8e8";
const BG  = "#fdf6f6";
const F   = "'Montserrat', sans-serif";

// ─── Seed data ────────────────────────────────────────────────────────────────
// Current logged-in student
const ME = { id:"2024-0001", name:"Alicia Santos", course:"BSN", year:2, gender:"F", dob:"2003-04-12", email:"alicia.santos@college.edu.ph", phone:"09171234567" };

const INIT_APTS = [
  { id:"APT-001", studentId:"2024-0001", student:"Alicia Santos", type:"Check-up",    service:"General",   date:"2026-03-02", time:"08:30", status:"Confirmed", doctor:"Dr. Cruz", notes:"Routine check-up" },
  { id:"APT-004", studentId:"2024-0001", student:"Alicia Santos", type:"Dental",      service:"Cleaning",  date:"2026-02-10", time:"10:00", status:"Completed", doctor:"Dr. Vega", notes:"Oral prophylaxis" },
  { id:"APT-007", studentId:"2024-0001", student:"Alicia Santos", type:"Certificate", service:"School",    date:"2026-01-20", time:"09:00", status:"Completed", doctor:"Dr. Lim",  notes:"For enrollment" },
];

const INIT_RECORDS = [
  { id:"REC-001", date:"2026-01-15", type:"General Check-up",    bp:"110/70", temp:"36.5°C", weight:"52 kg", diagnosis:"Healthy",     remarks:"No concerns",            doctor:"Dr. Cruz" },
  { id:"REC-002", date:"2026-02-10", type:"Dental",              bp:"—",      temp:"36.7°C", weight:"52 kg", diagnosis:"Plaque build-up", remarks:"Oral prophylaxis done",doctor:"Dr. Vega" },
  { id:"REC-003", date:"2026-01-20", type:"Medical Certificate", bp:"110/70", temp:"36.5°C", weight:"52 kg", diagnosis:"Healthy",     remarks:"Cert. for enrollment",   doctor:"Dr. Lim"  },
];

const INIT_CERTS = [
  { id:"CERT-003", type:"School Certificate", sport:"—",          issued:"2026-01-20", validity:"2026-06-20", status:"Active", doctor:"Dr. Lim"  },
];

const SCHEDULE = [
  { day:"Monday",    slots:[{ time:"08:00–12:00", doctor:"Dr. Cruz", service:"General Check-up" },{ time:"13:00–17:00", doctor:"Dr. Vega", service:"Dental" }] },
  { day:"Tuesday",   slots:[{ time:"08:00–12:00", doctor:"Dr. Lim",  service:"Medical Certificates" },{ time:"13:00–17:00", doctor:"Dr. Cruz", service:"General Check-up" }] },
  { day:"Wednesday", slots:[{ time:"08:00–12:00", doctor:"Dr. Vega", service:"Dental" },{ time:"13:00–17:00", doctor:"Dr. Lim", service:"Sports Clearance" }] },
  { day:"Thursday",  slots:[{ time:"08:00–12:00", doctor:"Dr. Cruz", service:"General Check-up" },{ time:"13:00–17:00", doctor:"Dr. Vega", service:"Dental" }] },
  { day:"Friday",    slots:[{ time:"08:00–12:00", doctor:"Dr. Lim",  service:"Medical Certificates" },{ time:"13:00–15:00", doctor:"Dr. Cruz", service:"General Check-up" }] },
];

const CHART_VISITS = [
  { month:"Sep", visits:2 }, { month:"Oct", visits:1 }, { month:"Nov", visits:3 },
  { month:"Dec", visits:1 }, { month:"Jan", visits:2 }, { month:"Feb", visits:2 },
];

const ANNOUNCEMENTS = [
  { id:1, icon:AlertCircle, color:"#f97316", title:"Free Dental Camp",        date:"Mar 5, 2026", body:"Walk-in dental cleaning for all students. No appointment needed. 8AM–3PM at the clinic." },
  { id:2, icon:Shield,      color:R,         title:"COVID Booster Drive",      date:"Mar 10, 2026",body:"Third booster dose available at the gymnasium. Bring your vaccination card." },
  { id:3, icon:HeartPulse,  color:P,         title:"Blood Pressure Screening", date:"Mar 12, 2026",body:"Free BP screening every Wednesday morning. No appointment required." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genId = (prefix, list) => {
  const max = list.reduce((m, x) => { const n = parseInt(x.id.replace(/\D/g,""),10); return n>m?n:m; }, 0);
  return `${prefix}-${String(max+1).padStart(3,"0")}`;
};

const STATUS_CLS = {
  Confirmed: "border-green-400 text-green-700 bg-green-50",
  Completed: "border-blue-400  text-blue-700  bg-blue-50",
  Pending:   "border-yellow-400 text-yellow-700 bg-yellow-50",
  Cancelled: "border-red-400   text-red-600   bg-red-50",
  Active:    "border-green-400 text-green-700 bg-green-50",
};
const StatusBadge = ({ s }) => <Badge variant="outline" className={`text-xs font-bold px-2.5 ${STATUS_CLS[s]||""}`}>{s}</Badge>;

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ fontFamily:F }} className="bg-white border border-rose-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-extrabold text-red-600 mb-1">{label}</p>
      {payload.map((p,i)=>(
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background:p.color||p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const emptyApt = { type:"Check-up", service:"General", date:"", time:"", doctor:"Dr. Cruz", notes:"" };

// ─── Book Appointment Dialog ──────────────────────────────────────────────────
const BookDialog = ({ trigger, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [f, sf] = useState(emptyApt);
  const [err, setErr] = useState("");
  const u = (k,v) => sf(x=>({...x,[k]:v}));

  const submit = () => {
    if (!f.date || !f.time) { setErr("Date and time are required."); return; }
    onAdd(f);
    sf(emptyApt); setErr(""); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v=>{ setOpen(v); if(!v){ sf(emptyApt); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg" style={{ fontFamily:F }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-extrabold text-lg" style={{ color:R, fontFamily:F }}>
            <CalendarDays size={18} style={{ color:R }} /> Book an Appointment
          </DialogTitle>
        </DialogHeader>
        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Service Type</Label>
            <Select value={f.type} onValueChange={v=>u("type",v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily:F }}><SelectValue /></SelectTrigger>
              <SelectContent>{["Check-up","Dental","Certificate"].map(t=><SelectItem key={t} value={t} style={{ fontFamily:F }}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Service Detail</Label>
            <Select value={f.service} onValueChange={v=>u("service",v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily:F }}><SelectValue /></SelectTrigger>
              <SelectContent>{["General","Sports","Player","School","Cleaning","Filling","Extraction"].map(t=><SelectItem key={t} value={t} style={{ fontFamily:F }}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Preferred Date *</Label>
            <Input type="date" value={f.date} onChange={e=>u("date",e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily:F }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Preferred Time *</Label>
            <Input type="time" value={f.time} onChange={e=>u("time",e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily:F }} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Doctor</Label>
            <Select value={f.doctor} onValueChange={v=>u("doctor",v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily:F }}><SelectValue /></SelectTrigger>
              <SelectContent>{["Dr. Cruz","Dr. Vega","Dr. Lim"].map(t=><SelectItem key={t} value={t} style={{ fontFamily:F }}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily:F }}>Notes / Symptoms</Label>
            <Textarea value={f.notes} onChange={e=>u("notes",e.target.value)} placeholder="Describe your symptoms or concern…" className="border-rose-200 resize-none text-xs" rows={3} style={{ fontFamily:F }} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily:F }}>Cancel</Button></DialogClose>
          <Button onClick={submit} className="font-extrabold text-xs" style={{ background:`linear-gradient(135deg,${R},${P})`, fontFamily:F }}>
            <CalendarDays size={13} className="mr-1.5" /> Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onClose }) => (
  <div style={{ fontFamily:F, animation:"slideUp .25s ease" }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-2xl rounded-2xl px-4 py-3 text-sm font-bold text-green-700">
    <CheckCircle size={16} className="text-green-500 shrink-0" />
    {msg}
    <button onClick={onClose} className="ml-1 text-gray-300 hover:text-gray-500">✕</button>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, accent, sub }) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" style={{ borderTop:`3px solid ${accent}` }}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-extrabold text-gray-900" style={{ fontFamily:F, fontSize:28, lineHeight:1 }}>{value}</p>
          <p className="text-xs font-bold text-gray-700 mt-1.5" style={{ fontFamily:F }}>{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${accent}18` }}>
          <Icon size={18} style={{ color:accent }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserClinicDashboard() {
  const [tab,  setTab]  = useState("home");
  const [apts, setApts] = useState(INIT_APTS);
  const [recs]          = useState(INIT_RECORDS);
  const [certs]         = useState(INIT_CERTS);
  const [toast, setToast] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const addApt = (f) => {
    const newApt = { ...f, id:genId("APT",apts), studentId:ME.id, student:ME.name, status:"Pending" };
    setApts(p=>[newApt,...p]);
    showToast("Appointment booked! We'll confirm shortly.");
  };

  const cancelApt = (id) => {
    setApts(p=>p.map(a=>a.id===id?{...a,status:"Cancelled"}:a));
    showToast("Appointment cancelled.");
  };

  const NAV = [
    { key:"home",         label:"Home",         Icon:Home          },
    { key:"appointments", label:"Appointments", Icon:CalendarDays  },
    { key:"records",      label:"My Records",   Icon:ClipboardList },
    { key:"certificates", label:"Certificates", Icon:Award         },
    { key:"schedule",     label:"Clinic Hours", Icon:CalendarClock },
    { key:"announcements",label:"Announcements",Icon:Bell          },
  ];

  const pieData = [
    { name:"Check-up",   value:apts.filter(a=>a.type==="Check-up").length + 1,    fill:R  },
    { name:"Dental",     value:apts.filter(a=>a.type==="Dental").length + 1,       fill:P  },
    { name:"Certificate",value:apts.filter(a=>a.type==="Certificate").length + 1,  fill:RO },
  ];

  const upcoming = apts.filter(a=>a.status==="Confirmed"||a.status==="Pending");
  const nextApt  = upcoming[0];

  const NavLink = ({ item, mobile=false }) => {
    const act = tab===item.key;
    return (
      <button onClick={()=>{ setTab(item.key); setMobileOpen(false); }}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${mobile?"w-full justify-start":""}`}
        style={{
          fontFamily:F,
          background: act ? RL : "transparent",
          color: act ? R : "#6b7280",
          fontWeight: act ? 800 : 600,
        }}>
        <item.Icon size={14} style={{ color: act ? R : "#9ca3af" }} />
        {item.label}
        {item.key==="announcements" && <span className="ml-auto w-4 h-4 rounded-full text-white flex items-center justify-center" style={{ fontSize:9, background:R, fontFamily:F }}>3</span>}
      </button>
    );
  };

  return (
    <TooltipProvider>
      <div style={{ fontFamily:F, background:BG, minHeight:"100vh" }}>

        {/* ── TOP NAVBAR ── */}
        <header className="sticky top-0 z-50 bg-white" style={{ borderBottom:`1.5px solid ${BD}`, boxShadow:"0 2px 16px rgba(220,38,38,.06)" }}>

          {/* Brand bar */}
          <div style={{ background:`linear-gradient(135deg,${R},${P})` }} className="px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <HeartPulse size={15} color="#fff" />
              </div>
              <span style={{ fontFamily:F, fontSize:13, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>HealthPoint Student Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 hidden sm:block" style={{ fontFamily:F }}>College Health Services</span>
              <div className="h-4 w-px bg-white/30" />
              <span className="text-xs text-white/70" style={{ fontFamily:F }}>Hotline: 8-888-1234</span>
            </div>
          </div>

          {/* Main nav row */}
          <div className="px-6 flex items-center justify-between h-14 gap-4">

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(item=><NavLink key={item.key} item={item} />)}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs" style={{ borderColor:BD, background:"#fff", fontFamily:F }}>
                <Search size={13} className="text-rose-300" />
                <input placeholder="Search records…" className="outline-none text-xs bg-transparent w-36" style={{ fontFamily:F }} />
              </div>

              {/* Book btn */}
              <BookDialog onAdd={addApt} trigger={
                <Button size="sm" className="gap-1.5 text-xs font-extrabold hidden sm:flex" style={{ background:`linear-gradient(135deg,${R},${P})`, fontFamily:F }}>
                  <Plus size={13} /> Book Appointment
                </Button>
              } />

              {/* Notification bell */}
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-rose-50">
                    <Bell size={16} className="text-gray-500" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background:R }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0 rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-4 py-3" style={{ background:`linear-gradient(135deg,${R},${P})` }}>
                    <p className="text-xs font-extrabold text-white" style={{ fontFamily:F }}>Notifications</p>
                  </div>
                  {[
                    { title:"Appointment Confirmed", body:"Your check-up on Mar 2 is confirmed.", time:"2h ago", color:R },
                    { title:"Clinic Closed — Holiday", body:"The clinic will be closed on Mar 8.", time:"1d ago", color:"#f97316" },
                    { title:"Free Dental Camp", body:"Walk-in dental on Mar 5, 8AM–3PM.", time:"2d ago", color:P },
                  ].map((n,i)=>(
                    <div key={i} className="flex gap-3 px-4 py-3 hover:bg-rose-50/50 cursor-pointer" style={{ borderBottom:i<2?`1px solid ${BD}`:"none" }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background:n.color }} />
                      <div>
                        <p className="text-xs font-bold text-gray-800" style={{ fontFamily:F }}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:F }}>{n.body}</p>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-rose-50">
                    <Avatar className="w-7 h-7 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs font-extrabold" style={{ background:`${R}18`, color:R, fontFamily:F }}>AS</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-extrabold text-gray-800 leading-none" style={{ fontFamily:F }}>{ME.name}</p>
                      <p className="text-xs text-gray-400 leading-none mt-0.5" style={{ fontFamily:F }}>{ME.id}</p>
                    </div>
                    <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl" style={{ fontFamily:F }}>
                  <DropdownMenuLabel className="font-extrabold text-xs" style={{ fontFamily:F }}>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer" style={{ fontFamily:F }}><User size={13} /> Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer" style={{ fontFamily:F }}><Settings size={13} /> Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-red-500" style={{ fontFamily:F }}><LogOut size={13} /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-rose-50">
                    <Menu size={18} className="text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-0">
                  <div className="px-4 py-5" style={{ background:`linear-gradient(135deg,${R},${P})` }}>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-9 h-9 rounded-xl">
                        <AvatarFallback className="rounded-xl text-sm font-extrabold" style={{ background:"rgba(255,255,255,.2)", color:"#fff", fontFamily:F }}>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-extrabold text-white" style={{ fontFamily:F }}>{ME.name}</p>
                        <p className="text-xs text-white/60" style={{ fontFamily:F }}>{ME.id}</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-3 space-y-1">
                    {NAV.map(item=><NavLink key={item.key} item={item} mobile />)}
                    <Separator className="my-2" />
                    <BookDialog onAdd={addApt} trigger={
                      <Button className="w-full text-xs font-extrabold gap-1.5 mt-1" style={{ background:`linear-gradient(135deg,${R},${P})`, fontFamily:F }}>
                        <Plus size={13} /> Book Appointment
                      </Button>
                    } />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── HOME ── */}
          {tab==="home" && (
            <>
              {/* Welcome hero */}
              <div className="rounded-2xl overflow-hidden" style={{ background:`linear-gradient(135deg,${R} 0%,${P} 100%)` }}>
                <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-white/70 text-xs font-semibold mb-1" style={{ fontFamily:F }}>Welcome back 👋</p>
                    <h1 className="text-white font-extrabold text-2xl leading-tight" style={{ fontFamily:F }}>{ME.name}</h1>
                    <p className="text-white/70 text-xs mt-1" style={{ fontFamily:F }}>{ME.course} — Year {ME.year} · {ME.id}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-white/80 text-xs" style={{ fontFamily:F }}><Mail size={11} /> {ME.email}</span>
                      <span className="flex items-center gap-1.5 text-white/80 text-xs" style={{ fontFamily:F }}><Phone size={11} /> {ME.phone}</span>
                    </div>
                  </div>
                  <BookDialog onAdd={addApt} trigger={
                    <Button size="sm" className="bg-white text-red-600 font-extrabold text-xs hover:bg-rose-50 shrink-0 gap-1.5 shadow-lg" style={{ fontFamily:F }}>
                      <Plus size={13} /> Book Appointment
                    </Button>
                  } />
                </div>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Appointments" value={apts.length}          Icon={CalendarDays}  accent={R}         sub="All time" />
                <StatCard label="Upcoming"           value={upcoming.length}       Icon={Clock}         accent={P}         sub="Pending or confirmed" />
                <StatCard label="Health Records"     value={recs.length}           Icon={ClipboardList} accent="#f97316"   sub="On file" />
                <StatCard label="Certificates"       value={certs.length}          Icon={Award}         accent="#8b5cf6"   sub="Issued" />
              </div>

              {/* Next appointment banner */}
              {nextApt && (
                <Card className="border-0 shadow-sm" style={{ borderLeft:`4px solid ${R}`, background:"#fff" }}>
                  <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:RL }}>
                        <CalendarDays size={22} style={{ color:R }} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-gray-800" style={{ fontFamily:F }}>Next Appointment</p>
                        <p className="text-sm font-extrabold mt-0.5" style={{ color:R, fontFamily:F }}>{nextApt.type} — {nextApt.service}</p>
                        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:F }}>{nextApt.date} at {nextApt.time} · {nextApt.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge s={nextApt.status} />
                      <Button size="sm" variant="outline" className="text-xs font-bold border-red-200 text-red-500 hover:bg-rose-50" style={{ fontFamily:F }}
                        onClick={()=>setTab("appointments")}>
                        View Details <ChevronRight size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Charts row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm" style={{ borderTop:`3px solid ${R}` }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-extrabold" style={{ color:R, fontFamily:F }}>Visit History</CardTitle>
                    <CardDescription className="text-xs" style={{ fontFamily:F }}>Last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={CHART_VISITS}>
                        <defs>
                          <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={R} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={R} stopOpacity={0}    />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={BD} />
                        <XAxis dataKey="month" tick={{ fontSize:10, fill:"#9ca3af", fontFamily:F }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize:10, fill:"#9ca3af", fontFamily:F }} axisLine={false} tickLine={false} />
                        <RTooltip content={<ChartTip />} />
                        <Area type="monotone" dataKey="visits" name="Visits" stroke={R} strokeWidth={2.5} fill="url(#gV)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm" style={{ borderTop:`3px solid ${P}` }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-extrabold" style={{ color:R, fontFamily:F }}>Visit Types</CardTitle>
                    <CardDescription className="text-xs" style={{ fontFamily:F }}>Distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" paddingAngle={3}>
                          {pieData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                        </Pie>
                        <RTooltip content={<ChartTip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {pieData.map(d=>(
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm shrink-0" style={{ background:d.fill }} />
                          <span className="text-xs flex-1 text-gray-500" style={{ fontFamily:F }}>{d.name}</span>
                          <span className="text-xs font-extrabold" style={{ fontFamily:F }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Announcements preview */}
              <Card className="border-0 shadow-sm" style={{ borderTop:`3px solid ${RO}` }}>
                <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-extrabold" style={{ color:R, fontFamily:F }}>Latest Announcements</CardTitle>
                  <Button size="sm" variant="ghost" onClick={()=>setTab("announcements")} className="text-red-500 text-xs font-bold gap-1 hover:bg-rose-50" style={{ fontFamily:F }}>
                    See all <ChevronRight size={12} />
                  </Button>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3 pt-0">
                  {ANNOUNCEMENTS.map(a=>(
                    <div key={a.id} className="rounded-xl p-3.5 flex flex-col gap-2" style={{ background:RL, border:`1px solid ${BD}` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:`${a.color}18` }}>
                          <a.icon size={14} style={{ color:a.color }} />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-gray-800" style={{ fontFamily:F }}>{a.title}</p>
                          <p className="text-xs text-gray-400" style={{ fontFamily:F }}>{a.date}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily:F }}>{a.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* ── APPOINTMENTS ── */}
          {tab==="appointments" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-extrabold text-lg" style={{ color:R, fontFamily:F }}>My Appointments</h2>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{apts.length} total · {upcoming.length} upcoming</p>
                </div>
                <BookDialog onAdd={addApt} trigger={
                  <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background:`linear-gradient(135deg,${R},${P})`, fontFamily:F }}>
                    <Plus size={13} /> Book Appointment
                  </Button>
                } />
              </div>

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color:R, fontFamily:F }}>Upcoming</p>
                  {upcoming.map(a=>(
                    <Card key={a.id} className="border-0 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeft:`4px solid ${a.status==="Confirmed"?"#22c55e":P}` }}>
                      <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background:RL }}>
                            {a.type==="Dental" ? <Smile size={20} style={{ color:R }} /> : a.type==="Certificate" ? <Award size={20} style={{ color:R }} /> : <Stethoscope size={20} style={{ color:R }} />}
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-gray-900" style={{ fontFamily:F }}>{a.type} — {a.service}</p>
                            <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:F }}>{a.date} · {a.time} · {a.doctor}</p>
                            {a.notes && <p className="text-xs text-gray-400 mt-0.5 italic" style={{ fontFamily:F }}>"{a.notes}"</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge s={a.status} />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:bg-rose-50" onClick={()=>cancelApt(a.id)}>
                                <Trash2 size={13} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent style={{ fontFamily:F }}>Cancel appointment</TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* History */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color:"#6b7280", fontFamily:F }}>History</p>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ background:RL }}>
                          {["ID","Date","Time","Type","Service","Doctor","Status","Action"].map(h=>(
                            <TableHead key={h} className="text-xs font-extrabold uppercase tracking-wide" style={{ color:R, fontFamily:F }}>{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apts.filter(a=>a.status==="Completed"||a.status==="Cancelled").map(a=>(
                          <TableRow key={a.id} className="hover:bg-rose-50/30">
                            <TableCell className="font-mono text-xs text-gray-400" style={{ fontFamily:F }}>{a.id}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily:F }}>{a.date}</TableCell>
                            <TableCell><Badge variant="outline" className="font-mono text-xs border-rose-200 text-red-400 bg-rose-50" style={{ fontFamily:F }}>{a.time}</Badge></TableCell>
                            <TableCell className="text-xs font-semibold" style={{ fontFamily:F }}>{a.type}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily:F }}>{a.service}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily:F }}>{a.doctor}</TableCell>
                            <TableCell><StatusBadge s={a.status} /></TableCell>
                            <TableCell>
                              {a.status==="Completed" && (
                                <Button size="sm" variant="ghost" className="text-xs text-blue-500 hover:bg-blue-50 h-7 px-2 font-bold" style={{ fontFamily:F }} onClick={()=>setTab("records")}>
                                  View Record
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {apts.filter(a=>a.status==="Completed"||a.status==="Cancelled").length===0 && (
                          <TableRow><TableCell colSpan={8} className="text-center text-xs text-gray-400 py-10" style={{ fontFamily:F }}>No past appointments yet.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* ── MY RECORDS ── */}
          {tab==="records" && (
            <>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color:R, fontFamily:F }}>My Health Records</h2>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{recs.length} records on file</p>
              </div>
              <div className="space-y-3">
                {recs.map(r=>(
                  <Card key={r.id} className="border-0 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeft:`4px solid ${R}` }}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background:RL }}>
                            {r.type.includes("Dental") ? <Smile size={20} style={{ color:R }} /> : r.type.includes("Certificate") ? <Award size={20} style={{ color:R }} /> : <Activity size={20} style={{ color:R }} />}
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-gray-900" style={{ fontFamily:F }}>{r.type}</p>
                            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{r.date} · {r.doctor}</p>
                            <div className="flex gap-4 mt-2 flex-wrap">
                              {[["BP", r.bp], ["Temp", r.temp], ["Weight", r.weight]].map(([l,v])=>(
                                <div key={l} className="text-center">
                                  <p className="text-xs text-gray-400" style={{ fontFamily:F }}>{l}</p>
                                  <p className="font-extrabold text-xs text-gray-800 mt-0.5" style={{ fontFamily:F, color:l==="BP"?R:"inherit" }}>{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400" style={{ fontFamily:F }}>Diagnosis</p>
                          <p className="font-extrabold text-sm mt-0.5" style={{ color:R, fontFamily:F }}>{r.diagnosis}</p>
                          {r.remarks && <p className="text-xs text-gray-500 mt-1 max-w-48" style={{ fontFamily:F }}>{r.remarks}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {recs.length===0 && (
                  <div className="text-center py-16 text-gray-400 text-sm" style={{ fontFamily:F }}>No health records on file yet.</div>
                )}
              </div>
            </>
          )}

          {/* ── CERTIFICATES ── */}
          {tab==="certificates" && (
            <>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color:R, fontFamily:F }}>My Certificates</h2>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{certs.length} certificate{certs.length!==1?"s":""} issued</p>
              </div>
              {certs.length===0 ? (
                <div className="text-center py-16 text-gray-400 text-sm rounded-2xl border-2 border-dashed" style={{ fontFamily:F, borderColor:BD }}>
                  No certificates yet.<br />
                  <Button size="sm" className="mt-4 gap-1.5 text-xs font-extrabold" style={{ background:`linear-gradient(135deg,${R},${P})`, fontFamily:F }} onClick={()=>setTab("appointments")}>
                    <Plus size={13} /> Book an Appointment
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certs.map(c=>(
                    <Card key={c.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="h-2" style={{ background:`linear-gradient(90deg,${R},${P})` }} />
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:RL }}>
                            <Award size={20} style={{ color:R }} />
                          </div>
                          <StatusBadge s={c.status} />
                        </div>
                        <p className="font-extrabold text-sm text-gray-900" style={{ fontFamily:F }}>{c.type}</p>
                        {c.sport!=="—" && <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:F }}>Sport: {c.sport}</p>}
                        <Separator className="my-3" style={{ borderColor:BD }} />
                        <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily:F }}>
                          {[["Issued By", c.doctor],["Cert. ID", c.id],["Date Issued", c.issued],["Valid Until", c.validity]].map(([l,v])=>(
                            <div key={l}>
                              <p className="text-gray-400 font-semibold">{l}</p>
                              <p className="font-bold text-gray-800 mt-0.5">{v}</p>
                            </div>
                          ))}
                        </div>
                        <Button size="sm" className="w-full mt-4 gap-1.5 text-xs font-extrabold" variant="outline"
                          style={{ borderColor:BD, color:R, fontFamily:F }}>
                          <FileText size={12} /> Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── CLINIC HOURS / SCHEDULE ── */}
          {tab==="schedule" && (
            <>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color:R, fontFamily:F }}>Clinic Hours & Schedule</h2>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>Weekly doctor availability</p>
              </div>

              {/* Info strip */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { Icon:MapPin,  label:"Location",     value:"Health Services Building, Room 104", color:R   },
                  { Icon:Phone,   label:"Hotline",       value:"8-888-1234 / 0917-000-0001",         color:P   },
                  { Icon:Clock,   label:"Walk-in Hours", value:"Monday–Friday, 7:30 AM – 5:00 PM",   color:RO  },
                ].map(k=>(
                  <div key={k.label} className="flex items-center gap-3 rounded-xl p-4" style={{ background:"#fff", border:`1px solid ${BD}` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${k.color}18` }}>
                      <k.Icon size={16} style={{ color:k.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-gray-800" style={{ fontFamily:F }}>{k.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:F }}>{k.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-5 gap-3">
                {SCHEDULE.map((day,di)=>(
                  <Card key={day.day} className="border-0 shadow-sm" style={{ borderTop:`3px solid ${di%2===0?R:P}` }}>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-xs font-extrabold" style={{ color:R, fontFamily:F }}>{day.day}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      {day.slots.map((sl,i)=>(
                        <div key={i} className="rounded-lg p-2.5" style={{ background:i===0?RL:PL, borderLeft:`3px solid ${i===0?R:P}` }}>
                          <p className="text-xs font-extrabold" style={{ color:i===0?R:P, fontFamily:F }}>{sl.time}</p>
                          <p className="text-xs font-bold text-gray-800 mt-0.5" style={{ fontFamily:F }}>{sl.doctor}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily:F }}>{sl.service}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 shadow-sm" style={{ borderTop:`3px solid #f97316` }}>
                <CardContent className="p-5">
                  <p className="text-sm font-extrabold text-gray-800 mb-3" style={{ fontFamily:F }}>Our Doctors</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name:"Dr. Maria Cruz",   spec:"General Medicine",      avail:"Mon, Thu, Fri AM" },
                      { name:"Dr. Jose Vega",    spec:"Dentistry",             avail:"Mon, Wed, Thu PM" },
                      { name:"Dr. Ana Lim",      spec:"Medical Certifications",avail:"Tue, Wed, Fri AM" },
                    ].map(d=>(
                      <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:RL }}>
                        <Avatar className="w-10 h-10 rounded-xl">
                          <AvatarFallback className="rounded-xl text-xs font-extrabold" style={{ background:`${R}18`, color:R, fontFamily:F }}>{d.name.split(" ").slice(-1)[0][0]}{d.name.split(" ")[1][0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-extrabold text-gray-900" style={{ fontFamily:F }}>{d.name}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily:F }}>{d.spec}</p>
                          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>{d.avail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {tab==="announcements" && (
            <>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color:R, fontFamily:F }}>Clinic Announcements</h2>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily:F }}>Health news and updates from the clinic</p>
              </div>
              <div className="space-y-4">
                {[
                  ...ANNOUNCEMENTS,
                  { id:4, icon:Activity,  color:"#8b5cf6", title:"Mental Health Week",     date:"Mar 15–19, 2026", body:"Free counseling sessions available all week. No appointment needed. Visit Room 202." },
                  { id:5, icon:TrendingUp,color:"#06b6d4", title:"Flu Season Advisory",    date:"Mar 20, 2026",    body:"Students are encouraged to get flu vaccines. Available at the clinic every Tuesday." },
                ].map(a=>(
                  <Card key={a.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${a.color}15` }}>
                        <a.icon size={20} style={{ color:a.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-extrabold text-sm text-gray-900" style={{ fontFamily:F }}>{a.title}</p>
                          <span className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily:F }}>{a.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed" style={{ fontFamily:F }}>{a.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 px-6" style={{ borderTop:`1px solid ${BD}`, background:"#fff" }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <HeartPulse size={14} style={{ color:R }} />
              <span className="text-xs font-extrabold" style={{ color:R, fontFamily:F }}>HealthPoint</span>
              <span className="text-xs text-gray-400" style={{ fontFamily:F }}>· College Health Services</span>
            </div>
            <p className="text-xs text-gray-400" style={{ fontFamily:F }}>© {new Date().getFullYear()} All rights reserved · For emergencies call 911</p>
          </div>
        </footer>

        {toast && <Toast msg={toast} onClose={()=>setToast("")} />}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
          * { box-sizing:border-box; }
          body { font-family:'Montserrat',sans-serif; }
          @keyframes slideUp { from{ opacity:0; transform:translateY(12px); } to{ opacity:1; transform:translateY(0); } }
        `}</style>
      </div>
    </TooltipProvider>
  );
}