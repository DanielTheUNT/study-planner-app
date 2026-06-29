import React, { useState, useEffect, useRef } from "react";

// ============================================================
// Study Planner App — Week 6 Interactive Demo
// Single-file React mockup for screen-recording the demo.
// Flows: Login -> Dashboard -> Add Assignment -> Calendar -> Focus Timer
// ============================================================

const GREEN = "#1A6E44";
const GREEN_DK = "#125234";
const GREEN_LT = "#E8F3EC";
const INK = "#1F2A24";
const MUTED = "#6B7C72";
const BG = "#F4F7F5";
const AMBER = "#E8A317";
const RED = "#C0392B";

const seedAssignments = [
  { id: 1, title: "CSCE 3444 — SRS Final Draft", course: "Software Eng", due: "2026-07-02", priority: "High", done: false },
  { id: 2, title: "Statistics — Homework 7 (CLT)", course: "Statistics", due: "2026-07-03", priority: "Medium", done: false },
  { id: 3, title: "Linear Algebra — Quiz 5", course: "Linear Algebra", due: "2026-07-05", priority: "High", done: false },
  { id: 4, title: "Read Chapter 9", course: "Software Eng", due: "2026-06-30", priority: "Low", done: true },
];

const priorityColor = (p) => (p === "High" ? RED : p === "Medium" ? AMBER : GREEN);

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function daysUntil(iso) {
  const today = new Date("2026-06-28T00:00:00");
  const d = new Date(iso + "T00:00:00");
  return Math.round((d - today) / 86400000);
}

export default function StudyPlannerDemo() {
  const [screen, setScreen] = useState("login"); // login | app
  const [tab, setTab] = useState("home"); // home | calendar | add | focus
  const [assignments, setAssignments] = useState(seedAssignments);
  const [name, setName] = useState("");

  function login() {
    setName("Daniel");
    setScreen("app");
    setTab("home");
  }

  function addAssignment(a) {
    setAssignments((prev) => [...prev, { ...a, id: Date.now(), done: false }]);
    setTab("home");
  }
  function toggleDone(id) {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 24 }}>
      <PhoneFrame>
        {screen === "login" ? (
          <LoginScreen onLogin={login} />
        ) : (
          <AppShell tab={tab} setTab={setTab} name={name}>
            {tab === "home" && <Dashboard assignments={assignments} toggleDone={toggleDone} name={name} setTab={setTab} />}
            {tab === "calendar" && <CalendarView assignments={assignments} />}
            {tab === "add" && <AddAssignment onAdd={addAssignment} onCancel={() => setTab("home")} />}
            {tab === "focus" && <FocusTimer />}
          </AppShell>
        )}
      </PhoneFrame>
    </div>
  );
}

// ---------------- Phone Frame ----------------
function PhoneFrame({ children }) {
  return (
    <div style={{ width: 390, height: 800, background: "#fff", borderRadius: 44, boxShadow: "0 30px 80px rgba(18,82,52,0.25), 0 0 0 12px #0c1a12", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* notch */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 150, height: 26, background: "#0c1a12", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 50 }} />
      {children}
    </div>
  );
}

