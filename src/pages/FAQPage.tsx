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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais frequentes ou entre em contato
            com nossa equipe de suporte.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg glass"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas ({totalQuestions})
            </Button>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name} ({category.questions.length})
                </Button>
              );
            })}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {category.name}
                    <Badge variant="secondary">{category.questions.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((q, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {q.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {q.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}

          {filteredCategories.length === 0 && (
            <Card className="glass">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente buscar com outras palavras ou entre em contato conosco.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="glass bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-8">
              <div className="text-center mb-8">
                <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ainda tem dúvidas?</h2>
                <p className="text-muted-foreground">
                  Nossa equipe está pronta para ajudar você!
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <MessageCircle className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Atendimento 24h
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Phone className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Telefone</h3>
                  <p className="text-sm text-muted-foreground">
                    0800 123 4567
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Mail className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    suporte@loja.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
