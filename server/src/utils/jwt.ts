export function generateAccessToken(payload: any): string {
  return JSON.stringify(payload);
}

export function generateRefreshToken(payload: any): string {
  return JSON.stringify(payload);
}

export function verifyAccessToken(token: string): any {
  try {
    return JSON.parse(token);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return JSON.parse(token);
  } catch {
    return null;
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}