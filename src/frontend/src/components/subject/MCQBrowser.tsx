import { useNavigate } from '@tanstack/react-router';
import { useGetMCQsBySubject, useDeleteMCQ, useIsCallerAdmin } from '../../hooks/useQueries';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
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

interface MCQBrowserProps {
  subjectId: bigint;
}

export function MCQBrowser({ subjectId }: MCQBrowserProps) {
  const navigate = useNavigate();
  const { data: mcqs, isLoading, error } = useGetMCQsBySubject(subjectId);
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteMCQ = useDeleteMCQ();

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMCQ.mutateAsync(id);
      toast.success('MCQ deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete MCQ');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading MCQs..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load MCQs. Please try again." />;
  }

  if (!mcqs || mcqs.length === 0) {
    return (
      <EmptyState
        icon={<Brain className="w-12 h-12" />}
        title="No MCQs available"
        description="Multiple choice questions will appear here once added."
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{mcqs.length} questions available</p>
        <Button onClick={() => navigate({ to: '/practice/$subjectId', params: { subjectId: subjectId.toString() } })}>
          <Play className="w-4 h-4 mr-2" />
          Start Practice
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {mcqs.map((mcq, index) => (
          <AccordionItem key={mcq.id.toString()} value={mcq.id.toString()} asChild>
            <Card>
              <CardHeader>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start gap-3 text-left w-full pr-4">
                    <Badge variant="outline" className="flex-shrink-0">Q{index + 1}</Badge>
                    <CardTitle className="text-base font-medium flex-1">{mcq.question}</CardTitle>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    {mcq.options.map((option, optIdx) => {
                      const isCorrect = BigInt(optIdx) === mcq.correctAnswer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                              : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                            <span className="flex-1">{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {mcq.explanation && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{mcq.explanation}</p>
                    </div>
                  )}
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete MCQ
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete MCQ</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(mcq.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
