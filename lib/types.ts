export type TransactionType = "income" | "expense";

export type Category =
  | "Alimentação"
  | "Transporte"
  | "Moradia"
  | "Lazer"
  | "Saúde"
  | "Educação"
  | "Salário"
  | "Freelance"
  | "Outros";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: Category;
  created_at: string;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  date: string;
  type: TransactionType;
  category: Category;
}

export const EXPENSE_CATEGORIES: Category[] = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
];

export const INCOME_CATEGORIES: Category[] = ["Salário", "Freelance", "Outros"];

export const ALL_CATEGORIES: Category[] = [
  ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
];
