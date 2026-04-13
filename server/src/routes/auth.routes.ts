import { Router } from "express";
import { prisma } from "../config/database.js";
import { hashPassword, verifyPassword } from "../auth.js";
import { badRequest, success, unauthorized } from "../utils/apiResponse.js";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authenticate.js";
import { Role } from "@prisma/client";

const router = Router();

// Login endpoint for NextAuth credentials provider
router.post("/credentials", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({ success: false, message: "Email and password required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Credentials login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Custom register endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      badRequest(res, "Email and password are required");
      return;
    }

    if (password.length < 8) {
      badRequest(res, "Password must be at least 8 characters");
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        badRequest(res, "Email already in use");
      } else {
        badRequest(res, "Username already in use");
      }
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
        name: username || email.split("@")[0],
        role: Role.USER,
      },
    });

    success(res, {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    });
  } catch (err) {
    console.error("Register error:", err);
    badRequest(res, "Registration failed");
  }
});

// Get current user endpoint
router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.authUser) {
      unauthorized(res, "User not found");
      return;
    }

    success(res, {
      id: req.authUser.id,
      email: req.authUser.email,
      username: req.authUser.username,
      name: req.authUser.name,
      role: req.authUser.role,
    });
  } catch (err) {
    badRequest(res, "Failed to get user");
  }
});

// Update username
router.put("/settings/username", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      badRequest(res, "Username must be at least 3 characters");
      return;
    }

    if (!req.authUser) {
      unauthorized(res, "User not found");
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        NOT: { id: req.authUser.id },
      },
    });

    if (existingUser) {
      badRequest(res, "Username already in use");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.authUser.id },
      data: { username: username.trim() },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
      },
    });

    success(res, updatedUser);
  } catch (err) {
    console.error("Update username error:", err);
    badRequest(res, "Failed to update username");
  }
});

// Update email
router.put("/settings/email", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      badRequest(res, "Valid email is required");
      return;
    }

    if (!req.authUser) {
      unauthorized(res, "User not found");
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        NOT: { id: req.authUser.id },
      },
    });

    if (existingUser) {
      badRequest(res, "Email already in use");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.authUser.id },
      data: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
      },
    });

    success(res, updatedUser);
  } catch (err) {
    console.error("Update email error:", err);
    badRequest(res, "Failed to update email");
  }
});

// Update password
router.put("/settings/password", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      badRequest(res, "Current and new password are required");
      return;
    }

    if (newPassword.length < 8) {
      badRequest(res, "New password must be at least 8 characters");
      return;
    }

    if (!req.authUser) {
      unauthorized(res, "User not found");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.authUser.id },
    });

    if (!user || !user.passwordHash) {
      badRequest(res, "User not found");
      return;
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      badRequest(res, "Current password is incorrect");
      return;
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.authUser.id },
      data: { passwordHash },
    });

    success(res, { message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    badRequest(res, "Failed to update password");
  }
});

export default router;