import { useState } from 'react';
import { useGetBranches, useGetSemestersByBranch, useAddBranch, useAddSemester, useAddSubject } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export function ContentSetup() {
  const { data: branches } = useGetBranches();
  const addBranch = useAddBranch();
  const addSemester = useAddSemester();
  const addSubject = useAddSubject();

  const [branchName, setBranchName] = useState('');
  const [selectedBranchForSemester, setSelectedBranchForSemester] = useState<string>('');
  const [semesterNumber, setSemesterNumber] = useState('');
  const [selectedBranchForSubject, setSelectedBranchForSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [subjectName, setSubjectName] = useState('');

  const { data: semesters } = useGetSemestersByBranch(
    selectedBranchForSubject ? BigInt(selectedBranchForSubject) : null
  );

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    try {
      await addBranch.mutateAsync(branchName.trim());
      toast.success('Branch added successfully');
      setBranchName('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add branch');
    }
  };

  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchForSemester || !semesterNumber) return;

    try {
      await addSemester.mutateAsync({
        branchId: BigInt(selectedBranchForSemester),
        number: BigInt(semesterNumber)
      });
      toast.success('Semester added successfully');
      setSemesterNumber('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add semester');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchForSubject || !selectedSemester || !subjectName.trim()) return;

    try {
      await addSubject.mutateAsync({
        branchId: BigInt(selectedBranchForSubject),
        semesterId: BigInt(selectedSemester),
        name: subjectName.trim()
      });
      toast.success('Subject added successfully');
      setSubjectName('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add subject');
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Branch */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Add Branch</h3>
        <form onSubmit={handleAddBranch} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Branch name (e.g., Computer Engineering)"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={addBranch.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </form>
      </div>

      <Separator />

      {/* Add Semester */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Add Semester</h3>
        <form onSubmit={handleAddSemester} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Branch</Label>
              <Select value={selectedBranchForSemester} onValueChange={setSelectedBranchForSemester}>
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
              <Label>Semester Number</Label>
              <Input
                type="number"
                min="1"
                max="8"
                placeholder="1-8"
                value={semesterNumber}
                onChange={(e) => setSemesterNumber(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={addSemester.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Add Semester
          </Button>
        </form>
      </div>

      <Separator />

      {/* Add Subject */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Add Subject</h3>
        <form onSubmit={handleAddSubject} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Branch</Label>
              <Select value={selectedBranchForSubject} onValueChange={setSelectedBranchForSubject}>
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
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedBranchForSubject}>
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
          </div>
          <div>
            <Label>Subject Name</Label>
            <Input
              placeholder="Subject name (e.g., Data Structures)"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={addSubject.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </form>
      </div>
    </div>
  );
}
