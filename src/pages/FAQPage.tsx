import { useState } from "react";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

const faqCategories = [
  {
    id: "pedidos",
    name: "Pedidos",
    icon: Package,
    questions: [
      {
        question: "Como faço para acompanhar meu pedido?",
        answer:
          "Você pode acompanhar seu pedido em tempo real acessando 'Meus Pedidos' no seu perfil. Lá você encontrará o status atualizado, previsão de entrega e histórico de rastreamento completo.",
      },
      {
        question: "Posso cancelar meu pedido?",
        answer:
          "Sim, você pode cancelar pedidos que ainda estejam com status 'Pendente' ou 'Em processamento'. Após o envio, não é possível cancelar, mas você pode solicitar a devolução após o recebimento.",
      },
      {
        question: "Qual o prazo para receber meu pedido?",
        answer:
          "O prazo de entrega varia de acordo com sua região e o método de envio escolhido. Em geral, entregas para capitais levam de 3 a 5 dias úteis, e para outras regiões de 5 a 10 dias úteis.",
      },
      {
        question: "Como alterar o endereço de entrega?",
        answer:
          "Se o pedido ainda não foi enviado, entre em contato com nosso suporte para solicitar a alteração. Após o envio, não é possível modificar o endereço de entrega.",
      },
    ],
  },
  {
    id: "pagamentos",
    name: "Pagamentos",
    icon: CreditCard,
    questions: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer:
          "Aceitamos cartões de crédito (Visa, Mastercard, Elo, American Express), cartão de débito, PIX, boleto bancário e pagamento na entrega em algumas regiões.",
      },
      {
        question: "É seguro comprar no site?",
        answer:
          "Sim! Utilizamos certificado SSL e criptografia de ponta a ponta para proteger seus dados. Todas as transações são processadas por gateways de pagamento certificados pelo PCI-DSS.",
      },
      {
        question: "Posso parcelar minhas compras?",
        answer:
          "Sim, oferecemos parcelamento em até 12x sem juros no cartão de crédito para compras acima de R$ 100. O parcelamento está sujeito à análise da operadora do cartão.",
      },
      {
        question: "Como funciona o pagamento via PIX?",
        answer:
          "Ao escolher PIX, você receberá um QR Code para pagamento. Após a confirmação (geralmente em segundos), seu pedido será processado automaticamente.",
      },
    ],
  },
  {
    id: "entregas",
    name: "Entregas",
    icon: Truck,
    questions: [
      {
        question: "Vocês entregam em todo o Brasil?",
        answer:
          "Sim, realizamos entregas em todo o território nacional. O frete e prazo são calculados automaticamente com base no seu CEP.",
      },
      {
        question: "Como é calculado o frete?",
        answer:
          "O frete é calculado com base no peso, dimensões dos produtos e distância até o endereço de entrega. Oferecemos frete grátis para compras acima de R$ 299.",
      },
      {
        question: "O que fazer se o pedido atrasar?",
        answer:
          "Se seu pedido ultrapassar o prazo estimado, entre em contato com nosso suporte. Investigaremos junto à transportadora e manteremos você informado.",
      },
      {
        question: "Posso agendar a entrega?",
        answer:
          "Atualmente não oferecemos agendamento de horário específico. A entrega é realizada em horário comercial, e você pode acompanhar a previsão pelo rastreamento.",
      },
    ],
  },
  {
    id: "trocas",
    name: "Trocas e Devoluções",
    icon: RotateCcw,
    questions: [
      {
        question: "Qual o prazo para trocar ou devolver?",
        answer:
          "Você tem até 7 dias após o recebimento para solicitar troca ou devolução por arrependimento (direito de arrependimento conforme CDC). Para defeitos, o prazo é de 30 dias.",
      },
      {
        question: "Como solicitar uma troca?",
        answer:
          "Acesse 'Meus Pedidos', selecione o pedido desejado e clique em 'Solicitar Troca'. Siga as instruções e nossa equipe entrará em contato em até 24 horas.",
      },
      {
        question: "O frete da devolução é pago?",
        answer:
          "Para devoluções por defeito ou erro nosso, o frete é por nossa conta. Em caso de arrependimento, o cliente arca com o custo do frete de retorno.",
      },
      {
        question: "Quando recebo o reembolso?",
        answer:
          "Após recebermos e conferirmos o produto, o reembolso é processado em até 5 dias úteis. O prazo para o crédito aparecer varia conforme o meio de pagamento original.",
      },
    ],
  },
  {
    id: "conta",
    name: "Conta e Segurança",
    icon: Shield,
    questions: [
      {
        question: "Como criar uma conta?",
        answer:
          "Clique em 'Entrar' no menu superior e depois em 'Criar conta'. Preencha seus dados e você receberá um email de confirmação para ativar sua conta.",
      },
      {
        question: "Esqueci minha senha, o que fazer?",
        answer:
          "Na página de login, clique em 'Esqueci minha senha'. Digite seu email cadastrado e você receberá um link para criar uma nova senha.",
      },
      {
        question: "Como alterar meus dados cadastrais?",
        answer:
          "Acesse seu perfil clicando no ícone do usuário e depois em 'Meu Perfil'. Lá você pode editar suas informações pessoais, endereços e preferências.",
      },
      {
        question: "Meus dados estão seguros?",
        answer:
          "Sim! Seguimos a LGPD (Lei Geral de Proteção de Dados) e utilizamos as melhores práticas de segurança para proteger suas informações pessoais.",
      },
    ],
  },
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.questions.length > 0 &&
        (!selectedCategory || category.id === selectedCategory)
    );

  const totalQuestions = faqCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">Suporte</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-4">
            Central de <span className="text-gradient">Ajuda.</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto mb-8">
            Encontre respostas rápidas para as dúvidas mais comuns sobre pedidos, pagamentos e entregas.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-full bg-secondary/30 border-border/30 focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === null ? "bg-primary text-primary-foreground" : "border border-border/30 text-muted-foreground hover:text-foreground"}`}
            >
              Todas ({totalQuestions})
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "border border-border/30 text-muted-foreground hover:text-foreground"}`}
              >
                <cat.icon className="h-3 w-3" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-6 mb-16">
          {filteredCategories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <category.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-display font-bold text-base text-foreground">{category.name}</span>
                <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-2 py-0.5">{category.questions.length}</span>
              </div>
              <div className="px-6">
                <Accordion type="single" collapsible>
                  {category.questions.map((q, i) => (
                    <AccordionItem key={i} value={`${category.id}-${i}`} className="border-border/10">
                      <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary py-4">
                        {q.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {q.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="rounded-2xl border border-border/20 bg-card/40 py-16 text-center">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-foreground mb-1">Nenhum resultado</p>
              <p className="text-sm text-muted-foreground">Tente buscar com outras palavras.</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/8 rounded-full blur-[60px]" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">Ainda tem dúvidas?</p>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-foreground mb-2">
              Nossa equipe está pronta.
            </h2>
            <p className="text-muted-foreground text-sm mb-8">Especialistas em nutrição e fitness disponíveis 24h.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: MessageCircle, title: "Chat ao Vivo", sub: "Resposta em minutos" },
                { icon: Phone, title: "0800 123 4567", sub: "Seg–Sex, 8h–18h" },
                { icon: Mail, title: "suporte@vitalzone.com", sub: "Resposta em 24h" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="rounded-xl border border-border/20 bg-background/40 p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="font-semibold text-sm text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
