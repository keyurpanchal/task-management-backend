import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";

// Register
export const register = async (req: Request, res: Response) => {
  const { name, email, password, city, phone } = req.body;

  // Check if user already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Email is already registered"
      });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    city,
    phone,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({
      sucess: true,
      message: "User registered successfully"
    });
  } catch (err) {
    res.status(400).json({ message: err  });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ 
      sucess: false,
      message: "Invalid credentials"
    });
  }

  // Check if password is correct
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, config.secret);
  res.json({
    success: true,
    message: 'Login successful',
    token: token
  });

};
