import fetch from "node-fetch";
import { IEmail } from "../@types/email";

export const sendMail = async (mailObject: IEmail) => {
  try {
    const res = await fetch(`http://185.163.127.138:3000/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...mailObject }),
    });
    if (!res.ok) {
      return console.error("erreur serveur: ", res);
    }
    const data = await res.text();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};
