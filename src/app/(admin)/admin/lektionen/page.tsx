'use client';
import { useState, useEffect, useCallback } from 'react';

type LessonRow = {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  videoUrl: string | null;
  isFree: boolean;
  order: number;
  moduleId: string;
  module: {
    id: string;
    title: string;
    courseId: string;
    course: { id: string; title: string; slug: string };
  };
};

type ModuleOption = { id: string; title: string; courseTitle: string; courseId: string };

type FormData = {
  title: string;
  description: string;
  durationMin: string;
  videoUrl: string;
  isFree: boolean;
  moduleId: string;
};

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  durationMin: '',
  videoUrl: '',
  isFree: false,
  moduleId: '',
};

const inputClass =
  'w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-600';
const labelClass = 'block text-slate-400 text-xs font-medium mb-1.5';

export default function AdminLektionenPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<LessonRow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [filterCourseId, setFilterCourseId] = useState('');

  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/lessons');
      if (res.ok) {
        const data = (await res.json()) as { lessons: LessonRow[] };
        setLessons(data.lessons);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  // Load modules from courses API for the create form
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch('/api/admin/courses');
        if (res.ok) {
          const data = (await res.json()) as {
            courses: { id: string; title: string; modules?: { id: string; title: string }[] }[];
          };
          const mods: ModuleOption[] = [];
          for (const course of data.courses) {
            for (const mod of course.modules ?? []) {
              mods.push({ id: mod.id, title: mod.title, courseTitle: course.title, courseId: course.id });
            }
          }
          setModules(mods);
        }
      } catch {
        /* ignore */
      }
    };
    void fetchModules();
  }, []);

  const openEdit = (lesson: LessonRow) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      durationMin: String(lesson.durationMin),
      videoUrl: lesson.videoUrl ?? '',
      isFree: lesson.isFree,
      moduleId: lesson.moduleId,
    });
    setSaveError('');
  };

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setSaveError('');
    setShowCreateModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setSaving(true);
    setSaveError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        durationMin: parseInt(formData.durationMin, 10) || 0,
        videoUrl: formData.videoUrl || null,
        isFree: formData.isFree,
      };

      const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setSaveError(json.error ?? 'Speichern fehlgeschlagen.');
        return;
      }

      setEditingLesson(null);
      await loadLessons();
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.moduleId) {
      setSaveError('Bitte wähle ein Modul aus.');
      return;
    }
    setSaving(true);
    setSaveError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        durationMin: parseInt(formData.durationMin, 10) || 0,
        videoUrl: formData.videoUrl || null,
        isFree: formData.isFree,
      };

      const res = await fetch(`/api/admin/modules/${formData.moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setSaveError(json.error ?? 'Erstellen fehlgeschlagen.');
        return;
      }

      setShowCreateModal(false);
      await loadLessons();
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
      setLessons(prev => prev.filter(l => l.id !== id));
    } catch {
      /* ignore */
    }
    setDeleteId(null);
  };

  // Unique courses for filter
  const courseOptions = Array.from(
    new Map(lessons.map(l => [l.module.courseId, l.module.course.title])).entries()
  );

  const filtered = filterCourseId ? lessons.filter(l => l.module.courseId === filterCourseId) : lessons;

  const renderForm = (onSubmit: (e: React.FormEvent) => Promise<void>, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="p-6 space-y-5">
      {saveError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {saveError}
        </div>
      )}

      <div>
        <label className={labelClass}>Titel *</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
          required
          placeholder="z.B. Einführung in die Metaphysik"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
          rows={3}
          placeholder="Was lernen die Teilnehmer in dieser Lektion?"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Dauer (Minuten) *</label>
          <input
            type="number"
            value={formData.durationMin}
            onChange={e => setFormData(p => ({ ...p, durationMin: e.target.value }))}
            min="0"
            required
            placeholder="15"
            className={inputClass}
          />
        </div>

        {!isEdit && (
          <div>
            <label htmlFor="lesson-module-select" className={labelClass}>Modul *</label>
            <select
              id="lesson-module-select"
              value={formData.moduleId}
              onChange={e => setFormData(p => ({ ...p, moduleId: e.target.value }))}
              required
              className={inputClass}
            >
              <option value="">Modul wählen</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {m.courseTitle} – {m.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Video-URL (optional)</label>
        <input
          type="url"
          value={formData.videoUrl}
          onChange={e => setFormData(p => ({ ...p, videoUrl: e.target.value }))}
          placeholder="https://www.youtube.com/embed/..."
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isFree}
          onChange={e => setFormData(p => ({ ...p, isFree: e.target.checked }))}
          className="accent-violet-600 w-4 h-4"
        />
        <span className="text-slate-300 text-sm">Kostenlose Vorschau (ohne Einschreibung zugänglich)</span>
      </label>

      <div className="flex gap-3 pt-2 border-t border-[#1e1e2e]">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all"
        >
          {saving ? 'Wird gespeichert…' : isEdit ? 'Änderungen speichern' : 'Lektion erstellen'}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingLesson(null);
            setShowCreateModal(false);
          }}
          className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-3 rounded-xl transition-all"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Lektionen verwalten</h1>
          <p className="text-slate-400">
            {loading ? 'Wird geladen…' : `${filtered.length} Lektion${filtered.length !== 1 ? 'en' : ''} gesamt`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterCourseId}
            onChange={e => setFilterCourseId(e.target.value)}
            className="bg-[#0a0a0f] border border-[#2a2a3e] text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Alle Kurse</option>
            {courseOptions.map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
          <button
            onClick={openCreate}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
          >
            + Neue Lektion
          </button>
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Lektion', 'Kurs', 'Modul', 'Dauer', 'Video', 'Zugang', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">Lektionen werden geladen…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="text-4xl opacity-20 mb-3">◈</div>
                  <p className="text-slate-400 text-sm">Keine Lektionen gefunden.</p>
                </td>
              </tr>
            ) : (
              filtered.map(lesson => (
                <tr key={lesson.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium">{lesson.title}</p>
                    <p className="text-slate-500 text-xs line-clamp-1">{lesson.description}</p>
                  </td>
                  <td className="p-4 text-slate-300 text-xs">{lesson.module.course.title}</td>
                  <td className="p-4 text-slate-400 text-xs">{lesson.module.title}</td>
                  <td className="p-4 text-slate-300 whitespace-nowrap">{lesson.durationMin} Min.</td>
                  <td className="p-4">
                    {lesson.videoUrl ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">✓ Video</span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        lesson.isFree
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-[#1e1e2e] text-slate-500'
                      }`}
                    >
                      {lesson.isFree ? 'Kostenlos' : 'Bezahlt'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(lesson)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => setDeleteId(lesson.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
              <div>
                <h2 className="text-xl font-bold text-white">Lektion bearbeiten</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  {editingLesson.module.course.title} › {editingLesson.module.title}
                </p>
              </div>
              <button onClick={() => setEditingLesson(null)} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
            </div>
            {renderForm(handleSave, true)}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
              <h2 className="text-xl font-bold text-white">Neue Lektion erstellen</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
            </div>
            {renderForm(handleCreate, false)}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold text-white mb-2">Lektion löschen?</h2>
            <p className="text-slate-400 text-sm mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
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
