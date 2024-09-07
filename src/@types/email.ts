export interface IEmail {
  sender: string;
  recipient: string;
  templateId: string;
  subject: string;
  informations: { [key: string]: any };
}
