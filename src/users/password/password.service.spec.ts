import { Test, TestingModule } from "@nestjs/testing";
import { PasswordService } from "./password.service";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should hash password", async () => {
    const mockHash = "hasedPassword";

    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = "Password!2";

    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it("should verify password", async () => {
    const mockCompareResult = true;

    (bcrypt.compare as jest.Mock).mockResolvedValue(mockCompareResult);
    const password = "Password!2";
    const hashedPassword = "hashedPassword";

    const result = await service.verify(password, hashedPassword);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(mockCompareResult);
  });

  it("should fail on incorrect password", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify("wrongPassword", "hashedPassword");
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword");
    expect(result).toBe(false);
  });
});
