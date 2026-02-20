import { useState } from 'react';
import { useGetBranches, useGetSemestersByBranch, useGetSubjectsBySemester, useAddNotes } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export function NotesManager() {
  const { data: branches } = useGetBranches();
  const addNotes = useAddNotes();

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState('');
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
    if (!selectedSubject || !title.trim() || !year || !file) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

      await addNotes.mutateAsync({
        subjectId: BigInt(selectedSubject),
        title: title.trim(),
        year: BigInt(year),
        tags: tagsArray,
        file: blob
      });

      toast.success('Notes uploaded successfully');
      setTitle('');
      setYear('');
      setTags('');
      setFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload notes');
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
          <Label>Title *</Label>
          <Input
            placeholder="e.g., Chapter 1 - Introduction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
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
      </div>

      <div>
        <Label>Tags (comma-separated)</Label>
        <Input
          placeholder="e.g., important, exam, theory"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
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

      <Button type="submit" disabled={addNotes.isPending}>
        <Upload className="w-4 h-4 mr-2" />
        {addNotes.isPending ? 'Uploading...' : 'Upload Notes'}
      </Button>
    </form>
  );
}
