import * as yup from "yup";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

const userRepository = AppDataSource.getRepository(User);

export const logingRules = yup.object({
    email: yup
      .string()
      .email()
      .required()
      .test(
        "user-unknown",
        "Cet utilisateur n'existe pas",
        async (value, ctx) => {
          const regex: any = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
          if (value === "") {
            return ctx.createError({ message: "Veuillez saisir ce champ" });
          } else if (!regex.test(value)) {
            return ctx.createError({ message: "Email non valide" });
          } else {
            return (
              (await userRepository.count({ where: { email: value } })) !==
              0
            );
          }
        }
      ),
    password: yup.string(),
  });