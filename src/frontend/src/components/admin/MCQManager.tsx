import { useState } from 'react';
import { useGetBranches, useGetSemestersByBranch, useGetSubjectsBySemester, useAddMCQ } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

export function MCQManager() {
  const { data: branches } = useGetBranches();
  const addMCQ = useAddMCQ();

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('0');
  const [explanation, setExplanation] = useState('');

  const { data: semesters } = useGetSemestersByBranch(selectedBranch ? BigInt(selectedBranch) : null);
  const { data: subjects } = useGetSubjectsBySemester(selectedSemester ? BigInt(selectedSemester) : null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (parseInt(correctAnswer) >= newOptions.length) {
        setCorrectAnswer('0');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !question.trim() || options.some(o => !o.trim())) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await addMCQ.mutateAsync({
        subjectId: BigInt(selectedSubject),
        question: question.trim(),
        options: options.map(o => o.trim()),
        correctAnswer: BigInt(correctAnswer),
        explanation: explanation.trim() || null
      });

      toast.success('MCQ added successfully');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('0');
      setExplanation('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add MCQ');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Branch *</Label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.map((branch) => (
                <SelectItem key={branch.id.toString()} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Semester *</Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters?.map((semester) => (
                <SelectItem key={semester.id.toString()} value={semester.id.toString()}>
                  Semester {semester.number.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Subject *</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((subject) => (
                <SelectItem key={subject.id.toString()} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Question *</Label>
        <Textarea
          placeholder="Enter the question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>Options *</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Option
        </Button>
      </div>

      <div>
        <Label>Correct Answer *</Label>
        <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`correct-${index}`} />
                <Label htmlFor={`correct-${index}`} className="cursor-pointer">
                  Option {index + 1}: {option || '(empty)'}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Explanation (optional)</Label>
        <Textarea
          placeholder="Explain why this is the correct answer"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={addMCQ.isPending}>
        <Plus className="w-4 h-4 mr-2" />
        {addMCQ.isPending ? 'Adding...' : 'Add MCQ'}
      </Button>
    </form>
  );
}
