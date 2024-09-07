import { MutationResolvers, QueryResolvers } from "../generated/graphql";
import { exceptionResolver } from "../helpers/Form";

import { Course } from "../entities/Course";
import { Category } from "../entities/Category";

import { AppDataSource } from "../config/database";

import { addCourseRules } from "../rules/AddCourse";
import { updateCourseRules } from "../rules/UpdateCourse";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);
const courseRepository = AppDataSource.getRepository(Course);
const caregoriesRepository = AppDataSource.getRepository(Category);

export const queries: QueryResolvers = {
  courses: async (_, _input, _context) => {
    return await courseRepository.find({ where: { publish: true } });
  },
  coursesBySlug: async (_, { input }, _context) => {
    return await courseRepository.findOneByOrFail({ slug: input.slug ?? "" });
  },
  coursesByTeacher: async (_, { input }, _context) => {
    console.log("🚀 => coursesByTeacher: => input:", input);
    const user = await userRepository.findOneByOrFail({
      slug: input.slug ?? "",
    });
    console.log("🚀 => coursesByTeacher: => user:", user);
    const courses = await courseRepository.find({
      relations: { teacher: true },
    });
    console.log("🚀 => coursesByTeacher: => courses:", courses);
    return courses;
  },
  categories: async (_, _input, _context) => {
    const categories = await caregoriesRepository.find({
      relations: { courses: true },
    });
    return categories;
  },
};

export const mutations: MutationResolvers = {
  addCourse: async (_, { input }, context) => {
    const isTeacher = context.currentUser?.role === "teacher";
    if (!isTeacher) {
      throw new Error("You must be authenticated to perform this action");
    }
    try {
      const valuesValidated = await addCourseRules.validate(input, {
        abortEarly: false,
      });

      const categories = await Promise.all(
        valuesValidated.categories.map((category) => {
          return caregoriesRepository.findOneOrFail({
            where: { title: category.title },
          });
        })
      );

      const tags = await Promise.all(
        valuesValidated.tags.map((tag) => {
          return caregoriesRepository.findOneOrFail({
            where: { title: tag.title },
          });
        })
      );

      const user = await userRepository.findOneByOrFail({
        id: context.currentUser?.id,
      });
      const course = new Course();
      course.titre = valuesValidated.titre;
      course.description = valuesValidated.description;
      course.imageUrl = valuesValidated.imageUrl;
      course.intro = valuesValidated.intro;
      course.inscrits = valuesValidated.inscrits;
      course.price = valuesValidated.price;
      course.details = valuesValidated.details;
      course.lessons = valuesValidated.lessons;
      course.teacher = user;

      course.categories = categories;
      course.tags = tags;

      await course.save();

      return course;
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  updateCourse: async (_, { input }, _context) => {
    try {
      const valuesValidated = await updateCourseRules.validate(input, {
        abortEarly: false,
      });

      const course = await courseRepository.findOneByOrFail({
        id: valuesValidated.id,
      });

      // TODO : faire un merge des informations
      await course.save();
      return course;
    } catch (e) {
      throw exceptionResolver(e);
    }
  },
  deleteCourse: async (_, { input }, _context) => {
    try {
      const course = await courseRepository.findOneByOrFail({
        id: input.id,
      });

      await course.save();

      return true;
    } catch (error) {
      throw exceptionResolver(error);
    }
  },
};
