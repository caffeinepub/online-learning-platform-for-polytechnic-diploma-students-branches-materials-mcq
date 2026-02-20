import { useState } from 'react';
import { useGetBranches, useGetSemestersByBranch, useGetSubjectsBySemester, useGetSyllabusBySubject, useAddOrUpdateSyllabus } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export function SyllabusEditor() {
  const { data: branches } = useGetBranches();
  const updateSyllabus = useAddOrUpdateSyllabus();

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [overview, setOverview] = useState('');

  const { data: semesters } = useGetSemestersByBranch(selectedBranch ? BigInt(selectedBranch) : null);
  const { data: subjects } = useGetSubjectsBySemester(selectedSemester ? BigInt(selectedSemester) : null);
  const { data: syllabus } = useGetSyllabusBySubject(selectedSubject ? BigInt(selectedSubject) : null);

  // Update overview when syllabus is loaded
  useState(() => {
    if (syllabus) {
      setOverview(syllabus.overview);
    } else if (selectedSubject) {
      setOverview('');
    }
  });

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setOverview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !overview.trim()) {
      toast.error('Please select a subject and enter syllabus content');
      return;
    }

    try {
      await updateSyllabus.mutateAsync({
        subjectId: BigInt(selectedSubject),
        overview: overview.trim()
      });

      toast.success('Syllabus updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update syllabus');
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
          <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={!selectedSemester}>
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

      {selectedSubject && (
        <>
          <div>
            <Label>Syllabus Overview *</Label>
            <Textarea
              placeholder="Enter the syllabus content (topics, units, learning objectives, etc.)"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {syllabus ? 'Editing existing syllabus' : 'Creating new syllabus'}
            </p>
          </div>

          <Button type="submit" disabled={updateSyllabus.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateSyllabus.isPending ? 'Saving...' : 'Save Syllabus'}
          </Button>
        </>
      )}
    </form>
  );
}
