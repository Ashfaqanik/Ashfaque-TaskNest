import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
    image,
  } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points,
        projectId,
        authorUserId,
        assignedUserId,
        image,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
}; //);
//};
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.headers;
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};
export const postComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, taskId, userId, userName, image } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId,
        userId,
        userName,
        image,
      },
    });
    res.status(201).json(newComment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error posting comment: ${error.message}` });
  }
};

export const getTasksByPriority = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId, priority } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
        priority: { contains: priority as string, mode: "insensitive" },
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks by priority" });
  }
};
export const searchTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId, query } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
        title: { contains: query as string, mode: "insensitive" },
      },
    });

    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
