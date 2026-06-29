"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Transaction,
  TransactionFormData,
  TransactionType,
  Category,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingTransaction?: Transaction | null;
}

const emptyForm: TransactionFormData = {
  description: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  type: "expense",
  category: "Alimentação",
};

export function TransactionModal({ open, onClose, onSaved, editingTransaction }: Props) {
  const [form, setForm] = useState<TransactionFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: String(editingTransaction.amount),
        date: editingTransaction.date,
        type: editingTransaction.type,
        category: editingTransaction.category,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingTransaction, open]);

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function setField<K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "type") {
        const cats = value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        if (!cats.includes(next.category as Category)) {
          next.category = cats[0];
        }
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const amount = parseFloat(form.amount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const payload = {
      description: form.description.trim(),
      amount,
      date: form.date,
      type: form.type,
      category: form.category,
    };

    let err;
    if (editingTransaction) {
      ({ error: err } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingTransaction.id));
    } else {
      ({ error: err } = await supabase.from("transactions").insert(payload));
    }

    setLoading(false);
    if (err) {
      setError("Erro ao salvar transação. Tente novamente.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Tipo */}
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setField("type", t)}
                    className={`py-2 rounded-md text-sm font-medium border transition-colors ${
                      form.type === t
                        ? t === "expense"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-green-500 text-white border-green-500"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t === "expense" ? "Despesa" : "Receita"}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Almoço, Salário..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                required
              />
            </div>

            {/* Valor */}
            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
                required
              />
            </div>

            {/* Data */}
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => v && setField("category", v as Category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : editingTransaction ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
