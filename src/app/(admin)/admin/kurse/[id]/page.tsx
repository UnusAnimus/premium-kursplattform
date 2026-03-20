'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Lesson = {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  videoUrl: string | null;
  isFree: boolean;
  order: number;
};

type Module = {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

type CourseDetail = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  modules: Module[];
};

type ModuleForm = { title: string; description: string };
type LessonForm = { title: string; description: string; durationMin: string; videoUrl: string; isFree: boolean };

const EMPTY_MODULE_FORM: ModuleForm = { title: '', description: '' };
const EMPTY_LESSON_FORM: LessonForm = { title: '', description: '', durationMin: '', videoUrl: '', isFree: false };

const inputClass =
  'w-full bg-[var(--input-bg)] border border-[var(--border-base)] text-[var(--text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-[var(--text-muted)]';
const labelClass = 'block text-[var(--text-secondary)] text-xs font-medium mb-1.5';

export default function AdminKursDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params.id;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Module modal state
  const [moduleModal, setModuleModal] = useState<'create' | 'edit' | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleForm>(EMPTY_MODULE_FORM);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);

  // Lesson modal state
  const [lessonModal, setLessonModal] = useState<'create' | 'edit' | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonForm>(EMPTY_LESSON_FORM);
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (res.ok) {
        const data = (await res.json()) as { course: CourseDetail };
        setCourse(data.course);
      } else {
        router.push('/admin/kurse');
      }
    } catch {
      router.push('/admin/kurse');
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => { void loadCourse(); }, [loadCourse]);

  // ── Module operations ──────────────────────────────────────────────────────

  const openCreateModule = () => {
    setModuleForm(EMPTY_MODULE_FORM);
    setEditingModule(null);
    setSaveError('');
    setModuleModal('create');
  };

  const openEditModule = (mod: Module) => {
    setModuleForm({ title: mod.title, description: mod.description });
    setEditingModule(mod);
    setSaveError('');
    setModuleModal('edit');
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      let res: Response;
      if (moduleModal === 'create') {
        res = await fetch(`/api/admin/courses/${courseId}/modules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: moduleForm.title, description: moduleForm.description }),
        });
      } else {
        res = await fetch(`/api/admin/modules/${editingModule!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: moduleForm.title, description: moduleForm.description }),
        });
      }

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setSaveError(json.error ?? 'Speichern fehlgeschlagen.');
        return;
      }

      setModuleModal(null);
      await loadCourse();
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    try {
      await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' });
      await loadCourse();
    } catch {
      /* ignore */
    }
    setDeleteModuleId(null);
  };

  // ── Lesson operations ──────────────────────────────────────────────────────

  const openCreateLesson = (moduleId: string) => {
    setLessonForm(EMPTY_LESSON_FORM);
    setEditingLesson(null);
    setActiveModuleId(moduleId);
    setSaveError('');
    setLessonModal('create');
  };

  const openEditLesson = (lesson: Lesson, moduleId: string) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      durationMin: String(lesson.durationMin),
      videoUrl: lesson.videoUrl ?? '',
      isFree: lesson.isFree,
    });
    setEditingLesson(lesson);
    setActiveModuleId(moduleId);
    setSaveError('');
    setLessonModal('edit');
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      const payload = {
        title: lessonForm.title,
        description: lessonForm.description,
        durationMin: parseInt(lessonForm.durationMin, 10) || 0,
        videoUrl: lessonForm.videoUrl || null,
        isFree: lessonForm.isFree,
      };

      let res: Response;
      if (lessonModal === 'create') {
        res = await fetch(`/api/admin/modules/${activeModuleId}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/lessons/${editingLesson!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setSaveError(json.error ?? 'Speichern fehlgeschlagen.');
        return;
      }

      setLessonModal(null);
      await loadCourse();
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
      await loadCourse();
    } catch {
      /* ignore */
    }
    setDeleteLessonId(null);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-[var(--text-muted)] text-sm py-12 text-center">Kurs wird geladen…</div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-2">
            <Link href="/admin/kurse" className="hover:text-[var(--text-secondary)] transition-colors">Kurse</Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)]">{course.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{course.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">von {course.instructor} · {course.category}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/kurse/${course.slug}`}
            target="_blank"
            className="border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Kurs ansehen ↗
          </Link>
          <button
            onClick={openCreateModule}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
          >
            + Modul hinzufügen
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Module', value: course.modules.length },
          { label: 'Lektionen', value: course.modules.reduce((s, m) => s + m.lessons.length, 0) },
          { label: 'Gesamtdauer', value: `${course.modules.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + l.durationMin, 0), 0)} Min.` },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-4">
            <p className="text-[var(--text-muted)] text-xs mb-1">{stat.label}</p>
            <p className="text-[var(--text-primary)] text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Module list */}
      {course.modules.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-12 text-center">
          <div className="text-4xl opacity-20 mb-3">◈</div>
          <p className="text-[var(--text-secondary)] text-sm mb-4">Noch keine Module vorhanden.</p>
          <button onClick={openCreateModule} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm">
            Erstes Modul erstellen
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((mod, mi) => (
            <div key={mod.id} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden">
              {/* Module header */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-base)]">
                <div className="flex items-center gap-3">
                  <span className="brand-chip text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center">
                    {mi + 1}
                  </span>
                  <div>
                    <p className="text-[var(--text-primary)] font-semibold">{mod.title}</p>
                    {mod.description && (
                      <p className="text-[var(--text-muted)] text-xs mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-muted)] text-xs">{mod.lessons.length} Lektionen</span>
                  <button
                    onClick={() => openCreateLesson(mod.id)}
                    className="text-xs bg-[var(--bg-surface-raised)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Lektion
                  </button>
                  <button
                    onClick={() => openEditModule(mod)}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => setDeleteModuleId(mod.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Löschen
                  </button>
                </div>
              </div>

              {/* Lessons */}
              {mod.lessons.length > 0 ? (
                <div className="divide-y divide-[var(--border-base)]">
                  {mod.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--row-hover)] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[var(--text-muted)] text-xs w-5 text-right flex-shrink-0">{li + 1}.</span>
                        <div className="min-w-0">
                          <p className="text-[var(--text-primary)] text-sm font-medium truncate">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-[var(--text-muted)] text-xs truncate">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lesson.videoUrl && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Video</span>
                          )}
                          {lesson.isFree && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Kostenlos</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <span className="text-[var(--text-muted)] text-xs">{lesson.durationMin} Min.</span>
                        <button
                          onClick={() => openEditLesson(lesson, mod.id)}
                          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => setDeleteLessonId(lesson.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center">
                  <p className="text-[var(--text-muted)] text-sm">Noch keine Lektionen in diesem Modul.</p>
                  <button
                    onClick={() => openCreateLesson(mod.id)}
                    className="text-violet-400 hover:text-violet-300 text-sm mt-2 transition-colors"
                  >
                    Erste Lektion hinzufügen →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Module Modal ───────────────────────────────────────────────────── */}
      {moduleModal && (
        <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-base)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {moduleModal === 'create' ? 'Neues Modul erstellen' : 'Modul bearbeiten'}
              </h2>
              <button onClick={() => setModuleModal(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleSaveModule} className="p-6 space-y-4">
              {saveError && (
                <div className="status-error text-sm px-4 py-3 rounded-xl">{saveError}</div>
              )}
              <div>
                <label className={labelClass}>Titel *</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={e => setModuleForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="z.B. Grundlagen der Metaphysik"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Beschreibung</label>
                <textarea
                  value={moduleForm.description}
                  onChange={e => setModuleForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Kurze Beschreibung des Moduls"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-2 border-t border-[var(--border-base)]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  {saving ? 'Wird gespeichert…' : moduleModal === 'create' ? 'Modul erstellen' : 'Änderungen speichern'}
                </button>
                <button
                  type="button"
                  onClick={() => setModuleModal(null)}
                  className="flex-1 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] py-3 rounded-xl transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lesson Modal ───────────────────────────────────────────────────── */}
      {lessonModal && (
        <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-base)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {lessonModal === 'create' ? 'Neue Lektion erstellen' : 'Lektion bearbeiten'}
              </h2>
              <button onClick={() => setLessonModal(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleSaveLesson} className="p-6 space-y-4">
              {saveError && (
                <div className="status-error text-sm px-4 py-3 rounded-xl">{saveError}</div>
              )}
              <div>
                <label className={labelClass}>Titel *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="z.B. Was ist Metaphysik?"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Beschreibung</label>
                <textarea
                  value={lessonForm.description}
                  onChange={e => setLessonForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Was lernen die Teilnehmer?"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Dauer (Minuten) *</label>
                  <input
                    type="number"
                    value={lessonForm.durationMin}
                    onChange={e => setLessonForm(p => ({ ...p, durationMin: e.target.value }))}
                    min="0"
                    required
                    placeholder="15"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Video-URL (optional)</label>
                <input
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={e => setLessonForm(p => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/..."
                  className={inputClass}
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lessonForm.isFree}
                  onChange={e => setLessonForm(p => ({ ...p, isFree: e.target.checked }))}
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-[var(--text-secondary)] text-sm">Kostenlose Vorschau</span>
              </label>
              <div className="flex gap-3 pt-2 border-t border-[var(--border-base)]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  {saving ? 'Wird gespeichert…' : lessonModal === 'create' ? 'Lektion erstellen' : 'Änderungen speichern'}
                </button>
                <button
                  type="button"
                  onClick={() => setLessonModal(null)}
                  className="flex-1 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] py-3 rounded-xl transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Module Confirmation */}
      {deleteModuleId && (
        <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Modul löschen?</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Alle Lektionen in diesem Modul werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex gap-3">
              <button
                onClick={() => void handleDeleteModule(deleteModuleId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Endgültig löschen
              </button>
              <button
                onClick={() => setDeleteModuleId(null)}
                className="flex-1 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] py-2.5 rounded-xl transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lesson Confirmation */}
      {deleteLessonId && (
        <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Lektion löschen?</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex gap-3">
              <button
                onClick={() => void handleDeleteLesson(deleteLessonId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Endgültig löschen
              </button>
              <button
                onClick={() => setDeleteLessonId(null)}
                className="flex-1 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] py-2.5 rounded-xl transition-all"
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
