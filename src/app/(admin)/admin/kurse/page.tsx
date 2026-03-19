'use client';
import { useState } from 'react';
import { courses as initialCourses } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { Course } from '@/lib/types';

type CourseEntry = Pick<Course, 'id' | 'slug' | 'title' | 'instructor' | 'category' | 'level' | 'price' | 'studentsCount' | 'rating'>;

export default function AdminKursePage() {
  const [courses, setCourses] = useState<CourseEntry[]>(
    initialCourses.map(c => ({
      id: c.id, slug: c.slug, title: c.title, instructor: c.instructor,
      category: c.category, level: c.level, price: c.price,
      studentsCount: c.studentsCount, rating: c.rating,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', instructor: '', category: '', price: '' });

  const openCreate = () => {
    setEditingCourse(null);
    setFormData({ title: '', instructor: '', category: '', price: '' });
    setShowModal(true);
  };

  const openEdit = (course: CourseEntry) => {
    setEditingCourse(course);
    setFormData({ title: course.title, instructor: course.instructor, category: course.category, price: String(course.price) });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(prev => prev.map(c =>
        c.id === editingCourse.id
          ? { ...c, title: formData.title, instructor: formData.instructor, category: formData.category, price: parseFloat(formData.price) || c.price }
          : c
      ));
    } else {
      const newCourse: CourseEntry = {
        id: `local-${Date.now()}`,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        title: formData.title,
        instructor: formData.instructor,
        category: formData.category,
        level: 'Anfänger',
        price: parseFloat(formData.price) || 0,
        studentsCount: 0,
        rating: 0,
      };
      setCourses(prev => [newCourse, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Kurse verwalten</h1>
          <p className="text-slate-400">Alle {courses.length} Kurse</p>
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
              {['Kurs', 'Kategorie', 'Niveau', 'Preis', 'Studierende', 'Bewertung', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {courses.map(course => (
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
                <td className="p-4 text-slate-300">{course.level}</td>
                <td className="p-4 text-white font-medium">{formatPrice(course.price)}</td>
                <td className="p-4 text-slate-300">{course.studentsCount.toLocaleString('de-DE')}</td>
                <td className="p-4 text-amber-400">★ {course.rating}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/kurse/${course.slug}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ansehen</Link>
                    <button onClick={() => openEdit(course)} className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                    <button onClick={() => setDeleteId(course.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingCourse ? 'Kurs bearbeiten' : 'Neuer Kurs'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Kursname"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Dozent</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={e => setFormData(p => ({ ...p, instructor: e.target.value }))}
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Name des Dozenten"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Kategorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="z.B. Metaphysik"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Preis (€)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                  min="0"
                  step="0.01"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="49.00"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all"
                >
                  {editingCourse ? 'Speichern' : 'Erstellen'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#2a2a3e] text-slate-300 hover:text-white py-2.5 rounded-xl transition-all"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold text-white mb-2">Kurs löschen?</h2>
            <p className="text-slate-400 text-sm mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Löschen
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
