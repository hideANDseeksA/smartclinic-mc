import { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn/ui
import { Badge }         from "@/components/ui/badge";
import { Button }        from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input }         from "@/components/ui/input";
import { Label }         from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator }     from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea }      from "@/components/ui/textarea";
import { ScrollArea }    from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// recharts
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";

// lucide-react
import {
  LayoutDashboard, CalendarDays, ClipboardList, Award, CalendarClock,
  Users, BarChart2, HeartPulse, ChevronRight, Search, Plus, LogOut,
  Settings, FileText, Clock, User, BookOpen,
  Activity, Stethoscope, TrendingUp, Bell, Smile, Trash2, CheckCircle
} from "lucide-react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const RED       = "#dc2626";
const RED_DARK  = "#b91c1c";
const RED_LIGHT = "#fef2f2";
const PINK      = "#f43f5e";
const PINK_LT   = "#fff1f2";
const ROSE      = "#fb7185";
const BORDER    = "#fde8e8";
const BG        = "#fdf6f6";
const FONT      = "'Montserrat', sans-serif";

// ─── ID generators ────────────────────────────────────────────────────────────
const genId = (prefix, list) => {
  const max = list.reduce((m, x) => {
    const n = parseInt(x.id.replace(/\D/g, ""), 10);
    return n > m ? n : m;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
};

// ─── Initial Seed Data ────────────────────────────────────────────────────────
const INIT_STUDENTS = [
  { id:"2024-0001", name:"Alicia Santos",    course:"BSN",  year:2, gender:"F", dob:"2003-04-12" },
  { id:"2024-0002", name:"Marco Reyes",       course:"BSIT", year:3, gender:"M", dob:"2002-07-23" },
  { id:"2024-0003", name:"Trisha Bautista",   course:"BSEd", year:1, gender:"F", dob:"2005-01-09" },
  { id:"2024-0004", name:"Jansen Villanueva", course:"BSBA", year:4, gender:"M", dob:"2001-11-30" },
  { id:"2024-0005", name:"Rina Castillo",     course:"BSME", year:2, gender:"F", dob:"2003-08-17" },
  { id:"2024-0006", name:"Leo Manalo",        course:"BSCS", year:3, gender:"M", dob:"2002-03-05" },
  { id:"2024-0007", name:"Camille Tan",       course:"BSA",  year:1, gender:"F", dob:"2005-06-22" },
  { id:"2024-0008", name:"Ryan Delos Reyes",  course:"BSCE", year:4, gender:"M", dob:"2001-09-14" },
];

const INIT_APPOINTMENTS = [
  { id:"APT-001", studentId:"2024-0001", student:"Alicia Santos",    type:"Check-up",    service:"General",    date:"2026-03-02", time:"08:30", status:"Confirmed",  doctor:"Dr. Cruz" },
  { id:"APT-002", studentId:"2024-0002", student:"Marco Reyes",       type:"Dental",      service:"Cleaning",   date:"2026-03-02", time:"09:00", status:"Pending",    doctor:"Dr. Vega" },
  { id:"APT-003", studentId:"2024-0003", student:"Trisha Bautista",   type:"Check-up",    service:"Sports",     date:"2026-03-03", time:"10:00", status:"Confirmed",  doctor:"Dr. Cruz" },
  { id:"APT-004", studentId:"2024-0004", student:"Jansen Villanueva", type:"Certificate", service:"Player",     date:"2026-03-03", time:"11:30", status:"Completed",  doctor:"Dr. Lim"  },
  { id:"APT-005", studentId:"2024-0005", student:"Rina Castillo",     type:"Dental",      service:"Filling",    date:"2026-03-04", time:"08:00", status:"Pending",    doctor:"Dr. Vega" },
  { id:"APT-006", studentId:"2024-0006", student:"Leo Manalo",        type:"Check-up",    service:"General",    date:"2026-03-04", time:"09:30", status:"Cancelled",  doctor:"Dr. Cruz" },
  { id:"APT-007", studentId:"2024-0007", student:"Camille Tan",       type:"Certificate", service:"School",     date:"2026-03-05", time:"10:30", status:"Confirmed",  doctor:"Dr. Lim"  },
  { id:"APT-008", studentId:"2024-0008", student:"Ryan Delos Reyes",  type:"Dental",      service:"Extraction", date:"2026-03-05", time:"13:00", status:"Completed",  doctor:"Dr. Vega" },
];

const INIT_RECORDS = [
  { id:"REC-001", studentId:"2024-0001", student:"Alicia Santos",    date:"2026-01-15", type:"General Check-up",   bp:"110/70", temp:"36.5°C", weight:"52 kg", diagnosis:"Healthy",     remarks:"No concerns",             doctor:"Dr. Cruz" },
  { id:"REC-002", studentId:"2024-0002", student:"Marco Reyes",       date:"2026-01-20", type:"Dental",             bp:"120/80", temp:"36.8°C", weight:"68 kg", diagnosis:"Tooth decay", remarks:"Filling recommended",      doctor:"Dr. Vega" },
  { id:"REC-003", studentId:"2024-0004", student:"Jansen Villanueva", date:"2026-02-05", type:"Sports Clearance",   bp:"118/76", temp:"36.6°C", weight:"75 kg", diagnosis:"Fit to play", remarks:"Certificate issued",        doctor:"Dr. Lim"  },
  { id:"REC-004", studentId:"2024-0005", student:"Rina Castillo",     date:"2026-02-10", type:"General Check-up",   bp:"105/65", temp:"37.1°C", weight:"49 kg", diagnosis:"Mild fever",  remarks:"Paracetamol prescribed",   doctor:"Dr. Cruz" },
  { id:"REC-005", studentId:"2024-0006", student:"Leo Manalo",        date:"2026-02-18", type:"Dental",             bp:"122/82", temp:"36.7°C", weight:"71 kg", diagnosis:"Gingivitis",  remarks:"Oral hygiene advised",     doctor:"Dr. Vega" },
  { id:"REC-006", studentId:"2024-0003", student:"Trisha Bautista",   date:"2026-02-25", type:"Medical Certificate", bp:"112/72", temp:"36.5°C", weight:"55 kg", diagnosis:"Healthy",     remarks:"Certificate for PE class", doctor:"Dr. Lim"  },
];

const INIT_CERTIFICATES = [
  { id:"CERT-001", student:"Jansen Villanueva", studentId:"2024-0004", type:"Player Clearance",   sport:"Basketball", issued:"2026-02-05", validity:"2026-08-05", status:"Active", doctor:"Dr. Lim"  },
  { id:"CERT-002", student:"Marco Reyes",        studentId:"2024-0002", type:"Player Clearance",   sport:"Volleyball", issued:"2026-01-28", validity:"2026-07-28", status:"Active", doctor:"Dr. Lim"  },
  { id:"CERT-003", student:"Alicia Santos",      studentId:"2024-0001", type:"School Certificate", sport:"—",          issued:"2026-01-15", validity:"2026-06-15", status:"Active", doctor:"Dr. Cruz" },
  { id:"CERT-004", student:"Trisha Bautista",    studentId:"2024-0003", type:"School Certificate", sport:"—",          issued:"2026-02-25", validity:"2026-08-25", status:"Active", doctor:"Dr. Lim"  },
];

const INIT_SCHEDULE = [
  { day:"Monday",    slots:[{ time:"08:00–12:00", doctor:"Dr. Cruz", service:"General Check-up" },{ time:"13:00–17:00", doctor:"Dr. Vega", service:"Dental" }] },
  { day:"Tuesday",   slots:[{ time:"08:00–12:00", doctor:"Dr. Lim",  service:"Medical Certificates" },{ time:"13:00–17:00", doctor:"Dr. Cruz", service:"General Check-up" }] },
  { day:"Wednesday", slots:[{ time:"08:00–12:00", doctor:"Dr. Vega", service:"Dental" },{ time:"13:00–17:00", doctor:"Dr. Lim", service:"Sports Clearance" }] },
  { day:"Thursday",  slots:[{ time:"08:00–12:00", doctor:"Dr. Cruz", service:"General Check-up" },{ time:"13:00–17:00", doctor:"Dr. Vega", service:"Dental" }] },
  { day:"Friday",    slots:[{ time:"08:00–12:00", doctor:"Dr. Lim",  service:"Medical Certificates" },{ time:"13:00–15:00", doctor:"Dr. Cruz", service:"General Check-up" }] },
];

// ─── Chart Data ───────────────────────────────────────────────────────────────
const monthlyData = [
  { month:"Jan", visits:38, checkup:18, dental:12, cert:8  },
  { month:"Feb", visits:52, checkup:24, dental:18, cert:10 },
  { month:"Mar", visits:44, checkup:20, dental:14, cert:10 },
  { month:"Apr", visits:67, checkup:30, dental:22, cert:15 },
  { month:"May", visits:55, checkup:25, dental:18, cert:12 },
  { month:"Jun", visits:70, checkup:32, dental:24, cert:14 },
  { month:"Jul", visits:60, checkup:28, dental:20, cert:12 },
  { month:"Aug", visits:75, checkup:35, dental:26, cert:14 },
  { month:"Sep", visits:80, checkup:36, dental:28, cert:16 },
  { month:"Oct", visits:65, checkup:30, dental:22, cert:13 },
  { month:"Nov", visits:90, checkup:42, dental:30, cert:18 },
  { month:"Dec", visits:72, checkup:33, dental:24, cert:15 },
];

const conditionData = [
  { name:"Healthy",     count:289, fill:RED   },
  { name:"Tooth Decay", count:112, fill:PINK  },
  { name:"Mild Fever",  count:87,  fill:ROSE  },
  { name:"Gingivitis",  count:64,  fill:"#f97316" },
  { name:"Fit to Play", count:54,  fill:"#8b5cf6" },
  { name:"Hypertension",count:28,  fill:"#06b6d4" },
];

const weeklyData = [
  { day:"Mon", morning:8, afternoon:6 },
  { day:"Tue", morning:5, afternoon:7 },
  { day:"Wed", morning:9, afternoon:4 },
  { day:"Thu", morning:7, afternoon:8 },
  { day:"Fri", morning:6, afternoon:3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusStyle = {
  Confirmed: "border-green-400 text-green-700 bg-green-50",
  Pending:   "border-yellow-400 text-yellow-700 bg-yellow-50",
  Completed: "border-blue-400 text-blue-700 bg-blue-50",
  Cancelled: "border-red-400 text-red-600 bg-red-50",
  Active:    "border-green-400 text-green-700 bg-green-50",
};
const StatusBadge = ({ status }) => (
  <Badge variant="outline" className={`text-xs font-bold px-2.5 py-0.5 ${statusStyle[status] || "border-gray-300 text-gray-600"}`}>
    {status}
  </Badge>
);

const TH = ({ children }) => (
  <TableHead className="text-xs font-extrabold uppercase tracking-wider whitespace-nowrap" style={{ color: RED, background: RED_LIGHT, fontFamily: FONT }}>
    {children}
  </TableHead>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ fontFamily: FONT }} className="bg-white border border-rose-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-extrabold text-red-600 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const KpiCard = ({ label, value, sub, Icon, accent }) => (
  <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid ${accent}` }}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-extrabold text-gray-900" style={{ fontFamily: FONT, fontSize: 30, lineHeight: 1 }}>{value}</p>
          <p className="text-xs font-bold text-gray-700 mt-1.5" style={{ fontFamily: FONT }}>{label}</p>
          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: FONT }}>{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SearchInput = ({ value, onChange, placeholder = "Search…" }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" size={13} />
    <Input value={value} onChange={onChange} placeholder={placeholder}
      className="pl-8 border-rose-200 focus:border-red-400 text-xs w-56"
      style={{ fontFamily: FONT }} />
  </div>
);

// ─── Empty form states ────────────────────────────────────────────────────────
const emptyApt  = { studentId:"", student:"", type:"Check-up", service:"General", date:"", time:"", status:"Pending", doctor:"Dr. Cruz", notes:"" };
const emptyRec  = { studentId:"", student:"", date:"", type:"General Check-up", bp:"", temp:"", weight:"", diagnosis:"", remarks:"", doctor:"Dr. Cruz" };
const emptyCert = { studentId:"", student:"", type:"Player Clearance", sport:"", doctor:"Dr. Lim", months:"6" };
const emptySlot = { day:"Monday", doctor:"", time:"", service:"" };
const emptyStu  = { id:"", name:"", course:"BSN", year:"1", gender:"M", dob:"" };

// ─── Appointment Dialog ───────────────────────────────────────────────────────
const AppointmentDialog = ({ trigger, onAdd, students }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyApt);
  const [err, setErr] = useState("");

  const u = (k, v) => setF(x => ({ ...x, [k]: v }));

  const handleStudentId = (val) => {
    u("studentId", val);
    const found = students.find(s => s.id === val);
    if (found) u("student", found.name);
    else u("student", "");
  };

  const submit = () => {
    if (!f.studentId || !f.date || !f.time) { setErr("Student ID, date, and time are required."); return; }
    onAdd(f);
    setF(emptyApt);
    setErr("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setF(emptyApt); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg" style={{ fontFamily: FONT }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: RED, fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>
            <HeartPulse size={18} style={{ color: RED }} /> New Appointment
          </DialogTitle>
        </DialogHeader>

        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Student ID *</Label>
            <Select value={f.studentId} onValueChange={handleStudentId}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue placeholder="Pick student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id} style={{ fontFamily: FONT }}>{s.id} — {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Student Name</Label>
            <Input value={f.student} readOnly placeholder="Auto-filled" className="border-rose-100 bg-rose-50 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Date *</Label>
            <Input type="date" value={f.date} onChange={e => u("date", e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Time *</Label>
            <Input type="time" value={f.time} onChange={e => u("time", e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Service Type</Label>
            <Select value={f.type} onValueChange={v => u("type", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Check-up","Dental","Certificate"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Service Detail</Label>
            <Select value={f.service} onValueChange={v => u("service", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["General","Sports","Player","School","Cleaning","Filling","Extraction"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Doctor</Label>
            <Select value={f.doctor} onValueChange={v => u("doctor", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Dr. Cruz","Dr. Vega","Dr. Lim"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Status</Label>
            <Select value={f.status} onValueChange={v => u("status", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Pending","Confirmed","Completed","Cancelled"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Notes (optional)</Label>
            <Textarea value={f.notes} onChange={e => u("notes", e.target.value)} placeholder="Any special notes…" className="border-rose-200 resize-none text-xs" rows={2} style={{ fontFamily: FONT }} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily: FONT }}>Cancel</Button></DialogClose>
          <Button onClick={submit} style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
            <Plus size={13} className="mr-1" /> Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Health Record Dialog ─────────────────────────────────────────────────────
const RecordDialog = ({ trigger, onAdd, students }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyRec);
  const [err, setErr] = useState("");

  const u = (k, v) => setF(x => ({ ...x, [k]: v }));

  const handleStudentId = (val) => {
    u("studentId", val);
    const found = students.find(s => s.id === val);
    if (found) u("student", found.name);
    else u("student", "");
  };

  const submit = () => {
    if (!f.studentId || !f.date || !f.diagnosis) { setErr("Student, date, and diagnosis are required."); return; }
    onAdd(f);
    setF(emptyRec);
    setErr("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setF(emptyRec); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg" style={{ fontFamily: FONT }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: RED, fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>
            <ClipboardList size={18} style={{ color: RED }} /> Add Health Record
          </DialogTitle>
        </DialogHeader>
        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Student *</Label>
            <Select value={f.studentId} onValueChange={handleStudentId}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue placeholder="Pick student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id} style={{ fontFamily: FONT }}>{s.id} — {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Date *</Label>
            <Input type="date" value={f.date} onChange={e => u("date", e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Visit Type</Label>
            <Select value={f.type} onValueChange={v => u("type", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["General Check-up","Dental","Sports Clearance","Medical Certificate"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Blood Pressure</Label>
            <Input value={f.bp} onChange={e => u("bp", e.target.value)} placeholder="e.g. 120/80" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Temperature</Label>
            <Input value={f.temp} onChange={e => u("temp", e.target.value)} placeholder="e.g. 36.5°C" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Weight</Label>
            <Input value={f.weight} onChange={e => u("weight", e.target.value)} placeholder="e.g. 55 kg" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Doctor</Label>
            <Select value={f.doctor} onValueChange={v => u("doctor", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Dr. Cruz","Dr. Vega","Dr. Lim"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Diagnosis *</Label>
            <Input value={f.diagnosis} onChange={e => u("diagnosis", e.target.value)} placeholder="e.g. Healthy, Mild fever…" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Remarks</Label>
            <Textarea value={f.remarks} onChange={e => u("remarks", e.target.value)} placeholder="Optional remarks…" className="border-rose-200 resize-none text-xs" rows={2} style={{ fontFamily: FONT }} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily: FONT }}>Cancel</Button></DialogClose>
          <Button onClick={submit} style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
            <Plus size={13} className="mr-1" /> Add Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Certificate Dialog ───────────────────────────────────────────────────────
const CertDialog = ({ trigger, onAdd, students }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyCert);
  const [err, setErr] = useState("");

  const u = (k, v) => setF(x => ({ ...x, [k]: v }));

  const handleStudentId = (val) => {
    u("studentId", val);
    const found = students.find(s => s.id === val);
    if (found) u("student", found.name);
    else u("student", "");
  };

  const submit = () => {
    if (!f.studentId) { setErr("Please select a student."); return; }
    const today = new Date();
    const issued = today.toISOString().split("T")[0];
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + parseInt(f.months));
    const validity = expiry.toISOString().split("T")[0];
    onAdd({ ...f, issued, validity, status: "Active" });
    setF(emptyCert);
    setErr("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setF(emptyCert); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg" style={{ fontFamily: FONT }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: RED, fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>
            <Award size={18} style={{ color: RED }} /> Issue Medical Certificate
          </DialogTitle>
        </DialogHeader>
        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Student *</Label>
            <Select value={f.studentId} onValueChange={handleStudentId}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue placeholder="Pick student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id} style={{ fontFamily: FONT }}>{s.id} — {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Certificate Type</Label>
            <Select value={f.type} onValueChange={v => u("type", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Player Clearance","School Certificate","Sports Clearance"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Sport / Purpose</Label>
            <Input value={f.sport} onChange={e => u("sport", e.target.value)} placeholder="Basketball, PE…" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Issuing Doctor</Label>
            <Select value={f.doctor} onValueChange={v => u("doctor", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Dr. Cruz","Dr. Vega","Dr. Lim"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Validity Period</Label>
            <Select value={f.months} onValueChange={v => u("months", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3" style={{ fontFamily: FONT }}>3 months</SelectItem>
                <SelectItem value="6" style={{ fontFamily: FONT }}>6 months</SelectItem>
                <SelectItem value="12" style={{ fontFamily: FONT }}>1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily: FONT }}>Cancel</Button></DialogClose>
          <Button onClick={submit} style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
            <FileText size={13} className="mr-1" /> Issue Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Student Dialog ───────────────────────────────────────────────────────────
const StudentDialog = ({ trigger, onAdd, existingIds }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyStu);
  const [err, setErr] = useState("");

  const u = (k, v) => setF(x => ({ ...x, [k]: v }));

  const submit = () => {
    if (!f.id || !f.name || !f.dob) { setErr("Student ID, name, and date of birth are required."); return; }
    if (existingIds.includes(f.id)) { setErr("Student ID already exists."); return; }
    onAdd(f);
    setF(emptyStu);
    setErr("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setF(emptyStu); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md" style={{ fontFamily: FONT }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: RED, fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>
            <Users size={18} style={{ color: RED }} /> Register Student
          </DialogTitle>
        </DialogHeader>
        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Student ID *</Label>
            <Input value={f.id} onChange={e => u("id", e.target.value)} placeholder="e.g. 2024-0009" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Full Name *</Label>
            <Input value={f.name} onChange={e => u("name", e.target.value)} placeholder="Full name" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Course</Label>
            <Select value={f.course} onValueChange={v => u("course", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["BSN","BSIT","BSEd","BSBA","BSME","BSCS","BSA","BSCE","BSEE","BSPSY"].map(c => <SelectItem key={c} value={c} style={{ fontFamily: FONT }}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Year Level</Label>
            <Select value={String(f.year)} onValueChange={v => u("year", parseInt(v))}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1","2","3","4"].map(y => <SelectItem key={y} value={y} style={{ fontFamily: FONT }}>Year {y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Gender</Label>
            <Select value={f.gender} onValueChange={v => u("gender", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M" style={{ fontFamily: FONT }}>Male</SelectItem>
                <SelectItem value="F" style={{ fontFamily: FONT }}>Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Date of Birth *</Label>
            <Input type="date" value={f.dob} onChange={e => u("dob", e.target.value)} className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily: FONT }}>Cancel</Button></DialogClose>
          <Button onClick={submit} style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
            <Plus size={13} className="mr-1" /> Register Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Schedule Slot Dialog ─────────────────────────────────────────────────────
const SlotDialog = ({ trigger, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptySlot);
  const [err, setErr] = useState("");
  const u = (k, v) => setF(x => ({ ...x, [k]: v }));

  const submit = () => {
    if (!f.doctor || !f.time || !f.service) { setErr("Doctor, time, and service are required."); return; }
    onAdd(f);
    setF(emptySlot);
    setErr("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setF(emptySlot); setErr(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md" style={{ fontFamily: FONT }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: RED, fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>
            <CalendarClock size={18} style={{ color: RED }} /> Add Schedule Slot
          </DialogTitle>
        </DialogHeader>
        {err && <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Day</Label>
            <Select value={f.day} onValueChange={v => u("day", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => <SelectItem key={d} value={d} style={{ fontFamily: FONT }}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Doctor *</Label>
            <Select value={f.doctor} onValueChange={v => u("doctor", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Dr. Cruz","Dr. Vega","Dr. Lim"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Time *</Label>
            <Input value={f.time} onChange={e => u("time", e.target.value)} placeholder="e.g. 08:00–12:00" className="border-rose-200 text-xs" style={{ fontFamily: FONT }} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-extrabold uppercase tracking-wide text-gray-500" style={{ fontFamily: FONT }}>Service *</Label>
            <Select value={f.service} onValueChange={v => u("service", v)}>
              <SelectTrigger className="border-rose-200 text-xs" style={{ fontFamily: FONT }}><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>
                {["General Check-up","Dental","Medical Certificates","Sports Clearance"].map(t => <SelectItem key={t} value={t} style={{ fontFamily: FONT }}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" style={{ fontFamily: FONT }}>Cancel</Button></DialogClose>
          <Button onClick={submit} style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
            <Plus size={13} className="mr-1" /> Add Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ msg, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-xl px-4 py-3 text-sm font-bold text-green-700"
    style={{ fontFamily: FONT, animation: "fadeIn .2s ease" }}>
    <CheckCircle size={16} className="text-green-500" />
    {msg}
    <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ClinicDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState("dashboard");
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState("");

  // ─ State for all data ─
  const [students,     setStudents]     = useState(INIT_STUDENTS);
  const [appointments, setAppointments] = useState(INIT_APPOINTMENTS);
  const [records,      setRecords]      = useState(INIT_RECORDS);
  const [certificates, setCertificates] = useState(INIT_CERTIFICATES);
  const [schedule,     setSchedule]     = useState(INIT_SCHEDULE);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ─ Add handlers ─
  const addAppointment = (f) => {
    const newApt = { ...f, id: genId("APT", appointments) };
    setAppointments(prev => [newApt, ...prev]);
    showToast("Appointment booked successfully!");
  };

  const addRecord = (f) => {
    const newRec = { ...f, id: genId("REC", records) };
    setRecords(prev => [newRec, ...prev]);
    showToast("Health record added successfully!");
  };

  const addCertificate = (f) => {
    const newCert = { ...f, id: genId("CERT", certificates) };
    setCertificates(prev => [newCert, ...prev]);
    showToast("Certificate issued successfully!");
  };

  const addStudent = (f) => {
    setStudents(prev => [...prev, { ...f, year: parseInt(f.year) }]);
    showToast("Student registered successfully!");
  };

  const addSlot = (f) => {
    setSchedule(prev => prev.map(d =>
      d.day === f.day
        ? { ...d, slots: [...d.slots, { time: f.time, doctor: f.doctor, service: f.service }] }
        : d
    ));
    showToast("Schedule slot added!");
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "Cancelled" } : a));
  };

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast("Record deleted.");
  };

  // ─ Filtered lists ─
  const filtApts = appointments.filter(a =>
    (filter === "All" || a.status === filter) &&
    (a.student.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()))
  );
  const filtRecs = records.filter(r =>
    r.student.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
  );
  const filtStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)
  );

  const serviceData = [
    { name:"General Check-up", value: appointments.filter(a=>a.type==="Check-up").length + 280,   fill: RED   },
    { name:"Dental",           value: appointments.filter(a=>a.type==="Dental").length + 175,      fill: PINK  },
    { name:"Medical Cert",     value: certificates.length + 94,                                    fill: ROSE  },
    { name:"Sports Clearance", value: appointments.filter(a=>a.service==="Sports").length + 50,    fill: "#f97316" },
  ];
  const svcTotal = serviceData.reduce((a, x) => a + x.value, 0);

  const NAV = [
    { key:"dashboard",    label:"Dashboard",     Icon:LayoutDashboard },
    { key:"appointments", label:"Appointments",  Icon:CalendarDays    },

  ];

  const goTo = (k) => { setTab(k); setSearch(""); setFilter("All"); };
  const activeLabel = NAV.find(n => n.key === tab)?.label;

  return (
    <TooltipProvider>
      <div className="flex min-h-screen" style={{ fontFamily: FONT, background: BG }}>

        {/* ── SIDEBAR ── */}
        <aside className="w-56 flex flex-col shrink-0 py-5 px-3"
          style={{ background: `linear-gradient(170deg,${RED} 0%,${RED_DARK} 100%)`, boxShadow: "4px 0 24px rgba(220,38,38,.18)" }}>

          <div className="flex items-center gap-2.5 px-2 pb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,.18)" }}>
              <HeartPulse size={19} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>HealthPoint</p>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,.6)", letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT }}>Clinic System</p>
            </div>
          </div>

          <p className="text-xs font-extrabold mb-2 px-2" style={{ color: "rgba(255,255,255,.4)", letterSpacing: 1.6, textTransform: "uppercase", fontFamily: FONT }}>Menu</p>

          <nav className="flex-1 space-y-0.5">
            {NAV.map(({ key, label, Icon }) => {
              const act = tab === key;
              return (
                <button key={key} onClick={() => goTo(key)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all"
                  style={{ background: act ? "rgba(255,255,255,.18)" : "transparent", color: act ? "#fff" : "rgba(255,255,255,.65)", fontWeight: act ? 800 : 500, fontFamily: FONT }}>
                  <Icon size={14} />
                  <span className="flex-1 text-left">{label}</span>
                  {act && <ChevronRight size={12} />}
                </button>
              );
            })}
          </nav>

          <Separator className="my-3 opacity-20" />
          <div className="space-y-0.5">
            {[ { Icon: LogOut, label: "Logout" }].map(({ Icon, label }) => (
              <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all"
                onClick={() => navigate('/login')}
                style={{ color: "rgba(255,255,255,.55)", background: "transparent", fontFamily: FONT }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5 px-2 pt-3">
            <Avatar className="w-8 h-8 rounded-lg">
              <AvatarFallback className="rounded-lg text-xs font-extrabold" style={{ background: "rgba(255,255,255,.2)", color: "#fff", fontFamily: FONT }}>DA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-extrabold text-white" style={{ fontFamily: FONT }}>Dr. Admin</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,.5)", fontFamily: FONT }}>Head Physician</p>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col">

          {/* Topbar */}
          <header className="bg-white sticky top-0 z-10 flex items-center justify-between px-7 py-3.5"
            style={{ borderBottom: `1.5px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(220,38,38,.05)" }}>
            <div>
              <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: RED, lineHeight: 1, letterSpacing: "-0.03em" }}>{activeLabel}</h1>
              <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: FONT }}>College Health Services · {new Date().toDateString()}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="outline" size="icon" className="border-rose-200 text-rose-400 hover:bg-rose-50">
                <Bell size={15} />
              </Button>
              <AppointmentDialog students={students} onAdd={addAppointment} trigger={
                <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                  <Plus size={13} /> New Appointment
                </Button>
              } />
              <CertDialog students={students} onAdd={addCertificate} trigger={
                <Button size="sm" variant="outline" className="gap-1.5 text-xs font-extrabold border-red-300 text-red-600 hover:bg-rose-50" style={{ fontFamily: FONT }}>
                  <FileText size={13} /> Issue Certificate
                </Button>
              } />
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="p-7 space-y-5">

              {/* ── DASHBOARD ── */}
              {tab === "dashboard" && (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <KpiCard label="Total Students"       value={students.length.toLocaleString()} sub="+12 this month"  Icon={Users}        accent={RED}      />
                    <KpiCard label="Today's Appointments" value={appointments.filter(a=>a.date==="2026-03-02").length} sub="Scheduled today"  Icon={CalendarDays} accent={PINK}    />
                    <KpiCard label="Certificates Issued"  value={certificates.length}               sub="All time"        Icon={Award}          accent="#f97316"  />
                    <KpiCard label="Health Records"       value={records.length}                    sub="In the system"   Icon={ClipboardList}  accent="#8b5cf6"  />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                 

                  
                  </div>

                  <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid ${ROSE}` }}>
                    <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 14, fontWeight: 800 }}>Recent Appointments</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>Latest {Math.min(appointments.length, 6)} entries</CardDescription>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => goTo("appointments")} className="text-red-500 hover:bg-rose-50 text-xs font-bold gap-1" style={{ fontFamily: FONT }}>
                        View all <ChevronRight size={12} />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader><TableRow>{["Time","Student","Type","Service","Doctor","Status"].map(h => <TH key={h}>{h}</TH>)}</TableRow></TableHeader>
                        <TableBody>
                          {appointments.slice(0, 6).map((a, i) => (
                            <TableRow key={a.id} className="hover:bg-rose-50/40">
                              <TableCell><Badge variant="outline" className="font-mono text-xs border-rose-200 text-red-500 bg-rose-50" style={{ fontFamily: FONT }}>{a.time}</Badge></TableCell>
                              <TableCell><div className="font-bold text-xs text-gray-900" style={{ fontFamily: FONT }}>{a.student}</div><div className="text-xs text-gray-400" style={{ fontFamily: FONT }}>{a.studentId}</div></TableCell>
                              <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.type}</TableCell>
                              <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.service}</TableCell>
                              <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.doctor}</TableCell>
                              <TableCell><StatusBadge status={a.status} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* ── APPOINTMENTS ── */}
              {tab === "appointments" && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 16, fontWeight: 800 }}>All Appointments</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>{appointments.length} total records</CardDescription>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Tabs value={filter} onValueChange={setFilter}>
                          <TabsList className="bg-rose-50 h-8">
                            {["All","Confirmed","Pending","Completed","Cancelled"].map(f => (
                              <TabsTrigger key={f} value={f} className="text-xs font-bold h-7 data-[state=active]:bg-red-600 data-[state=active]:text-white" style={{ fontFamily: FONT }}>{f}</TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                        <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or type…" />
                        <AppointmentDialog students={students} onAdd={addAppointment} trigger={
                          <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                            <Plus size={13} /> Add
                          </Button>
                        } />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow>{["ID","Date","Time","Student","Type","Service","Doctor","Status","Action"].map(h => <TH key={h}>{h}</TH>)}</TableRow></TableHeader>
                      <TableBody>
                        {filtApts.length === 0 && (
                          <TableRow><TableCell colSpan={9} className="text-center text-xs text-gray-400 py-10" style={{ fontFamily: FONT }}>No appointments found.</TableCell></TableRow>
                        )}
                        {filtApts.map(a => (
                          <TableRow key={a.id} className="hover:bg-rose-50/40">
                            <TableCell className="font-mono text-xs text-gray-400" style={{ fontFamily: FONT }}>{a.id}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.date}</TableCell>
                            <TableCell><Badge variant="outline" className="font-mono text-xs border-rose-200 text-red-500 bg-rose-50" style={{ fontFamily: FONT }}>{a.time}</Badge></TableCell>
                            <TableCell><div className="font-bold text-xs" style={{ fontFamily: FONT }}>{a.student}</div><div className="text-xs text-gray-400" style={{ fontFamily: FONT }}>{a.studentId}</div></TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.type}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.service}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{a.doctor}</TableCell>
                            <TableCell><StatusBadge status={a.status} /></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {a.status !== "Cancelled" && a.status !== "Completed" && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-rose-50" onClick={() => cancelAppointment(a.id)}>
                                        <Trash2 size={12} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent style={{ fontFamily: FONT }}>Cancel</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* ── RECORDS ── */}
              {tab === "records" && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 16, fontWeight: 800 }}>Student Health Records</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>{records.length} total records</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
                        <RecordDialog students={students} onAdd={addRecord} trigger={
                          <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                            <Plus size={13} /> Add Record
                          </Button>
                        } />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow>{["Record ID","Date","Student","Visit Type","BP","Temp","Weight","Diagnosis","Remarks","Doctor","Action"].map(h => <TH key={h}>{h}</TH>)}</TableRow></TableHeader>
                      <TableBody>
                        {filtRecs.length === 0 && (
                          <TableRow><TableCell colSpan={11} className="text-center text-xs text-gray-400 py-10" style={{ fontFamily: FONT }}>No records found.</TableCell></TableRow>
                        )}
                        {filtRecs.map(r => (
                          <TableRow key={r.id} className="hover:bg-rose-50/40">
                            <TableCell className="font-mono text-xs text-gray-400" style={{ fontFamily: FONT }}>{r.id}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{r.date}</TableCell>
                            <TableCell><div className="font-bold text-xs" style={{ fontFamily: FONT }}>{r.student}</div><div className="text-xs text-gray-400" style={{ fontFamily: FONT }}>{r.studentId}</div></TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{r.type}</TableCell>
                            <TableCell><span className="font-mono font-bold text-red-500 text-xs">{r.bp}</span></TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{r.temp}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{r.weight}</TableCell>
                            <TableCell className="font-bold text-xs text-gray-800" style={{ fontFamily: FONT }}>{r.diagnosis}</TableCell>
                            <TableCell className="text-xs text-gray-400 max-w-32" style={{ fontFamily: FONT }}>{r.remarks}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{r.doctor}</TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-rose-50" onClick={() => deleteRecord(r.id)}>
                                    <Trash2 size={12} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent style={{ fontFamily: FONT }}>Delete</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* ── CERTIFICATES ── */}
              {tab === "certificates" && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 16, fontWeight: 800 }}>Medical Certificates Issued</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>{certificates.length} certificates on file</CardDescription>
                      </div>
                      <CertDialog students={students} onAdd={addCertificate} trigger={
                        <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                          <Plus size={13} /> Issue New
                        </Button>
                      } />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow>{["Cert ID","Student","Student ID","Type","Sport / Purpose","Issued","Valid Until","Doctor","Status"].map(h => <TH key={h}>{h}</TH>)}</TableRow></TableHeader>
                      <TableBody>
                        {certificates.length === 0 && (
                          <TableRow><TableCell colSpan={9} className="text-center text-xs text-gray-400 py-10" style={{ fontFamily: FONT }}>No certificates yet.</TableCell></TableRow>
                        )}
                        {certificates.map(c => (
                          <TableRow key={c.id} className="hover:bg-rose-50/40">
                            <TableCell className="font-mono text-xs text-gray-400" style={{ fontFamily: FONT }}>{c.id}</TableCell>
                            <TableCell className="font-bold text-xs" style={{ fontFamily: FONT }}>{c.student}</TableCell>
                            <TableCell className="font-mono text-xs text-gray-400" style={{ fontFamily: FONT }}>{c.studentId}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{c.type}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{c.sport || "—"}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{c.issued}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{c.validity}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{c.doctor}</TableCell>
                            <TableCell><StatusBadge status={c.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* ── SCHEDULE ── */}
              {tab === "schedule" && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h2 className="font-extrabold text-sm" style={{ color: RED, fontFamily: FONT }}>Weekly Clinic Schedule</h2>
                      <p className="text-xs text-gray-400" style={{ fontFamily: FONT }}>Doctor availability and service assignments</p>
                    </div>
                    <SlotDialog onAdd={addSlot} trigger={
                      <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                        <Plus size={13} /> Add Slot
                      </Button>
                    } />
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {schedule.map(day => (
                      <Card key={day.day} className="border-0 shadow-sm" style={{ borderTop: `3px solid ${RED}` }}>
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 13, fontWeight: 800 }}>{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-2">
                          {day.slots.length === 0 && <p className="text-xs text-gray-400 italic" style={{ fontFamily: FONT }}>No slots yet</p>}
                          {day.slots.map((sl, i) => (
                            <div key={i} className="rounded-lg p-2.5" style={{ background: i % 2 === 0 ? RED_LIGHT : PINK_LT, borderLeft: `3px solid ${i % 2 === 0 ? RED : PINK}` }}>
                              <p className="text-xs font-extrabold tracking-wide" style={{ color: i % 2 === 0 ? RED : PINK, fontFamily: FONT }}>{sl.time}</p>
                              <p className="text-xs font-bold text-gray-800 mt-0.5" style={{ fontFamily: FONT }}>{sl.doctor}</p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: FONT }}>{sl.service}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* ── STUDENTS ── */}
              {tab === "students" && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 16, fontWeight: 800 }}>Registered Students</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>{students.length} enrolled students</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" />
                        <StudentDialog existingIds={students.map(s => s.id)} onAdd={addStudent} trigger={
                          <Button size="sm" className="gap-1.5 text-xs font-extrabold" style={{ background: `linear-gradient(135deg,${RED},${PINK})`, fontFamily: FONT }}>
                            <Plus size={13} /> Register
                          </Button>
                        } />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow>{["Student ID","Name","Course","Year","Gender","Date of Birth","Appointments","Records","Action"].map(h => <TH key={h}>{h}</TH>)}</TableRow></TableHeader>
                      <TableBody>
                        {filtStudents.length === 0 && (
                          <TableRow><TableCell colSpan={9} className="text-center text-xs text-gray-400 py-10" style={{ fontFamily: FONT }}>No students found.</TableCell></TableRow>
                        )}
                        {filtStudents.map(s => (
                          <TableRow key={s.id} className="hover:bg-rose-50/40">
                            <TableCell><span className="font-mono font-extrabold text-red-500 text-xs">{s.id}</span></TableCell>
                            <TableCell className="font-bold text-xs" style={{ fontFamily: FONT }}>{s.name}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{s.course}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{s.year}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{s.gender === "M" ? "Male" : "Female"}</TableCell>
                            <TableCell className="text-xs" style={{ fontFamily: FONT }}>{s.dob}</TableCell>
                            <TableCell><Badge variant="outline" className="border-rose-200 text-red-500 bg-rose-50 font-bold text-xs" style={{ fontFamily: FONT }}>{appointments.filter(a => a.studentId === s.id).length}</Badge></TableCell>
                            <TableCell><Badge variant="outline" className="border-pink-200 text-pink-500 bg-pink-50 font-bold text-xs" style={{ fontFamily: FONT }}>{records.filter(r => r.studentId === s.id).length}</Badge></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50"><BookOpen size={12} /></Button>
                                  </TooltipTrigger>
                                  <TooltipContent style={{ fontFamily: FONT }}>View Profile</TooltipContent>
                                </Tooltip>
                                <RecordDialog students={students} onAdd={addRecord} trigger={
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-rose-50"><ClipboardList size={12} /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent style={{ fontFamily: FONT }}>Add Record</TooltipContent>
                                  </Tooltip>
                                } />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* ── ANALYTICS ── */}
              {tab === "analytics" && (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <KpiCard label="Total Visits"          value={appointments.length + 620} sub="All services"     Icon={Activity}    accent={RED}      />
                    <KpiCard label="General Check-ups"     value={appointments.filter(a=>a.type==="Check-up").length + 290}  sub="Visits this year"  Icon={Stethoscope} accent={PINK}     />
                    <KpiCard label="Dental Consultations"  value={appointments.filter(a=>a.type==="Dental").length + 175}    sub="Visits this year"  Icon={Smile}       accent="#f97316"  />
                    <KpiCard label="Certificates Issued"   value={certificates.length + 140}  sub="All time"        Icon={Award}       accent="#8b5cf6"  />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid ${RED}` }}>
                      <CardHeader className="pb-2">
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 14, fontWeight: 800 }}>Visits by Month</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>Stacked by service type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={monthlyData} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#fde8e8" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <RTooltip content={<ChartTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 10, fontFamily: FONT }} />
                            <Bar dataKey="checkup" name="Check-up" stackId="a" fill={RED}  radius={[0,0,0,0]} />
                            <Bar dataKey="dental"  name="Dental"   stackId="a" fill={PINK} radius={[0,0,0,0]} />
                            <Bar dataKey="cert"    name="Cert"     stackId="a" fill={ROSE} radius={[4,4,0,0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid ${PINK}` }}>
                      <CardHeader className="pb-2">
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 14, fontWeight: 800 }}>Weekly Patient Flow</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>Morning vs afternoon sessions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#fde8e8" />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <RTooltip content={<ChartTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 10, fontFamily: FONT }} />
                            <Line type="monotone" dataKey="morning"   name="Morning"   stroke={RED}  strokeWidth={2.5} dot={{ r: 4, fill: RED  }} />
                            <Line type="monotone" dataKey="afternoon" name="Afternoon" stroke={PINK} strokeWidth={2.5} dot={{ r: 4, fill: PINK }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid ${ROSE}` }}>
                      <CardHeader className="pb-2">
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 14, fontWeight: 800 }}>Top Diagnosed Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={conditionData} layout="vertical" barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#fde8e8" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 10, fill: "#6b7280", fontFamily: FONT }} axisLine={false} tickLine={false} />
                            <RTooltip content={<ChartTooltip />} />
                            <Bar dataKey="count" name="Patients" radius={[0,4,4,0]}>
                              {conditionData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm" style={{ borderTop: `3px solid #f97316` }}>
                      <CardHeader className="pb-2">
                        <CardTitle style={{ fontFamily: FONT, color: RED, fontSize: 14, fontWeight: 800 }}>Service Distribution</CardTitle>
                        <CardDescription style={{ fontFamily: FONT, fontSize: 11 }}>Volume by category</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-2">
                        {serviceData.map(d => (
                          <div key={d.name} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.fill }} />
                                <span className="text-xs font-semibold text-gray-700" style={{ fontFamily: FONT }}>{d.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-gray-900" style={{ fontFamily: FONT }}>{d.value}</span>
                                <span className="text-xs text-gray-400" style={{ fontFamily: FONT }}>{Math.round(d.value / svcTotal * 100)}%</span>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "#fde8e8" }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(d.value / svcTotal * 100)}%`, background: d.fill }} />
                            </div>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          {[
                            { label: "Avg Wait Time",  value: "12 min",  Icon: Clock       },
                            { label: "Patient Sat.",   value: "94%",     Icon: Activity    },
                            { label: "Return Visits",  value: "38%",     Icon: TrendingUp  },
                            { label: "Active Doctors", value: "3",       Icon: Stethoscope },
                          ].map(k => (
                            <div key={k.label} className="flex items-center gap-2 rounded-lg p-2" style={{ background: RED_LIGHT }}>
                              <k.Icon size={13} style={{ color: RED }} />
                              <div>
                                <p className="text-xs font-extrabold text-gray-800" style={{ fontFamily: FONT }}>{k.value}</p>
                                <p className="text-xs text-gray-400" style={{ fontFamily: FONT }}>{k.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

            </div>
          </ScrollArea>
        </main>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </TooltipProvider>
  );
}