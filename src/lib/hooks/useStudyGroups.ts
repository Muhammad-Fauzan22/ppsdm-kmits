'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseName?: string;
  members: number;
  maxMembers: number;
  isPrivate: boolean;
  isJoined?: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface UseStudyGroupsReturn {
  data: StudyGroup[] | undefined;
  isLoading: boolean;
  error: Error | null;
  joinGroup: (groupId: string) => Promise<void>;
  isJoining: boolean;
}

export function useStudyGroups(): UseStudyGroupsReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['study-groups'],
    queryFn: async () => {
      const response = await fetch('/api/study-groups');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login to view study groups');
        }
        throw new Error('Failed to fetch study groups');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const joinMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await fetch('/api/study-groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join group');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch study groups
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
    },
    onError: (error: Error) => {
      },
  });

  const joinGroup = async (groupId: string) => {
    await joinMutation.mutateAsync(groupId);
  };

  return {
    data,
    isLoading,
    error: error as Error | null,
    joinGroup,
    isJoining: joinMutation.isPending,
  };
}
