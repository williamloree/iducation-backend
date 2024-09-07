import dayjs from "dayjs";
import * as bcrypt from "bcrypt";
import { User } from "../entities/User";
import { MoreThan } from "typeorm";
import { TRole } from "../@types/role";
import {Token} from '../entities/Token';

export function randomToken() {
  return require("crypto")
    .createHash("sha256")
    .update(Math.random().toString(36) + dayjs().unix())
    .digest("hex");
}

export const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const generateToken = () => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < 70; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export const getUserFromBearer = async (authToken: string) => {
  try {
    if (!authToken) {
      throw "empty AuthToken";
    }

    const token = await Token.findOneOrFail({
      relations: ["user"],
      where: { token: authToken, tokenRevokedAt: MoreThan(new Date()) },
    });

    return token.user;
  } catch (error) {
    return null;
  }
};

export const checkIsAdmin = async (userId: number) => {
  const crtUser = await User.findOneByOrFail({ id: userId });
  return crtUser.role === TRole.Admin;
};

// export async function currentUserPolicies(user: User): Promise<Policy[]> {
//   const policiesReturn = [] as Policy[];

//   const policyAbilities = [{ entity: "UserPolicy", abilities: ["create"] }];

//   for (const policy of policyAbilities) {
//     for (const ability of policy.abilities) {
//       let can = true;
//       try {
//         can = await policies[policy.entity][ability](user);
//       } catch (e) {
//         can = false;
//       }

//       policiesReturn.push({
//         entity: policy.entity
//           .substring(0, policy.entity.indexOf("Policy"))
//           .toLowerCase(),
//         ability,
//         can,
//       });
//     }
//   }
//   return policiesReturn;
// }

// export const can = async (
//   user: User,
//   ability: string,
//   entity: string | {},
//   options?: { [key: string]: any }
// ): Promise<boolean> => {
//   let can;
//   let entityFile = "";

//   try {
//     if (typeof entity === "string") {
//       entityFile = capitalizeFirstLetter(entity);

//       if (options && Object.keys(options).length) {
//         can = await policies[`${entityFile}Policy`][ability](user, options);
//       } else {
//         can = await policies[`${entityFile}Policy`][ability](user);
//       }
//     } else {
//       entityFile = entity.constructor.name;

//       if (options && Object.keys(options).length) {
//         can = await policies[`${entityFile}Policy`][ability](
//           user,
//           entity,
//           options
//         );
//       } else {
//         can = await policies[`${entityFile}Policy`][ability](user, entity);
//       }
//     }
//   } catch (error) {
//     can = false;
//   }
//   return can;
// };

export const createToken = (user: User, refresh: boolean) => {
  const token = new Token();
  token.userId = user.id;
  token.token = randomToken();
  let tokenExpireDate = new Date();
  tokenExpireDate.setDate(tokenExpireDate.getDate() + 1);
  token.tokenRevokedAt = tokenExpireDate;
  if (refresh) {
    token.refreshToken = randomToken();
    let refreshExpireDate = new Date();
    refreshExpireDate.setDate(refreshExpireDate.getDate() + 7);
    token.refreshRevokedAt = refreshExpireDate;
  }
  return token;
};

export const refreshAToken = (token: Token) => {
  token.token = randomToken();
  let tokenExpireDate = new Date();
  tokenExpireDate.setDate(tokenExpireDate.getDate() + 1);
  token.tokenRevokedAt = tokenExpireDate;
  let refreshExpireDate = new Date();
  refreshExpireDate.setDate(refreshExpireDate.getDate() + 7);
  token.refreshRevokedAt = refreshExpireDate;
  return token;
};
