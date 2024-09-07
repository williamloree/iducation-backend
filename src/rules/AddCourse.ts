import * as yup from "yup";

export const addCourseRules = yup.object({
  titre: yup.string().required(),
  description: yup.string().required(),
  imageUrl: yup.string().required(),
  intro: yup.string().required(),
  inscrits: yup.number().required(),
  price: yup.object({
    regular: yup.number().required(),
    discount: yup.number().required(),
    free: yup.boolean().required(),
  }).required(),
  details: yup.object({
    lang: yup.string().required(),
    status: yup.string().required(),
    skill: yup.string().required(),
    why: yup.array(yup.string().required()).required()
  }).required(),
  categories: yup.array(
    yup.object({
      title: yup.string().required(),
      color: yup.string().required(),
    })
  ).required(),
  tags: yup.array(
    yup.object({
      title: yup.string().required(),
      color: yup.string().required(),
    })
  ).required(),
  lessons: yup.array(
    yup.object({
      title: yup.string().required(),
      content: yup.string().required(),
      duration: yup.number().required(),
      videoUrl: yup.string().required(),
      attachements: yup.array(yup.string().required()).required(),
    })
  ).required(),
});
