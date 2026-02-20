import { useGetSyllabusBySubject } from '../../hooks/useQueries';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface SyllabusOverviewProps {
  subjectId: bigint;
}

export function SyllabusOverview({ subjectId }: SyllabusOverviewProps) {
  const { data: syllabus, isLoading, error } = useGetSyllabusBySubject(subjectId);

  if (isLoading) {
    return <LoadingState message="Loading syllabus..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load syllabus. Please try again." />;
  }

  if (!syllabus) {
    return (
      <EmptyState
        icon={<BookOpen className="w-12 h-12" />}
        title="No syllabus available"
        description="The syllabus for this subject will appear here once added."
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap">{syllabus.overview}</div>
        </div>
      </CardContent>
    </Card>
  );
}
