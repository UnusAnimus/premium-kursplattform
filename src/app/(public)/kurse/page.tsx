import { CourseCatalog } from '@/components/courses/CourseCatalog';
import { getPublicCourses } from '@/lib/publicCourses';

export const dynamic = 'force-dynamic';

export default async function KursePage() {
  const courses = await getPublicCourses();

  return <CourseCatalog courses={courses} />;
}
