export type Event = {
    id: number;
    organizerId: number;
    name: string;
    description?: string;
    location: string;
    date: Date;
    time: Date;
    ticketType: string;
    price: number;
    availableSeats: number;
    promotion?: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Review = {
    id: number;
    customerId: number;
    eventId: number;
    rating: number;
    reviewText: string;
    createdAt: Date;
  };
  
  export type Ticket = {
    id: number;
    eventId: number;
    customerId: number;
    transactionId: number;
    price: number;
    status: number;
    createdAt: Date;
  };
  
  export type Transaction = {
    id: number;
    customerId: number;
    eventId: number;
    totalAmount: number;
    promotionsId: number;
    paymentStatus: string;
    createdAt: Date;
  };
  
  export type Promotion = {
    id: number;
    eventId: number;
    code: string;
    discountAmount: number;
    usageLimit: number;
    validFrom: Date;
    validTo: Date;
    createdAt: Date;
  };
  
  export enum TicketType {
    Paid = "paid",
    Free = "free",
  }
  
  export enum PaymentStatus {
    Paid = "paid",
    Pending = "pending",
    Failed = "failed",
    Cancelled = "cancelled",
  }
  
  declare global {
    namespace Express {
      export interface Request {
        event?: Event;
        review?: Review;
        ticket?: Ticket;
        transaction?: Transaction;
        promotion?: Promotion;
      }
    }
  }
  