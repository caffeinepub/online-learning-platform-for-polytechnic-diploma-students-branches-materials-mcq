import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBranches, useGetSemestersByBranch, useGetSubjectsBySemester } from '../hooks/useQueries';
import { BRANCHES, getBranchByName } from '../data/branches';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function BranchPage() {
  const navigate = useNavigate();
  const { branchId } = useParams({ from: '/branch/$branchId' });
  const branchData = BRANCHES.find(b => b.id === branchId);
  
  const { data: branches, isLoading: branchesLoading } = useGetBranches();
  const backendBranch = branches?.find(b => getBranchByName(b.name)?.id === branchId);
  
  const { data: semesters, isLoading: semestersLoading, error: semestersError } = useGetSemestersByBranch(
    backendBranch?.id ?? null
  );

  const [selectedSemester, setSelectedSemester] = useState<bigint | null>(null);
  
  const { data: subjects, isLoading: subjectsLoading } = useGetSubjectsBySemester(selectedSemester);

  if (branchesLoading || semestersLoading) {
    return <LoadingState message="Loading branch data..." />;
  }

  if (semestersError) {
    return <ErrorState message="Failed to load branch data. Please try again." />;
  }

  if (!branchData || !backendBranch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Branch not found"
          description="The branch you're looking for doesn't exist."
          action={{ label: 'Go to Home', onClick: () => navigate({ to: '/' }) }}
        />
      </div>
    );
  }

  const sortedSemesters = [...(semesters || [])].sort((a, b) => Number(a.number) - Number(b.number));

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Branch Header */}
      <div className="flex items-center gap-6 mb-8">
        <img src={branchData.icon} alt={branchData.name} className="w-20 h-20 object-contain" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{branchData.name}</h1>
          <p className="text-muted-foreground">{branchData.description}</p>
        </div>
      </div>

      {/* Semesters */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Select Semester</h2>
        {sortedSemesters.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No semesters available"
            description="Semesters will appear here once added by administrators."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sortedSemesters.map((semester) => (
              <Button
                key={semester.id.toString()}
                variant={selectedSemester === semester.id ? 'default' : 'outline'}
                className="h-auto py-4"
                onClick={() => setSelectedSemester(semester.id)}
              >
                Semester {semester.number.toString()}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Subjects */}
      {selectedSemester && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Subjects</h2>
          {subjectsLoading ? (
            <LoadingState message="Loading subjects..." />
          ) : subjects && subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id.toString()} 
                  className="hover:shadow-soft transition-all hover:border-primary/50 cursor-pointer h-full"
                  onClick={() => navigate({ to: '/subject/$subjectId', params: { subjectId: subject.id.toString() } })}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to view notes, papers, MCQs, and syllabus
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="No subjects available"
              description="Subjects for this semester will appear here once added."
            />
          )}
        </div>
      )}
    </div>
  );
}
