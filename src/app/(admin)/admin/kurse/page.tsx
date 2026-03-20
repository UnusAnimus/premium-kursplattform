'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  studentsCount: number;
  rating: number;
  featured: boolean;
  _count?: { enrollments: number };
}

interface CourseDetailRow extends CourseRow {
  description: string;
  longDescription: string;
  instructorBio: string;
  originalPrice: number | null;
  tags: string[];
  certificate: boolean;
}

type FormState = {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  instructor: string;
  instructorBio: string;
  category: string;
  level: string;
  price: string;
  originalPrice: string;
  tags: string;
  certificate: boolean;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  instructor: '',
  instructorBio: '',
  category: '',
  level: 'Anfänger',
  price: '',
  originalPrice: '',
  tags: '',
  certificate: false,
  featured: false,
};

const LEVELS = ['Anfänger', 'Fortgeschritten', 'Experte'];
const CATEGORIES = ['Metaphysik', 'Heilung', 'Astrologie', 'Hermetik', 'Traumarbeit', 'Schamanismus'];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(p);
}

export default function AdminKursePage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json() as { courses: CourseRow[] };
        setCourses(data.courses);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCourses(); }, [loadCourses]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setShowModal(true);
  };

  const openEdit = async (course: CourseRow) => {
    setEditingId(course.id);
    setSaveError('');
    setShowModal(true);
    // Fetch full course details to populate all form fields
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`);
      if (res.ok) {
        const data = await res.json() as { course: CourseDetailRow };
        const c = data.course;
        setForm({
          title: c.title,
          slug: c.slug,
          description: c.description ?? '',
          longDescription: c.longDescription ?? '',
          instructor: c.instructor,
          instructorBio: c.instructorBio ?? '',
          category: c.category,
          level: c.level === 'Anfaenger' ? 'Anfänger' : c.level,
          price: String(c.price),
          originalPrice: c.originalPrice != null ? String(c.originalPrice) : '',
          tags: Array.isArray(c.tags) ? c.tags.join(', ') : '',
          certificate: c.certificate ?? false,
          featured: c.featured,
        });
      } else {
        // Fallback to partial data from list
        setForm({
          title: course.title,
          slug: course.slug,
          description: '',
          longDescription: '',
          instructor: course.instructor,
          instructorBio: '',
          category: course.category,
          level: course.level === 'Anfaenger' ? 'Anfänger' : course.level,
          price: String(course.price),
          originalPrice: '',
          tags: '',
          certificate: false,
          featured: course.featured,
        });
      }
    } catch {
      setForm({
        title: course.title,
        slug: course.slug,
        description: '',
        longDescription: '',
        instructor: course.instructor,
        instructorBio: '',
        category: course.category,
        level: course.level === 'Anfaenger' ? 'Anfänger' : course.level,
        price: String(course.price),
        originalPrice: '',
        tags: '',
        certificate: false,
        featured: course.featured,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      longDescription: form.longDescription || form.description,
      instructor: form.instructor,
      instructorBio: form.instructorBio,
      category: form.category,
      level: form.level,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      certificate: form.certificate,
      featured: form.featured,
    };

    try {
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        setSaveError(json.error ?? 'Speichern fehlgeschlagen.');
        return;
      }

      setShowModal(false);
      await loadCourses();
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch {
      /* ignore */
    }
    setDeleteId(null);
  };

  const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    if (field === 'title' && !editingId) {
      // Auto-generate slug only when creating new courses
      setForm(p => ({ ...p, title: e.target.value as string, slug: slugify(e.target.value as string) }));
    } else {
      setForm(p => ({ ...p, [field]: val }));
    }
  };

  const inputClass = 'w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-600';
  const labelClass = 'block text-slate-400 text-xs font-medium mb-1.5';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Kurse verwalten</h1>
          <p className="text-slate-400">
            {loading ? 'Wird geladen…' : `${courses.length} Kurs${courses.length !== 1 ? 'e' : ''}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
        >
          + Neuer Kurs
        </button>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Kurs', 'Kategorie', 'Niveau', 'Preis', 'Einschreibungen', 'Bewertung', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">Kurse werden geladen…</td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="text-4xl opacity-20 mb-3">◈</div>
                  <p className="text-slate-400 text-sm">Keine Kurse vorhanden. Erstelle deinen ersten Kurs.</p>
                </td>
              </tr>
            ) : courses.map(course => (
              <tr key={course.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{course.title}</p>
                    <p className="text-slate-500 text-xs">von {course.instructor}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-violet-500/10 text-violet-300 text-xs px-2.5 py-1 rounded-full">{course.category}</span>
                </td>
                <td className="p-4 text-slate-300 text-xs">
                  {course.level === 'Anfaenger' ? 'Anfänger' : course.level}
                </td>
                <td className="p-4 text-white font-medium">{formatPrice(course.price)}</td>
                <td className="p-4 text-slate-300">
                  {course._count?.enrollments ?? course.studentsCount}
                </td>
                <td className="p-4 text-amber-400">
                  {course.rating > 0 ? `★ ${course.rating}` : '—'}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/kurse/${course.slug}`} target="_blank" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ansehen</Link>
                    <Link href={`/admin/kurse/${course.id}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Module</Link>
                    <button onClick={() => void openEdit(course)} className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                    <button onClick={() => setDeleteId(course.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-2xl my-8">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Kurs bearbeiten' : 'Neuer Kurs erstellen'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {saveError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {saveError}
                </div>
              )}

              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Kurstitel *</label>
                  <input type="text" value={form.title} onChange={f('title')} required placeholder="z.B. Metaphysik & Bewusstsein" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>URL-Slug *</label>
                  <input type="text" value={form.slug} onChange={f('slug')} required placeholder="metaphysik-bewusstsein" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dozent *</label>
                  <input type="text" value={form.instructor} onChange={f('instructor')} required placeholder="Dr. Max Mustermann" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Kurzbeschreibung *</label>
                <textarea value={form.description} onChange={f('description')} required rows={2} placeholder="Kurze prägnante Beschreibung des Kurses" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Ausführliche Beschreibung</label>
                <textarea value={form.longDescription} onChange={f('longDescription')} rows={4} placeholder="Ausführliche Beschreibung, was Teilnehmer lernen werden…" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Dozenten-Bio</label>
                <textarea value={form.instructorBio} onChange={f('instructorBio')} rows={2} placeholder="Kurze Biografie des Dozenten" className={inputClass} />
              </div>

              {/* Category, Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Kategorie *</label>
                  <select value={form.category} onChange={f('category')} required className={inputClass}>
                    <option value="">Kategorie wählen</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Niveau *</label>
                  <select value={form.level} onChange={f('level')} className={inputClass}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preis (€) *</label>
                  <input type="number" value={form.price} onChange={f('price')} required min="0" step="0.01" placeholder="297.00" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Originalpreis (€) – optional</label>
                  <input type="number" value={form.originalPrice} onChange={f('originalPrice')} min="0" step="0.01" placeholder="497.00" className={inputClass} />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags (kommagetrennt)</label>
                <input type="text" value={form.tags} onChange={f('tags')} placeholder="Bewusstsein, Meditation, Philosophie" className={inputClass} />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.certificate} onChange={f('certificate')} className="accent-violet-600 w-4 h-4" />
                  Zertifikat eingeschlossen
                </label>
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={f('featured')} className="accent-violet-600 w-4 h-4" />
                  Featured / Empfohlen
                </label>
              </div>

              <div className="flex gap-3 pt-2 border-t border-[#1e1e2e]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  {saving ? 'Wird gespeichert…' : editingId ? 'Änderungen speichern' : 'Kurs erstellen'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-3 rounded-xl transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold text-white mb-2">Kurs löschen?</h2>
            <p className="text-slate-400 text-sm mb-6">
              Alle Module, Lektionen und Einschreibungen werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => void handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Endgültig löschen
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-2.5 rounded-xl transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

