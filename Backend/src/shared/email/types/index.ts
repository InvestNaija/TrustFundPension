export interface AttachmentData {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

export interface ISendEmailConfig {
  subject: string;
  to: string | Array<string>;
  template: string;
  templateData: Record<string, any>;
  attachments?: Array<AttachmentData>;
}
