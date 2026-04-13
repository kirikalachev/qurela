import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/authenticate.js";
import * as notesService from "../services/notes.service.js";
import { success, created, badRequest, notFound } from "../utils/apiResponse.js";

const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

export async function getNotes(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const notes = await notesService.getNotesByUser(req.user!.userId);
    success(res, notes);
  } catch {
    badRequest(res, "Failed to fetch notes");
  }
}

export async function getNote(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const note = await notesService.getNoteById(req.params.id, req.user!.userId);

    if (!note) {
      notFound(res, "Note not found");
      return;
    }

    success(res, note);
  } catch {
    badRequest(res, "Failed to fetch note");
  }
}

export async function createNote(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const input = createNoteSchema.parse(req.body);
    const note = await notesService.createNote(req.user!.userId, input);

    created(res, note);
  } catch (err) {
    if (err instanceof Error) {
      badRequest(res, err.message);
      return;
    }
    badRequest(res, "Failed to create note");
  }
}

export async function updateNote(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const input = updateNoteSchema.parse(req.body);
    const note = await notesService.updateNote(req.params.id, req.user!.userId, input);

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
    const deleted = await notesService.deleteNote(req.params.id, req.user!.userId);

    if (!deleted) {
      notFound(res, "Note not found");
      return;
    }

    success(res, { message: "Note deleted successfully" });
  } catch {
    badRequest(res, "Failed to delete note");
  }
}