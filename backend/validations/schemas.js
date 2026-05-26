import { z } from "zod";

// Schema for user registration
export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address format"),
  password: z.string()
    .min(1, "Password is required"),
});

// Schema for profile/settings updates
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters long").optional(),
  lastName: z.string().min(2, "Name must be at least 2 characters long").optional(),
  theme: z.enum(['light', 'dark', 'system'], { 
    errorMap: () => ({ message: "Theme must be 'light', 'dark', or 'system'" }) 
  }).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  // Add other fields as necessary based on your Profile model
}).strict(); // .strict() drops any extra fields not defined in the schema to prevent pollution
