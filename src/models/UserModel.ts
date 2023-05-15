import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string): Promise<User> {
  // Create A New User and set their email and password hash
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Save the user to the repository
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserById(userID: string): Promise<User> {
  // Returns the requested user by their unique ID
  return await userRepository.findOne({ where: { userID } });
}

async function getUserByEmail(email: string): Promise<User> {
  // Returns the requested user by their email address
  return await userRepository.findOne({ where: { email } });
}

async function getAllUsers(): Promise<User[]> {
  // Returns an array of all the users that have been created
  return await userRepository.find();
}

async function updateUserEmail(newEmail: string, userID: string): Promise<void> {
  // Find the specific user by their unique ID
  const user = await getUserById(userID);

  // Update the user's email address
  user.email = newEmail;

  // Save the user to the repository
  await userRepository.save(user);
}

export { addUser, getUserById, getUserByEmail, getAllUsers, updateUserEmail };
