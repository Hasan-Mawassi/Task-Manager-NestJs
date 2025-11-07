import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  public async verify(password: string, hashedPasswrod: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPasswrod);
  }
}
