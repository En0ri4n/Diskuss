export interface CreateChatDto {
  _id: unknown;
  participants: string[]; // Array of user IDs or usernames
  name: string; // Name of the chat
}
