'use client';

import { Note } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface NoteCardProps {
  note: Note;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <h3 className="text-base font-bold text-navy truncate mb-2" title={note.title}>
          {note.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
        <div className="flex gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(note.id)}>
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(note.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(note.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}