'use client';

import { useState, useCallback } from 'react';
import { notesApi } from '@/lib/api';
import { Note } from '@/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesApi.getAll();
      if (response.success && response.data) {
        setNotes(response.data);
      } else {
        setError(response.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNote = useCallback(async (title: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesApi.create({ title, content });
      if (response.success && response.data) {
        setNotes((prev) => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.message || 'Failed to create note');
        return null;
      }
    } catch (err) {
      setError('Failed to create note');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, data: { title?: string; content?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesApi.update(id, data);
      if (response.success && response.data) {
        setNotes((prev) =>
          prev.map((note) => (note.id === id ? response.data! : note))
        );
        return response.data;
      } else {
        setError(response.message || 'Failed to update note');
        return null;
      }
    } catch (err) {
      setError('Failed to update note');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesApi.delete(id);
      if (response.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        return true;
      } else {
        setError('Failed to delete note');
        return false;
      }
    } catch (err) {
      setError('Failed to delete note');
      return false;
    }
  }, []);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}