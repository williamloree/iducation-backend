import * as yup from "yup";

export const emailSenderRules = yup.object({
  sender: yup.string().required(),
  subject: yup.string().required(),
  content: yup.string().required(),
  use: yup.string().required(),
  tokenRegister: yup.string().required(),
});
