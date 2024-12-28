import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
// Retrieving all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

// Retrieving a single user by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(id),
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// User Registration
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password, image, teamId, role } = req.body;

  try {
    // Checking if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "Email is already registered." });
      return;
    }

    //Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image,
        teamId,
        role,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error: any) {
    if (error.code === "P2003") {
      // Handling foreign key constraint violation
      res.status(400).json({
        message: "Invalid team ID. Please provide a valid team ID.",
      });
    } else {
      // Handling other errors
      res
        .status(500)
        .json({ message: `Error registering user: ${error.message}` });
    }
  }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Checking if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Verifying the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // Generating JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || "my_task_nest",
      { expiresIn: "8h" }
    );

    res.json({ id: user.userId, token: token });
  } catch (error: any) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Updating user details
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { username, email, image, teamId, role } = req.body;

  try {
    // Checking if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        userId: Number(id),
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        userId: Number(id),
      },
      data: {
        username: username || existingUser.username,
        email: email || existingUser.email,
        teamId: teamId || existingUser.teamId,
        image: image || existingUser.image,
        role: role || existingUser.role,
      },
    });

    res.json({
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating user details: ${error.message}` });
  }
};
