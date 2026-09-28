// STAGE 3: LOCAL MOCK API (works offline, never rate-limited).
// Every function returns a Promise after a delay, like a real HTTP call, and
// supports AbortSignal so we can cancel in-flight requests.
//
// To use a real API later, keep these function names and replace the bodies
// with fetch(`${import.meta.env.VITE_API_URL}/employees`, { signal }).
//
// Data persists in localStorage so CRUD survives a refresh.
// Debug trick: run localStorage.setItem("simulate-error","1") in the console
// to see the error state; localStorage.removeItem("simulate-error") to stop.

const KEY = "employees-db";
const LATENCY = Number(import.meta.env.VITE_API_LATENCY_MS) || 500;

const seed = [
  { id: 1, name: "Aarav Sharma", role: "Frontend Engineer", department: "Engineering", email: "aarav@company.com", isActive: true, employmentType: "full-time", skills: ["React", "CSS"] },
  { id: 2, name: "Priya Nair", role: "Product Manager", department: "Product", email: "priya@company.com", isActive: true, employmentType: "full-time", skills: ["Roadmaps"] },
  { id: 3, name: "Rohan Mehta", role: "Backend Engineer", department: "Engineering", email: "rohan@company.com", isActive: false, employmentType: "contract", skills: ["Node", "SQL"] },
  { id: 4, name: "Sneha Iyer", role: "UX Designer", department: "Design", email: "sneha@company.com", isActive: true, employmentType: "full-time", skills: ["Figma"] },
  { id: 5, name: "Vikram Singh", role: "QA Engineer", department: "Quality", email: "vikram@company.com", isActive: false, employmentType: "contract", skills: ["Cypress"] },
  { id: 6, name: "Ananya Das", role: "HR Manager", department: "People", email: "ananya@company.com", isActive: true, employmentType: "full-time", skills: [] },
  { id: 7, name: "Karan Joshi", role: "DevOps Engineer", department: "Engineering", email: "karan@company.com", isActive: true, employmentType: "full-time", skills: ["Docker", "AWS"] },
  { id: 8, name: "Meera Reddy", role: "Data Analyst", department: "Product", email: "meera@company.com", isActive: true, employmentType: "contract", skills: ["SQL", "Python"] },
  { id: 9, name: "Tara Kapoor", role: "Designer", department: "Design", email: "tara@company.com", isActive: false, employmentType: "full-time", skills: [] },
];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted storage: fall back to seed */ }
  return seed;
}

let db = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));

// Resolves after `ms`, rejects with AbortError if the signal aborts first.
function delay(signal, ms = LATENCY) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

async function maybeFail() {
  if (localStorage.getItem("simulate-error")) throw new Error("Simulated server error (500)");
}

export async function getEmployees({ signal } = {}) {
  await delay(signal);
  await maybeFail();
  return [...db];
}

export async function getEmployee(id, { signal } = {}) {
  await delay(signal, 300);
  await maybeFail();
  const found = db.find((e) => e.id === Number(id));
  if (!found) throw new Error("Employee not found");
  return { ...found };
}

export async function createEmployee(data) {
  await delay(undefined, 400);
  await maybeFail();
  const created = { ...data, id: Date.now() }; // server would assign the id
  db = [created, ...db];
  save();
  return created;
}

// The server flips the flag itself, so the client doesn't need to know the current value.
export async function toggleEmployee(id) {
  await delay(undefined, 400);
  await maybeFail();
  db = db.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e));
  save();
}

export async function deleteEmployee(id) {
  await delay(undefined, 400);
  await maybeFail();
  db = db.filter((e) => e.id !== id);
  save();
}
