import * as yup from "yup";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

const userRepository = AppDataSource.getRepository(User);

export const addUserRules = yup.object({
  email: yup
    .string()
    .required()
    .email()
    .test("email-conflict", "Cet email existe déjà", async function (value) {
      return (
        (await userRepository.count({
          where: { email: value },
        })) === 0
      );
    }),
  password: yup.string(),
  information: yup.object({
    nom: yup.string().required(),
    prenom: yup.string().required(),
    slug: yup.string(),
    job: yup.string(),
    reseaux: yup.object(),
    bio: yup.string(),
    photoProfil: yup.string(),
  }),
});
