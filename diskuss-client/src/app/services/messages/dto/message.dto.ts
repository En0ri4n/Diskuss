export interface MessageDto {
  chatId: unknown; // The ID of the chat this message belongs to
  senderId: unknown; // The ID of the user who sent the message
  text: string; // The text content of the message

  attachments?: {
    type: string; // The type of the attachment (e.g., 'image', 'file')
    url: string; // The URL where the attachment can be accessed
  }[]; // Optional array of attachments
}
