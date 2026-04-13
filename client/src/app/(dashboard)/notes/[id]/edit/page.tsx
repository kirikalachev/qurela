'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { NoteForm } from '@/components/notes/NoteForm';
import { Note } from '@/types';

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user as any;

  useEffect(() => {
    if (params.id && session) {
      fetchNote();
    }
  }, [params.id, session]);

  const fetchNote = async () => {
    try {
      const response = await notesApi.getById(params.id as string, user);
      if (response.success && response.data) {
        setNote(response.data);
      } else {
        router.push('/notes');
      }
    } catch (error) {
      router.push('/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (title: string, content: string) => {
    const response = await notesApi.update(params.id as string, { title, content }, user);
    if (response.success) {
      router.push(`/notes/${params.id}`);
    } else {
      throw new Error(response.message || 'Failed to update note');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteForm
            initialData={{ title: note.title, content: note.content }}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/notes/${params.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}