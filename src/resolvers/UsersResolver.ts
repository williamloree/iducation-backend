import { User } from "../entities/User";
import { Me, MutationResolvers, QueryResolvers } from "../generated/graphql";
import {
  comparePassword,
  createToken,
  hashPassword,
  randomToken,
  refreshAToken,
} from "../helpers/Misc";
import * as yup from "yup";
import { exceptionResolver } from "../helpers/Form";
import { GraphQLError } from "graphql";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppDataSource } from "../config/database";
import { logingRules } from "../rules/Login";
import { addUserRules } from "../rules/AddUser";
import { updateUserRules } from "../rules/UpdateUser";
import { TRole } from "../@types/role";

dayjs.extend(relativeTime);

const userRepository = AppDataSource.getRepository(User);

export const queries: QueryResolvers = {
  me: async (_, __, context) => {
    try {
      if (context.currentUser) {
        const me = {} as Me;
        me.user = context.currentUser;
        return me;
      } else {
        throw Error("User Not found");
      }
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  users: async (_, _input, _context) => {
    return await userRepository.find();
  },
  teachers: async (_, _input, _context) => {
    return await userRepository.find({ where: { role: "teacher" as TRole } });
  },
  teachersBySlug: async (_, { input }, _context) => {
    return await userRepository.findOneByOrFail({ slug: input.slug ?? "" });
  },
};

export const mutations: MutationResolvers = {
  login: async (_, { input }) => {
    try {
      const valuesValidated = await logingRules.validate(input, {
        abortEarly: false,
      });

      const user = await userRepository.findOneByOrFail({
        email: valuesValidated.email,
      });

      if (comparePassword(valuesValidated.password ?? "", user.password)) {
        const lastValidToken = user.lastValidToken();
        let refreshToken = user.validRefreshToken();
        await user.save();

        if (lastValidToken) {
          return lastValidToken;
        } else if (refreshToken) {
          refreshToken = refreshAToken(refreshToken);
          await refreshToken.save();
          return refreshToken;
        } else {
          const token = createToken(user, true);
          await token.save();
          return token;
        }
      } else {
        throw new GraphQLError("Mot de passe incorrect", {
          extensions: {
            validation: {
              password: ["Mot de passe incorrect"],
            },
          },
        });
      }
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  addUser: async (_, { input }) => {
    try {
      const valuesValidated = await addUserRules.validate(input, {
        abortEarly: false,
      });

      const user = new User();
      user.email = valuesValidated.email!;
      user.password = hashPassword(valuesValidated.password || "");
      user.information = valuesValidated.information;

      user.passwordToken = randomToken();
      let passExpireDate = new Date();
      passExpireDate.setDate(passExpireDate.getDate() + 7);
      user.passwordTokenExpiration = passExpireDate;

      await user.save();

      return user;
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  updateAuth: async (_, { input }, context) => {
    try {
      const rules = yup.object({
        actualPassword: yup.string().required(),
        password: yup.string().required(),
        confirmPassword: yup
          .string()
          .oneOf(
            [yup.ref("password"), null],
            "Les mots de passe ne correspondent pas."
          )
          .required(),
      });

      const valuesValidated = await rules.validate(input, {
        abortEarly: false,
      });

      const user = await userRepository.findOneByOrFail({
        id: context.currentUser?.id,
      });

      if (!comparePassword(valuesValidated.actualPassword, user.password)) {
        return false;
      }

      user.password = hashPassword(valuesValidated.password);
      await user.save();

      return true;
    } catch (e) {
      console.error("error while update auth password: ", e);
      return false;
    }
  },
  updateUser: async (_, { input }, context) => {
    try {
      const valuesValidated = await updateUserRules.validate(input, {
        abortEarly: false,
      });

      const user = await userRepository.findOneByOrFail({
        id: context.currentUser?.id,
      });

      user.email = valuesValidated.email;
      // TODO : faire un merge des informations
      await user.save();

      return user.email;
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  deleteUser: async (_, __, context) => {
    try {
      const user = await userRepository.findOneByOrFail({
        id: context.currentUser?.id,
      });
      await user.save();
      // TODO : envoyer un mail de confirmation
      /*
      await sendMail({
        sender: "mailer@wmsociety.fr",
        recipient: user.email,
        templateId: "deleteAccount",
        subject: "Confirmation de suppression de compte WMS Origine",
        text: "Nous avons bien enregistré la demande de suppression de compte WMS Origine. Sans aucune action de votre part d'ici 30 jours, votre compte sera définitivement supprimé.",
      });
      */
      return true;
    } catch (error) {
      throw exceptionResolver(error);
    }
  },
};
