'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';

interface NoteFormProps {
  initialData?: {
    title: string;
    content: string;
  };
  onSubmit: (title: string, content: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function NoteForm({ initialData, onSubmit, onCancel, isLoading }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(title.trim(), content.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card padding="lg">
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              maxLength={255}
            />
            <Textarea
              label="Content"
              placeholder="Write your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={errors.content}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Note' : 'Create Note'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}