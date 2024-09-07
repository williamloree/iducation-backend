import { UserInputError } from "apollo-server-errors";
import { setLocale, ValidationError } from "yup";

export const parseFromErrors = (e: ValidationError) => {
  let errors = {};
  for (const item of e.inner) {
    if (item.path) {
      errors[item.path] = item.errors;
    }
  }

  return { validation: errors };
};

// export const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const exceptionResolver = (e: unknown) => {
  if (e instanceof ValidationError) {
    return new UserInputError("validation", parseFromErrors(e));
  } else {
    return e;
  }
};

// export const setErrorI18n = () => {
//   setLocale({
//     mixed: {
//       notType: function notType(_ref) {
//         switch (_ref.type) {
//           case "number":
//             return "Ce champ requiert un nombre";
//           case "string":
//             return "Ce champ requiert du texte";
//           default:
//             return "Ce champ est invalide";
//         }
//       },
//       required: "Veuillez saisir ce champ",
//     },
//     string: {
//       email: "Ce champ requiert un email",
//     },
//   });
// };
