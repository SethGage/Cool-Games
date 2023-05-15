import argon2 from 'argon2';
import { Request, Response } from 'express';
import { addUser, getUserByEmail, updateUserEmail, getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;
  const user = await getUserByEmail(email);

  if (user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // Store the Hashed Password and not plain text password
    await addUser(email, passwordHash);
    res.sendStatus(200); // 200 OK
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

async function Login(req: Request, res: Response): Promise<void> {
  // Logs the user into the website
  const { email, password } = req.body as AuthRequest;
  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  // Store the Hashed password instead of normal string
  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Okay
}

async function LogOut(req: Request, res: Response): Promise<void> {
  // Logs the User out of the website
  await req.session.clearSession();
  res.sendStatus(200); // 200 Okay
}

async function UpdateEmail(req: Request, res: Response): Promise<void> {
  // Update the Users email address
  const { userID, email } = req.body as UserIDParam;

  const { isLoggedIn } = req.session;

  if (!isLoggedIn) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  // Get the User's account by their unique ID
  const user = await getUserById(userID);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now Update the User's email address
  try {
    await updateUserEmail(email, userID);
    res.sendStatus(200); // 200 Okay
  } catch (err) {
    // The email is already taken so let the user know
    console.error(err);
  }
}

export { registerUser, Login, LogOut, UpdateEmail };
