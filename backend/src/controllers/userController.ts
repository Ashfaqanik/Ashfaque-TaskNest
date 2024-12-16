import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// // User Login
// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !user.password)
//       res.status(404).json({ error: "User not found" });

//     // Compare passwords
//     const isValid = bcrypt.compare(
//       password as string,
//       user?.password as string
//     );
//     if (!isValid) res.status(401).json({ error: "Invalid credentials" });

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user?.userId },
//       process.env.JWT_SECRET || "my_task_nest",
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };
