export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  category: string;
  date: string;
}
