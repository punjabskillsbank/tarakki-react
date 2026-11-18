export type SupportTicketData = {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  issueCategory: string;
  issueType: string;
  message: string;
};
export type SupportTicketMessageData = {
  ticketId: string;
  userId: string;
  messageBody: string;
};

export type SupportTicket = {
  ticketId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  issueCategory: string;
  issueType: string;
  message: string;
  ticketStatus: string;
  createdAt: string;
  updatedAt: string;
};
