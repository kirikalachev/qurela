import { prisma } from "../config/database.js";

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllUsers(): Promise<UserResponse[]> {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string): Promise<UserResponse | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return false;
  }

  await prisma.user.delete({
    where: { id },
  });

  return true;
}

export async function getAllNotesAdmin() {
  return prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

export async function getNoteByIdAdmin(id: string) {
  return prisma.note.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

export async function updateNoteByIdAdmin(
  id: string,
  data: { title?: string; content?: string }
) {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return null;
  }

  return prisma.note.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
    },
  });
}

export async function deleteNoteByIdAdmin(id: string): Promise<boolean> {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return false;
  }

  await prisma.note.delete({
    where: { id },
  });

  return true;
}

export interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  recentNotes: { id: string; title: string; userId: string; createdAt: Date }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const totalUsers = await prisma.user.count();
  const totalNotes = await prisma.note.count();

  const recentNotes = await prisma.note.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
    },
  });

  return {
    totalUsers,
    totalNotes,
    recentNotes,
  };
}