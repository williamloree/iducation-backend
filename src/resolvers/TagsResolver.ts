import {QueryResolvers } from "../generated/graphql";

import { AppDataSource } from "../config/database";
import { Tag } from "../entities/Tag";
const tagsRepository = AppDataSource.getRepository(Tag);


export const queries: QueryResolvers = {
  tags: async (_, _input, _context) => {
    return await tagsRepository.find();
  },
};
