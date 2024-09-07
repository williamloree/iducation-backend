import { User } from "../entities/User";

export interface Context {
  authToken?: string;
  currentUser?: User;
}
