import { useState } from 'react';
import { useGetQuestionPapersBySubject, useDeleteQuestionPaper, useIsCallerAdmin } from '../../hooks/useQueries';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface QuestionPapersListProps {
  subjectId: bigint;
}

export function QuestionPapersList({ subjectId }: QuestionPapersListProps) {
  const { data: papers, isLoading, error } = useGetQuestionPapersBySubject(subjectId);
  const { data: isAdmin } = useIsCallerAdmin();
  const deletePaper = useDeleteQuestionPaper();
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc'>('year-desc');

  const handleDownload = (paperId: bigint, year: bigint, examType: string | undefined, fileUrl: string) => {
    try {
      const filename = `Question_Paper_${year}${examType ? `_${examType}` : ''}.pdf`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (id: bigint, year: bigint) => {
    try {
      await deletePaper.mutateAsync(id);
      toast.success(`Deleted paper from ${year}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete paper');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading question papers..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load question papers. Please try again." />;
  }

  if (!papers || papers.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No question papers available"
        description="Previous year question papers will appear here once uploaded."
      />
    );
  }

  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === 'year-desc') {
      return Number(b.year) - Number(a.year);
    }
    return Number(a.year) - Number(b.year);
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year-desc">Newest First</SelectItem>
            <SelectItem value="year-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedPapers.map((paper) => (
          <Card key={paper.id.toString()}>
            <CardHeader>
              <CardTitle className="text-lg flex items-start justify-between gap-2">
                <span className="flex-1">
                  {paper.year.toString()} {paper.examType ? `- ${paper.examType}` : ''}
                </span>
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Year: {paper.year.toString()}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleDownload(paper.id, paper.year, paper.examType, paper.file.getDirectURL())}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question Paper</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this paper? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(paper.id, paper.year)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
