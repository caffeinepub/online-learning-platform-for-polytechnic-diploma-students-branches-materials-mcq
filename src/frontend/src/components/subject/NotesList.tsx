import { useGetNotesBySubject, useDeleteNotes, useIsCallerAdmin } from '../../hooks/useQueries';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2, Calendar, Tag } from 'lucide-react';
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

interface NotesListProps {
  subjectId: bigint;
}

export function NotesList({ subjectId }: NotesListProps) {
  const { data: notes, isLoading, error } = useGetNotesBySubject(subjectId);
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteNotes = useDeleteNotes();

  const handleDownload = (noteId: bigint, title: string, fileUrl: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (id: bigint, title: string) => {
    try {
      await deleteNotes.mutateAsync(id);
      toast.success(`Deleted "${title}"`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete note');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading notes..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load notes. Please try again." />;
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No notes available"
        description="Study notes for this subject will appear here once uploaded."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <Card key={note.id.toString()}>
          <CardHeader>
            <CardTitle className="text-lg flex items-start justify-between gap-2">
              <span className="flex-1">{note.title}</span>
              <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Year: {note.year.toString()}</span>
            </div>
            {note.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleDownload(note.id, note.title, note.file.getDirectURL())}
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
                      <AlertDialogTitle>Delete Note</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{note.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(note.id, note.title)}>
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
  );
}
