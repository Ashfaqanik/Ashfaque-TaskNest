import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json", // Users should be seeded first as other models rely on them.
    "task.json", // Then, seed tasks
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  // Seed models in the correct order, considering foreign key constraints
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        // Handle base64 image for 'image' field if needed
        if (data.image && !data.image.startsWith("data:image")) {
          data.image = `data:image/png;base64,${data.image}`;
        }

        // Handle the user image separately by creating the Image first
        // if (modelName === "user" && data.image) {
        //   const image = await prisma.image.create({
        //     data: {
        //       data: Buffer.from(data.image.split(",")[1], "base64"), // Convert base64 to Bytes
        //       createdAt: new Date(),
        //     },
        //   });
        //   data.imageId = image.id; // Link the created image to the user
        //   delete data.image; // Remove the image field as it's now handled by imageId
        // }

        // Seed user-related models first (e.g., tasks, comments, attachments, etc.) after users are created
        if (modelName === "task" && data.assignedUserId) {
          // Ensure that the user reference exists before seeding tasks
          const userExists = await prisma.user.findUnique({
            where: { userId: data.assignedUserId },
          });
          if (!userExists) {
            console.error(
              `User with ID ${data.assignedUserId} not found for task.`
            );
            continue;
          }
        }

        if (modelName === "attachment" && data.taskId) {
          // Ensure that the task reference exists before seeding attachments
          const taskExists = await prisma.task.findUnique({
            where: { id: data.taskId },
          });
          if (!taskExists) {
            console.error(
              `Task with ID ${data.taskId} not found for attachment.`
            );
            continue;
          }
        }

        if (modelName === "comment" && data.taskId) {
          // Ensure that the task reference exists before seeding comments
          const taskExists = await prisma.task.findUnique({
            where: { id: data.taskId },
          });
          if (!taskExists) {
            console.error(`Task with ID ${data.taskId} not found for comment.`);
            continue;
          }
        }

        if (modelName === "taskAssignment" && data.taskId) {
          // Ensure that the task reference exists before seeding taskAssignments
          const taskExists = await prisma.task.findUnique({
            where: { id: data.taskId },
          });
          if (!taskExists) {
            console.error(
              `Task with ID ${data.taskId} not found for taskAssignment.`
            );
            continue;
          }
        }

        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
