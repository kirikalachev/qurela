import { prisma } from "../config/database.js";
import { Note } from "@prisma/client";

interface CreateNoteInput {
  title: string;
  content: string;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export async function getNotesByUser(userId: string): Promise<Note[]> {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getNoteById(id: string, userId: string): Promise<Note | null> {
  return prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createNote(
  userId: string,
  input: CreateNoteInput
): Promise<Note> {
  return prisma.note.create({
    data: {
      title: input.title,
      content: input.content,
      userId,
    },
  });
}

export async function updateNote(
  id: string,
  userId: string,
  input: UpdateNoteInput
): Promise<Note | null> {
  const note = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!note) {
    return null;
  }

  return prisma.note.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.content && { content: input.content }),
    },
  });
}

export async function deleteNote(id: string, userId: string): Promise<boolean> {
  const note = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!note) {
    return false;
  }

  await prisma.note.delete({
    where: { id },
  });

  return true;
}