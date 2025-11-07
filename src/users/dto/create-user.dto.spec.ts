import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe("CreateUserDto", () => {
  const dto = new CreateUserDto();
  const validatePassword = async (password: string, message: string) => {
    dto.password = password; // no uppercase letter
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe("password");

    expect(errors[0].constraints).toHaveProperty("matches");

    expect(errors[0].constraints?.matches).toBe(message);
  };
  beforeEach(() => {
    dto.email = "task@gamil.com";
    dto.name = "task user";
    dto.password = "Password1@";
  });

  it("should validate complete valid data", async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("should invalidate wrong email", async () => {
    dto.email = "invalid-email";
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    console.log(errors);
    expect(errors[0].property).toBe("email");
    expect(errors[0].constraints).toHaveProperty("isEmail");
  });

  it("should invalidate password without uppercase letter", async () => {
    await validatePassword("password1@", "password must contain at least one uppercase letter");
  });
  it("should invalidate password without at least 1 lowercase letter", async () => {
    await validatePassword("123456A1@", "password must contain at least one lowercase letter");
  });
  it("should invalidate password without at least 1 special character", async () => {
    await validatePassword("123456A1a", "password must contain at least one special character");
  });
  it("should invalidate password without at least  least one number", async () => {
    await validatePassword("asdfe@A", "password must contain at least one number");
  });
});
