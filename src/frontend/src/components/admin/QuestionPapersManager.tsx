import { useState } from 'react';
import { useGetBranches, useGetSemestersByBranch, useGetSubjectsBySemester, useAddQuestionPaper } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export function QuestionPapersManager() {
  const { data: branches } = useGetBranches();
  const addPaper = useAddQuestionPaper();

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: semesters } = useGetSemestersByBranch(selectedBranch ? BigInt(selectedBranch) : null);
  const { data: subjects } = useGetSubjectsBySemester(selectedSemester ? BigInt(selectedSemester) : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !year || !file) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addPaper.mutateAsync({
        subjectId: BigInt(selectedSubject),
        year: BigInt(year),
        examType: examType.trim() || null,
        file: blob
      });

      toast.success('Question paper uploaded successfully');
      setYear('');
      setExamType('');
      setFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload question paper');
      setUploadProgress(0);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Year *</Label>
          <Input
            type="number"
            min="2000"
            max="2100"
            placeholder="e.g., 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div>
          <Label>Exam Type (optional)</Label>
          <Input
            placeholder="e.g., Mid-term, Final"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>PDF File *</Label>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>
          <Label>Upload Progress</Label>
          <Progress value={uploadProgress} className="mt-2" />
        </div>
      )}

      <Button type="submit" disabled={addPaper.isPending}>
        <Upload className="w-4 h-4 mr-2" />
        {addPaper.isPending ? 'Uploading...' : 'Upload Question Paper'}
      </Button>
    </form>
  );
}
