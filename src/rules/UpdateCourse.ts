import * as yup from "yup";

export const updateCourseRules = yup.object({
  id: yup.number().required(),
  titre: yup.string(),
  description: yup.string(),
  imageUrl: yup.string(),
  intro: yup.string(),
  inscrits: yup.number(),
  price: yup.object({
    currency: yup.string(),
    amount: yup.number(),
  }),
  details: yup.object({
    duration: yup.string(),
    level: yup.string(),
  }),
  categories: yup.array(
    yup.object({
      title: yup.string(),
      color: yup.string(),
    })
  ),
  lessons: yup.array(
    yup.object({
      title: yup.string(),
      content: yup.string(),
      duration: yup.number(),
      videoUrl: yup.string(),
      attachements: yup.array(yup.string()),
    })
  ),
});
