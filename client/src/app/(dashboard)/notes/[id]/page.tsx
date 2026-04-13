'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types';

export default function NoteDetailPage() {
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesApi.delete(params.id as string, user);
      router.push('/notes');
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <CardTitle className="text-xl">{note.title}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Created: {formatDate(note.createdAt)}
            {note.updatedAt !== note.createdAt && ` | Updated: ${formatDate(note.updatedAt)}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-navy">{note.content}</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="secondary" onClick={() => router.push('/notes')}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => router.push(`/notes/${note.id}/edit`)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}