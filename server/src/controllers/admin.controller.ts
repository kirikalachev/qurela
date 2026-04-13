import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/authenticate.js";
import * as adminService from "../services/admin.service.js";
import { success, badRequest, notFound } from "../utils/apiResponse.js";

const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

export async function getAllUsers(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const users = await adminService.getAllUsers();
    success(res, users);
  } catch {
    badRequest(res, "Failed to fetch users");
  }
}

export async function getUserById(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = await adminService.getUserById(req.params.id);

    if (!user) {
      notFound(res, "User not found");
      return;
    }

    success(res, user);
  } catch {
    badRequest(res, "Failed to fetch user");
  }
}

export async function deleteUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const deleted = await adminService.deleteUser(req.params.id);

    if (!deleted) {
      notFound(res, "User not found");
      return;
    }

    success(res, { message: "User deleted successfully" });
  } catch {
    badRequest(res, "Failed to delete user");
  }
}

export async function getAllNotes(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const notes = await adminService.getAllNotesAdmin();
    success(res, notes);
  } catch {
    badRequest(res, "Failed to fetch notes");
  }
}

export async function getNoteById(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const note = await adminService.getNoteByIdAdmin(req.params.id);

    if (!note) {
      notFound(res, "Note not found");
      return;
    }

    success(res, note);
  } catch {
    badRequest(res, "Failed to fetch note");
  }
}

export async function updateNote(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const input = updateNoteSchema.parse(req.body);
    const note = await adminService.updateNoteByIdAdmin(req.params.id, input);

    if (!note) {
      notFound(res, "Note not found");
      return;
    }

    success(res, note);
  } catch (err) {
    if (err instanceof Error) {
      badRequest(res, err.message);
      return;
    }
    badRequest(res, "Failed to update note");
  }
}

export async function deleteNote(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const deleted = await adminService.deleteNoteByIdAdmin(req.params.id);

    if (!deleted) {
      notFound(res, "Note not found");
      return;
    }

    success(res, { message: "Note deleted successfully" });
  } catch {
    badRequest(res, "Failed to delete note");
  }
}

export async function getStats(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const stats = await adminService.getAdminStats();
    success(res, stats);
  } catch {
    badRequest(res, "Failed to fetch stats");
  }
}