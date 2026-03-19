'use client';
import { useState } from 'react';
import { courses } from '@/lib/data';

type LessonEntry = {
  id: string;
  title: string;
  description: string;
  duration: number;
  isFree: boolean;
  order: number;
  courseName: string;
  moduleTitle: string;
  courseSlug: string;
};

export default function AdminLektionenPage() {
  const initialLessons: LessonEntry[] = courses.flatMap(course =>
    course.modules.flatMap(mod =>
      mod.lessons.map(lesson => ({
        ...lesson,
        courseName: course.title,
        moduleTitle: mod.title,
        courseSlug: course.slug,
      }))
    )
  );

  const [lessons, setLessons] = useState<LessonEntry[]>(initialLessons);
  const [editingLesson, setEditingLesson] = useState<LessonEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', duration: '', isFree: false });

  const openEdit = (lesson: LessonEntry) => {
    setEditingLesson(lesson);
    setFormData({ title: lesson.title, description: lesson.description, duration: String(lesson.duration), isFree: lesson.isFree });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setLessons(prev => prev.map(l =>
      l.id === editingLesson.id
        ? { ...l, title: formData.title, description: formData.description, duration: (() => { const p = parseInt(formData.duration, 10); return isNaN(p) ? l.duration : p; })(), isFree: formData.isFree }
        : l
    ));
    setEditingLesson(null);
  };

  const handleDelete = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Lektionen verwalten</h1>
          <p className="text-slate-400">{lessons.length} Lektionen gesamt</p>
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Lektion', 'Kurs', 'Modul', 'Dauer', 'Kostenlos', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {lessons.map(lesson => (
              <tr key={lesson.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <p className="text-white font-medium">{lesson.title}</p>
                  <p className="text-slate-500 text-xs">{lesson.description}</p>
                </td>
                <td className="p-4 text-slate-300 text-xs">{lesson.courseName}</td>
                <td className="p-4 text-slate-400 text-xs">{lesson.moduleTitle}</td>
                <td className="p-4 text-slate-300">{lesson.duration} Min.</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${lesson.isFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#1e1e2e] text-slate-500'}`}>
                    {lesson.isFree ? 'Kostenlos' : 'Bezahlt'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(lesson)} className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                    <button onClick={() => setDeleteId(lesson.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Lektion bearbeiten</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Beschreibung</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Dauer (Minuten)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))}
                  min="1"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={e => setFormData(p => ({ ...p, isFree: e.target.checked }))}
                  className="accent-violet-600"
                />
                <label htmlFor="isFree" className="text-slate-300 text-sm">Kostenlose Vorschau</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all">
                  Speichern
                </button>
                <button type="button" onClick={() => setEditingLesson(null)} className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-2.5 rounded-xl transition-all">
                  Abbrechen
                </button>
              </div>
            </form>
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
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all">
                Löschen
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-2.5 rounded-xl transition-all">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
