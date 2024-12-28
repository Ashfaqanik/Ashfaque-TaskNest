import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

  try {
    // Validating inputs
    if (!teamName || !productOwnerUserId || !projectManagerUserId) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    // Checking if users exist
    const productOwner = await prisma.user.findUnique({
      where: { userId: productOwnerUserId },
    });

    const projectManager = await prisma.user.findUnique({
      where: { userId: projectManagerUserId },
    });

    if (!productOwner) {
      res.status(404).json({ message: "Product Owner Id not found." });
      return;
    }

    if (!projectManager) {
      res.status(404).json({ message: "Project Manager Id not found." });
      return;
    }

    // Creating team
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });

    res
      .status(201)
      .json({ message: "Team created successfully.", team: newTeam });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};
