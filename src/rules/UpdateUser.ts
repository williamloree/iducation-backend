import * as yup from "yup";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

const userRepository = AppDataSource.getRepository(User);

export const updateUserRules = yup.object({
  tokenRegister: yup.string().required(),
  email: yup.string().required()
  .email()
  .test("email-conflict", "Cet email existe déjà", async function (value) {
    return (
      (await userRepository.count({
        where: { email: value },
      })) === 0
    );
  }),
});