// ---------------- Login ----------------
function LoginScreen({ onLogin }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "70px 28px 28px", background: "#fff" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 10px 24px rgba(26,110,68,0.35)" }}>
          <span style={{ color: "#fff", fontSize: 34, fontWeight: 800 }}>S</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>Study Planner</div>
        <div style={{ fontSize: 14, color: MUTED, marginBottom: 30 }}>Your personal academic assistant</div>

        <Field label="UNT Email" placeholder="daniel@my.unt.edu" />
        <Field label="Password" placeholder="••••••••" type="password" />

        <button onClick={onLogin} style={primaryBtn}>Sign In</button>
        <div style={{ fontSize: 13, color: GREEN, marginTop: 16, fontWeight: 600 }}>New student?  Create account</div>
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: MUTED }}>CSCE 3444 · Week 6 Prototype</div>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }) {
  return (
    <div style={{ width: "100%", marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{label}</div>
      <input defaultValue={placeholder} type={type} style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #DCE6E0", fontSize: 15, color: INK, background: "#FBFDFC", outlineColor: GREEN }} />
    </div>
  );
}

// ---------------- App Shell + Tab Bar ----------------
function AppShell({ tab, setTab, children }) {
  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", background: BG }}>{children}</div>
      <TabBar tab={tab} setTab={setTab} />
    </>
  );
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "calendar", label: "Calendar", icon: "▦" },
    { id: "add", label: "Add", icon: "+" },
    { id: "focus", label: "Focus", icon: "◷" },
  ];
  return (
    <div style={{ display: "flex", borderTop: "1px solid #E2EAE5", background: "#fff", paddingBottom: 18, paddingTop: 8 }}>
      {tabs.map((t) => {
        const active = tab === t.id;
        const isAdd = t.id === "add";
        if (isAdd) {
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 3 }}>
              <div style={{ width: 46, height: 46, borderRadius: 16, background: GREEN, color: "#fff", fontSize: 28, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -22, boxShadow: "0 8px 20px rgba(26,110,68,0.4)" }}>+</div>
            </button>
          );
        }
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 3, color: active ? GREEN : MUTED }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Dashboard ----------------
function Dashboard({ assignments, toggleDone, name, setTab }) {
  const pending = assignments.filter((a) => !a.done);
  const nextUp = [...pending].sort((a, b) => daysUntil(a.due) - daysUntil(b.due))[0];
  const doneCount = assignments.filter((a) => a.done).length;

  return (
    <div>
      {/* header */}
      <div style={{ background: GREEN, padding: "60px 22px 26px", borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}>
        <div style={{ color: "#CDE7D8", fontSize: 13 }}>Good afternoon,</div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>{name} 👋</div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Stat big={pending.length} label="Due soon" />
          <Stat big={doneCount} label="Completed" />
          <Stat big={"3"} label="Courses" />
        </div>
      </div>

      {/* AI coach card */}
      <div style={{ margin: "16px 18px 0", background: "#fff", borderRadius: 18, padding: 16, border: `1px solid ${GREEN_LT}`, boxShadow: "0 6px 16px rgba(18,82,52,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: GREEN_LT, color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>✦</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>AI Study Coach</div>
        </div>
        <div style={{ fontSize: 14, color: INK, lineHeight: 1.4 }}>
          {nextUp ? (
            <>Your <b>{nextUp.title.split("—")[0].trim()}</b> is due in <b>{daysUntil(nextUp.due)} days</b>. Block a 2-hour study session tomorrow to stay ahead.</>
          ) : (
            <>You're all caught up. Nice work — add your next assignment to keep momentum.</>
          )}
        </div>
      </div>

      {/* upcoming list */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 18px 10px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Upcoming</div>
        <div onClick={() => setTab("calendar")} style={{ fontSize: 13, color: GREEN, fontWeight: 600, cursor: "pointer" }}>Calendar →</div>
      </div>

      <div style={{ padding: "0 18px 24px" }}>
        {pending.length === 0 && (
          <div style={{ textAlign: "center", color: MUTED, fontSize: 14, padding: 30 }}>Nothing due. Tap + to add an assignment.</div>
        )}
        {[...pending].sort((a, b) => daysUntil(a.due) - daysUntil(b.due)).map((a) => (
          <AssignmentRow key={a.id} a={a} onToggle={() => toggleDone(a.id)} />
        ))}
      </div>
    </div>
  );
}

function Stat({ big, label }) {
  return (
    <div style={{ flex: 1, background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
      <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{big}</div>
      <div style={{ color: "#CDE7D8", fontSize: 11 }}>{label}</div>
    </div>
  );
}

function AssignmentRow({ a, onToggle }) {
  const d = daysUntil(a.due);
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, border: "1px solid #EAF1ED" }}>
      <button onClick={onToggle} style={{ width: 24, height: 24, borderRadius: 8, border: `2px solid ${a.done ? GREEN : "#CBD8D1"}`, background: a.done ? GREEN : "#fff", cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.done ? "✓" : ""}</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: a.done ? MUTED : INK, textDecoration: a.done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{a.course} · due {fmtDate(a.due)}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: priorityColor(a.priority), background: priorityColor(a.priority) + "1A", padding: "3px 8px", borderRadius: 8 }}>{a.priority}</span>
        <div style={{ fontSize: 11, color: d <= 2 ? RED : MUTED, marginTop: 4, fontWeight: 600 }}>{d <= 0 ? "Today" : `${d}d left`}</div>
      </div>
    </div>
  );
}

// ---------------- Calendar ----------------
function CalendarView({ assignments }) {
  // June 2026 starts on a Monday. Build a simple month grid.
  const month = "June 2026";
  const firstDayOffset = 1; // 0=Sun; June 1 2026 is Monday
  const daysInMonth = 30;
  const byDay = {};
  assignments.forEach((a) => {
    const day = parseInt(a.due.split("-")[2], 10);
    const m = a.due.split("-")[1];
    if (m === "06") (byDay[day] = byDay[day] || []).push(a);
  });
  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Calendar" subtitle={month} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, color: MUTED, fontWeight: 700, padding: 6 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            const has = d && byDay[d];
            const isToday = d === 28;
            return (
              <div key={i} style={{ aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isToday ? GREEN : has ? GREEN_LT : "transparent", color: isToday ? "#fff" : INK, fontSize: 13, fontWeight: isToday ? 800 : 500, position: "relative" }}>
                {d || ""}
                {has && <div style={{ width: 5, height: 5, borderRadius: "50%", background: isToday ? "#fff" : GREEN, marginTop: 2 }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: "20px 18px 8px", fontSize: 15, fontWeight: 800, color: INK }}>This week</div>
      <div style={{ padding: "0 18px" }}>
        {assignments.filter((a) => !a.done).sort((a, b) => daysUntil(a.due) - daysUntil(b.due)).map((a) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: 12, marginBottom: 8, border: "1px solid #EAF1ED" }}>
            <div style={{ width: 44, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase" }}>{fmtDate(a.due).split(" ")[0]}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{a.due.split("-")[2]}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{a.title}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{a.course}</div>
            </div>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: priorityColor(a.priority) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Add Assignment ----------------
function AddAssignment({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("Software Eng");
  const [due, setDue] = useState("2026-07-04");
  const [priority, setPriority] = useState("High");

  const courses = ["Software Eng", "Statistics", "Linear Algebra"];

  return (
    <div>
      <ScreenHeader title="Add Assignment" subtitle="Log it in seconds" />
      <div style={{ padding: "4px 22px 24px" }}>
        <label style={lbl}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CSCE 3444 — Demo prep" style={inp} />

        <label style={lbl}>Course</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {courses.map((c) => (
            <button key={c} onClick={() => setCourse(c)} style={{ padding: "9px 14px", borderRadius: 12, border: `1.5px solid ${course === c ? GREEN : "#DCE6E0"}`, background: course === c ? GREEN_LT : "#fff", color: course === c ? GREEN : INK, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{c}</button>
          ))}
        </div>

        <label style={lbl}>Due date</label>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={inp} />

        <label style={lbl}>Priority</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["High", "Medium", "Low"].map((p) => (
            <button key={p} onClick={() => setPriority(p)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${priority === p ? priorityColor(p) : "#DCE6E0"}`, background: priority === p ? priorityColor(p) + "14" : "#fff", color: priority === p ? priorityColor(p) : INK, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{p}</button>
          ))}
        </div>

        <button onClick={() => title.trim() && onAdd({ title, course, due, priority })} style={{ ...primaryBtn, opacity: title.trim() ? 1 : 0.5 }}>Save Assignment</button>
        <button onClick={onCancel} style={{ width: "100%", padding: "13px", borderRadius: 14, border: "none", background: "transparent", color: MUTED, fontSize: 14, fontWeight: 600, marginTop: 8, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ---------------- Focus Timer ----------------
function FocusTimer() {
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = 1 - secs / (25 * 60);
  const R = 110, C = 2 * Math.PI * R;

  return (
    <div>
      <ScreenHeader title="Focus Timer" subtitle="Pomodoro · 25 min" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r={R} fill="none" stroke="#E2EAE5" strokeWidth="16" />
          <circle cx="140" cy="140" r={R} fill="none" stroke={GREEN} strokeWidth="16" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 140 140)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          <text x="140" y="150" textAnchor="middle" fontSize="52" fontWeight="800" fill={INK}>{mm}:{ss}</text>
          <text x="140" y="185" textAnchor="middle" fontSize="14" fill={MUTED}>focus session</text>
        </svg>

        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
          <button onClick={() => setRunning((r) => !r)} style={{ ...primaryBtn, width: 150 }}>{running ? "Pause" : "Start"}</button>
          <button onClick={() => { setRunning(false); setSecs(25 * 60); }} style={{ width: 150, padding: "15px", borderRadius: 16, border: `1.5px solid #DCE6E0`, background: "#fff", color: INK, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Reset</button>
        </div>

        <div style={{ marginTop: 30, width: "100%", padding: "0 22px" }}>
          <div style={{ background: GREEN_LT, borderRadius: 16, padding: 16, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>3</div><div style={{ fontSize: 11, color: MUTED }}>Sessions today</div></div>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>1h 15m</div><div style={{ fontSize: 11, color: MUTED }}>Focused time</div></div>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>5</div><div style={{ fontSize: 11, color: MUTED }}>Day streak</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- shared bits ----------------
function ScreenHeader({ title, subtitle }) {
  return (
    <div style={{ padding: "58px 22px 18px", background: "#fff", borderBottom: "1px solid #EEF3F0" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{title}</div>
      <div style={{ fontSize: 13, color: MUTED }}>{subtitle}</div>
    </div>
  );
}

const primaryBtn = { width: "100%", padding: "15px", borderRadius: 16, border: "none", background: GREEN, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(26,110,68,0.3)" };
const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6, marginTop: 4 };
const inp = { width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #DCE6E0", fontSize: 15, color: INK, background: "#FBFDFC", marginBottom: 16, outlineColor: GREEN };
