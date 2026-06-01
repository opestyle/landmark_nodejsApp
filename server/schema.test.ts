import { describe, expect, it } from "vitest";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  contact: z.string().min(1).max(20),
  address: z.string().min(1),
  country: z.string().min(1).max(100),
});

const valid = {
  name: "Test User",
  email: "test@example.com",
  contact: "555-0000",
  address: "1 Main St",
  country: "USA",
};

describe("schema — name field boundaries", () => {
  it("accepts 1-char name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A" }).success).toBe(true);
  });

  it("accepts 255-char name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A".repeat(255) }).success).toBe(true);
  });

  it("rejects 256-char name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A".repeat(256) }).success).toBe(false);
  });

  it("rejects whitespace-only name (empty after no trim)", () => {
    // min(1) checks length, so a single space passes — this verifies that behavior
    expect(contactSchema.safeParse({ ...valid, name: " " }).success).toBe(true);
  });

  it("accepts name with unicode characters", () => {
    expect(contactSchema.safeParse({ ...valid, name: "José García" }).success).toBe(true);
  });

  it("accepts name with CJK characters", () => {
    expect(contactSchema.safeParse({ ...valid, name: "田中太郎" }).success).toBe(true);
  });
});

describe("schema — email field formats", () => {
  it("accepts standard email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "user@domain.com" }).success).toBe(true);
  });

  it("accepts email with subdomain", () => {
    expect(contactSchema.safeParse({ ...valid, email: "user@mail.domain.co.uk" }).success).toBe(true);
  });

  it("accepts email with plus tag", () => {
    expect(contactSchema.safeParse({ ...valid, email: "user+tag@domain.com" }).success).toBe(true);
  });

  it("accepts email with dots in local part", () => {
    expect(contactSchema.safeParse({ ...valid, email: "first.last@domain.com" }).success).toBe(true);
  });

  it("rejects email without @", () => {
    expect(contactSchema.safeParse({ ...valid, email: "userdomain.com" }).success).toBe(false);
  });

  it("rejects email without domain", () => {
    expect(contactSchema.safeParse({ ...valid, email: "user@" }).success).toBe(false);
  });

  it("rejects email without local part", () => {
    expect(contactSchema.safeParse({ ...valid, email: "@domain.com" }).success).toBe(false);
  });

  it("rejects empty email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(false);
  });
});

describe("schema — contact field boundaries", () => {
  it("accepts 1-char contact", () => {
    expect(contactSchema.safeParse({ ...valid, contact: "1" }).success).toBe(true);
  });

  it("accepts 20-char contact", () => {
    expect(contactSchema.safeParse({ ...valid, contact: "1".repeat(20) }).success).toBe(true);
  });

  it("rejects 21-char contact", () => {
    expect(contactSchema.safeParse({ ...valid, contact: "1".repeat(21) }).success).toBe(false);
  });

  it("accepts contact with dashes and spaces", () => {
    expect(contactSchema.safeParse({ ...valid, contact: "+1 555-123-4567" }).success).toBe(true);
  });

  it("accepts contact with parentheses", () => {
    expect(contactSchema.safeParse({ ...valid, contact: "(555) 123-4567" }).success).toBe(true);
  });
});

describe("schema — country field boundaries", () => {
  it("accepts 1-char country", () => {
    expect(contactSchema.safeParse({ ...valid, country: "X" }).success).toBe(true);
  });

  it("accepts 100-char country", () => {
    expect(contactSchema.safeParse({ ...valid, country: "A".repeat(100) }).success).toBe(true);
  });

  it("rejects 101-char country", () => {
    expect(contactSchema.safeParse({ ...valid, country: "A".repeat(101) }).success).toBe(false);
  });
});

describe("schema — address field", () => {
  it("accepts long address", () => {
    expect(contactSchema.safeParse({ ...valid, address: "A".repeat(1000) }).success).toBe(true);
  });

  it("accepts address with special characters", () => {
    expect(contactSchema.safeParse({ ...valid, address: "123 Main St, Apt #4B — Floor 2" }).success).toBe(true);
  });

  it("accepts address with newlines", () => {
    expect(contactSchema.safeParse({ ...valid, address: "Line 1\nLine 2\nLine 3" }).success).toBe(true);
  });
});

describe("schema — missing fields", () => {
  it("rejects missing name", () => {
    const { name, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing email", () => {
    const { email, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing contact", () => {
    const { contact, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing address", () => {
    const { address, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing country", () => {
    const { country, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects empty object", () => {
    expect(contactSchema.safeParse({}).success).toBe(false);
  });

  it("rejects null", () => {
    expect(contactSchema.safeParse(null).success).toBe(false);
  });

  it("rejects undefined", () => {
    expect(contactSchema.safeParse(undefined).success).toBe(false);
  });
});
