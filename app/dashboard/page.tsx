"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryChart } from "@/components/finance/category-chart";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const supabase = createClient();
      const from = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const to = `${year}-${month}-${lastDay}`;

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", from)
        .lte("date", to)
        .order("date", { ascending: false });

      setTransactions(data || []);
      setLoading(false);
    }

    fetchTransactions();
  }, [month, year]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const years = ["2023", "2024", "2025", "2026"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Resumo financeiro do período selecionado</p>
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={(v) => v && setMonth(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={(v) => v && setYear(v)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Receitas</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : formatBRL(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Despesas</CardTitle>
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {loading ? "..." : formatBRL(totalExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Saldo</CardTitle>
            <div className={`p-2 rounded-lg ${balance >= 0 ? "bg-blue-100" : "bg-orange-100"}`}>
              <Wallet className={`h-4 w-4 ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              {loading ? "..." : formatBRL(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Despesas por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                Carregando...
              </div>
            ) : (
              <CategoryChart transactions={transactions} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimas transações</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-slate-400 text-sm text-center py-8">Carregando...</div>
            ) : transactions.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-8">
                Nenhuma transação neste período.
                <br />
                <Link href="/transactions" className="text-blue-600 hover:underline">
                  Adicionar transação
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.category}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ml-4 shrink-0 ${
                        t.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}{formatBRL(Number(t.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
