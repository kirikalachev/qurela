'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { NoteForm } from '@/components/notes/NoteForm';

export default function NewNotePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const handleSubmit = async (title: string, content: string) => {
    const response = await notesApi.create({ title, content }, user);
    if (response.success) {
      router.push('/notes');
    } else {
      throw new Error(response.message || 'Failed to create note');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/notes')}
          />
        </CardContent>
      </Card>
    </div>
  );
}