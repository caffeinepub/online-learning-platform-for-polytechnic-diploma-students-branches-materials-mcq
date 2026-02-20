import { useParams, Link } from '@tanstack/react-router';
import { useGetSubject, useGetNotesBySubject, useGetQuestionPapersBySubject, useGetMCQsBySubject, useGetSyllabusBySubject } from '../hooks/useQueries';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { NotesList } from '../components/subject/NotesList';
import { QuestionPapersList } from '../components/subject/QuestionPapersList';
import { MCQBrowser } from '../components/subject/MCQBrowser';
import { SyllabusOverview } from '../components/subject/SyllabusOverview';

export default function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' });
  const subjectIdBigInt = BigInt(subjectId);

  const { data: subject, isLoading: subjectLoading, error: subjectError } = useGetSubject(subjectIdBigInt);

  if (subjectLoading) {
    return <LoadingState message="Loading subject..." />;
  }

  if (subjectError || !subject) {
    return <ErrorState message="Failed to load subject. Please try again." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/" onClick={() => window.history.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
        <p className="text-muted-foreground">Access all study materials for this subject</p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="papers">Question Papers</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <NotesList subjectId={subjectIdBigInt} />
        </TabsContent>

        <TabsContent value="papers">
          <QuestionPapersList subjectId={subjectIdBigInt} />
        </TabsContent>

        <TabsContent value="mcqs">
          <MCQBrowser subjectId={subjectIdBigInt} />
        </TabsContent>

        <TabsContent value="syllabus">
          <SyllabusOverview subjectId={subjectIdBigInt} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
