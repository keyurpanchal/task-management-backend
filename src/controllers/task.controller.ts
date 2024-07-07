import { Response } from "express";
import Task from "../models/task.model";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest";

// Create a new task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, dueDate, priority, status } = req.body;

  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    status,
    userId: req.user?._id,
  });

  try {
    const savedTask = await task.save();
    res.status(201).json({
      success: true,
      message: "Task created successfully"
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err
    });
  }
};

// Get all tasks for a user
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user?._id });

    res.json({
      success: true,
      message: "Tasks fetched successfully",
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
};

// Update a task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {

  const { title, description, dueDate, priority, status } = req.body;
  const taskId = req.params.taskId;
  console.log(taskId);
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { title, description, dueDate, priority, status } },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully"
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err 
    });
  }
};

// Delete a task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const taskId = req.params.taskId;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
