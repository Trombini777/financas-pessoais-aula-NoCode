import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, Shield, Download } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">FinançasApp</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar conta grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Controle suas finanças
          <br />
          <span className="text-blue-600">de forma simples</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Registre receitas e despesas, visualize gráficos por categoria e mantenha
          suas finanças pessoais sempre organizadas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Começar agora — é grátis
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Visual</h3>
            <p className="text-slate-600">
              Veja receitas, despesas e saldo do mês em cards resumo com atualização em tempo real.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Gráficos por Categoria</h3>
            <p className="text-slate-600">
              Entenda para onde vai seu dinheiro com gráficos de pizza por categoria de gastos.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Exportar CSV</h3>
            <p className="text-slate-600">
              Exporte suas transações filtradas para planilha com um clique e analise onde quiser.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl p-8 shadow-sm border flex flex-col md:flex-row items-center gap-6">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center shrink-0">
            <Shield className="h-8 w-8 text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Seus dados são só seus
            </h3>
            <p className="text-slate-600">
              Cada usuário acessa apenas suas próprias transações. Autenticação segura via Supabase
              com isolamento de dados por Row Level Security.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          FinançasApp — Projeto de aula de finanças pessoais
        </div>
      </footer>
    </div>
  );
}
