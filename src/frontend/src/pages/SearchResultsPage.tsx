import { useSearch as useRouterSearch, useNavigate } from '@tanstack/react-router';
import { useSearch } from '../hooks/useQueries';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, BookOpen, FileText, Brain, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const searchParams = useRouterSearch({ from: '/search' }) as { q?: string };
  const query = searchParams.q || '';
  
  const { data: results, isLoading } = useSearch(query);

  if (isLoading) {
    return <LoadingState message="Searching..." />;
  }

  const hasResults = results && (
    results.subjects.length > 0 ||
    results.notes.length > 0 ||
    results.questionPapers.length > 0 ||
    results.mcqs.length > 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          {query ? `Results for "${query}"` : 'Enter a search term to find content'}
        </p>
      </div>

      {!query ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Start searching"
          description="Use the search bar above to find subjects, notes, question papers, and MCQs."
        />
      ) : !hasResults ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No results found"
          description={`No content found matching "${query}". Try different keywords.`}
        />
      ) : (
        <div className="space-y-8">
          {/* Subjects */}
          {results.subjects.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Subjects ({results.subjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.subjects.map((subject) => (
                  <Card 
                    key={subject.id.toString()} 
                    className="hover:shadow-soft transition-all hover:border-primary/50 cursor-pointer h-full"
                    onClick={() => navigate({ to: '/subject/$subjectId', params: { subjectId: subject.id.toString() } })}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{subject.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes ({results.notes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.notes.map((note) => (
                  <Card key={note.id.toString()}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>Year: {note.year.toString()}</span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Question Papers */}
          {results.questionPapers.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <File className="w-5 h-5" />
                Question Papers ({results.questionPapers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.questionPapers.map((paper) => (
                  <Card key={paper.id.toString()}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {paper.year.toString()} {paper.examType ? `- ${paper.examType}` : ''}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* MCQs */}
          {results.mcqs.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                MCQs ({results.mcqs.length})
              </h2>
              <div className="space-y-3">
                {results.mcqs.slice(0, 10).map((mcq) => (
                  <Card key={mcq.id.toString()}>
                    <CardContent className="pt-4">
                      <p className="text-sm">{mcq.question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
