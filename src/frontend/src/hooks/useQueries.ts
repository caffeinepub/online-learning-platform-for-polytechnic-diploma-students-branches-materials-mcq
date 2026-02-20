import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Branch, Semester, Subject, Notes, QuestionPaper, MCQ, Syllabus, UserProfile, SearchResult, MCQAnswer, MCQPracticeResult } from '../backend';
import { ExternalBlob } from '../backend';

// Branches
export function useGetBranches() {
  const { actor, isFetching } = useActor();
  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBranches();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetBranch(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Branch | null>({
    queryKey: ['branch', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBranch(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}

// Semesters
export function useGetSemestersByBranch(branchId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Semester[]>({
    queryKey: ['semesters', branchId?.toString()],
    queryFn: async () => {
      if (!actor || !branchId) return [];
      return actor.getSemestersByBranch(branchId);
    },
    enabled: !!actor && !isFetching && branchId !== null
  });
}

// Subjects
export function useGetSubjectsBySemester(semesterId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ['subjects', semesterId?.toString()],
    queryFn: async () => {
      if (!actor || !semesterId) return [];
      return actor.getSubjectsBySemester(semesterId);
    },
    enabled: !!actor && !isFetching && semesterId !== null
  });
}

export function useGetSubject(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Subject | null>({
    queryKey: ['subject', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getSubject(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}

// Notes
export function useGetNotesBySubject(subjectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Notes[]>({
    queryKey: ['notes', subjectId?.toString()],
    queryFn: async () => {
      if (!actor || !subjectId) return [];
      return actor.getNotesBySubject(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== null
  });
}

export function useAddNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { subjectId: bigint; title: string; year: bigint; tags: string[]; file: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNotes(data.subjectId, data.title, data.year, data.tags, data.file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });
}

export function useDeleteNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNotes(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });
}

// Question Papers
export function useGetQuestionPapersBySubject(subjectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<QuestionPaper[]>({
    queryKey: ['questionPapers', subjectId?.toString()],
    queryFn: async () => {
      if (!actor || !subjectId) return [];
      return actor.getQuestionPapersBySubject(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== null
  });
}

export function useAddQuestionPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { subjectId: bigint; year: bigint; examType: string | null; file: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuestionPaper(data.subjectId, data.year, data.examType, data.file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPapers'] });
    }
  });
}

export function useDeleteQuestionPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteQuestionPaper(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPapers'] });
    }
  });
}

// MCQs
export function useGetMCQsBySubject(subjectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MCQ[]>({
    queryKey: ['mcqs', subjectId?.toString()],
    queryFn: async () => {
      if (!actor || !subjectId) return [];
      return actor.getMCQsBySubject(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== null
  });
}

export function useAddMCQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { subjectId: bigint; question: string; options: string[]; correctAnswer: bigint; explanation: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMCQ(data.subjectId, data.question, data.options, data.correctAnswer, data.explanation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
    }
  });
}

export function useDeleteMCQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMCQ(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
    }
  });
}

export function useEvaluateMCQAnswers() {
  const { actor } = useActor();
  return useMutation<MCQPracticeResult, Error, MCQAnswer[]>({
    mutationFn: async (answers: MCQAnswer[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.evaluateMCQAnswers(answers);
    }
  });
}

// Syllabus
export function useGetSyllabusBySubject(subjectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Syllabus | null>({
    queryKey: ['syllabus', subjectId?.toString()],
    queryFn: async () => {
      if (!actor || !subjectId) return null;
      return actor.getSyllabusBySubject(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== null
  });
}

export function useAddOrUpdateSyllabus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { subjectId: bigint; overview: string }) => {
      if (!actor) throw new Error('Actor not available');
      const existing = await actor.getSyllabusBySubject(data.subjectId);
      if (existing) {
        return actor.updateSyllabus(data.subjectId, data.overview);
      } else {
        return actor.addSyllabus(data.subjectId, data.overview);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
    }
  });
}

// Search
export function useSearch(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SearchResult>({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) {
        return { subjects: [], notes: [], questionPapers: [], mcqs: [] };
      }
      return actor.search(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Admin
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching
  });
}

// Admin - Add Branch
export function useAddBranch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBranch(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    }
  });
}

// Admin - Add Semester
export function useAddSemester() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { branchId: bigint; number: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSemester(data.branchId, data.number);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
    }
  });
}

// Admin - Add Subject
export function useAddSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { branchId: bigint; semesterId: bigint; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSubject(data.branchId, data.semesterId, data.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
}
