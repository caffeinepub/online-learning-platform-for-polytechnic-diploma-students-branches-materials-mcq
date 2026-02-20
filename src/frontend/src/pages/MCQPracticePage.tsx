import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSubject, useGetMCQsBySubject, useEvaluateMCQAnswers } from '../hooks/useQueries';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { MCQAnswer } from '../backend';

export default function MCQPracticePage() {
  const { subjectId } = useParams({ from: '/practice/$subjectId' });
  const navigate = useNavigate();
  const subjectIdBigInt = BigInt(subjectId);

  const { data: subject, isLoading: subjectLoading } = useGetSubject(subjectIdBigInt);
  const { data: mcqs, isLoading: mcqsLoading } = useGetMCQsBySubject(subjectIdBigInt);
  const evaluateAnswers = useEvaluateMCQAnswers();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<bigint, bigint>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ totalQuestions: bigint; correctAnswers: bigint; score: number } | null>(null);

  const handleAnswer = (mcqId: bigint, answerIndex: bigint) => {
    setAnswers(new Map(answers.set(mcqId, answerIndex)));
  };

  const handleNext = () => {
    if (mcqs && currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!mcqs) return;

    const answerArray: MCQAnswer[] = Array.from(answers.entries()).map(([mcqId, selectedAnswer]) => ({
      mcqId,
      selectedAnswer
    }));

    try {
      const result = await evaluateAnswers.mutateAsync(answerArray);
      setResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to evaluate answers:', error);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers(new Map());
    setShowResults(false);
    setResults(null);
  };

  if (subjectLoading || mcqsLoading) {
    return <LoadingState message="Loading practice session..." />;
  }

  if (!subject || !mcqs) {
    return <ErrorState message="Failed to load practice session." />;
  }

  if (mcqs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="No MCQs available"
          description="There are no questions available for practice in this subject yet."
          action={{
            label: 'Go Back',
            onClick: () => navigate({ to: '/subject/$subjectId', params: { subjectId } })
          }}
        />
      </div>
    );
  }

  if (showResults && results) {
    const percentage = results.score;
    const isPassed = percentage >= 50;

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Practice Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                {percentage.toFixed(1)}%
              </div>
              <p className="text-muted-foreground">
                {results.correctAnswers.toString()} out of {results.totalQuestions.toString()} correct
              </p>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="flex gap-3">
              <Button onClick={handleRestart} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate({ to: '/subject/$subjectId', params: { subjectId } })}
                className="flex-1"
              >
                Back to Subject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMCQ = mcqs[currentIndex];
  const currentAnswer = answers.get(currentMCQ.id);
  const progress = ((currentIndex + 1) / mcqs.length) * 100;
  const allAnswered = answers.size === mcqs.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate({ to: '/subject/$subjectId', params: { subjectId } })}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Exit Practice
      </Button>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{subject.name} - Practice</h1>
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {mcqs.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{currentMCQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswer(currentMCQ.id, BigInt(value))}
          >
            <div className="space-y-3">
              {currentMCQ.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <div className="flex-1" />
        {currentIndex < mcqs.length - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || evaluateAnswers.isPending}
          >
            {evaluateAnswers.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>

      {!allAnswered && currentIndex === mcqs.length - 1 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Please answer all questions before submitting
        </p>
      )}
    </div>
  );
}
