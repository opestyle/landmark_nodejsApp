import { describe, expect, it } from "vitest";
import { z } from "zod";

// Test the validation schema used in the contact form
const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  contact: z.string().min(1).max(20),
  address: z.string().min(1),
  country: z.string().min(1).max(100),
});

describe("contact form validation", () => {
  it("should accept valid contact data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      contact: "+1234567890",
      address: "123 Main St",
      country: "USA",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const invalidData = {
      name: "",
      email: "john@example.com",
      contact: "+1234567890",
      address: "123 Main St",
      country: "USA",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject invalid email", () => {
    const invalidData = {
      name: "John Doe",
      email: "invalid-email",
      contact: "+1234567890",
      address: "123 Main St",
      country: "USA",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject empty contact", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      contact: "",
      address: "123 Main St",
      country: "USA",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject empty address", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      contact: "+1234567890",
      address: "",
      country: "USA",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject empty country", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      contact: "+1234567890",
      address: "123 Main St",
      country: "",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject contact longer than 20 characters", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      contact: "+12345678901234567890123", // Too long
      address: "123 Main St",
      country: "USA",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept valid contact with various formats", () => {
    const validData = {
      name: "Jane Smith",
      email: "jane.smith@example.co.uk",
      contact: "555-123-4567",
      address: "456 Oak Avenue, Suite 100",
      country: "United Kingdom",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
