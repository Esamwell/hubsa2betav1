import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Settings,
  CheckCircle,
  FileText,
  Link,
  Lock,
  User,
  HelpCircle
} from 'lucide-react';

const HelpCenterPage = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleCardClick = (guideId: string) => {
    setOpenDialog(guideId);
  };

  const renderGuideContent = (guideId: string) => {
    switch (guideId) {
      case 'dashboard-guide':
        return (
          <div>
            <DialogTitle>Entendendo seu Dashboard</DialogTitle>
            <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>
                Esta é a sua página inicial no sistema. Aqui você pode visualizar um resumo das suas atividades, solicitações ativas e próximos compromissos.
              </p>
              <p>
                O dashboard é dividido em seções para facilitar o acompanhamento:
              </p>
              <ul className="list-none space-y-3 pl-0">
                <li className="flex items-start">
                  <ListTodo className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Minhas Solicitações Ativas:</strong> Veja rapidamente quantas solicitações estão em andamento ou pendentes.
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                   <div>
                    <strong>Solicitações Concluídas este Mês:</strong> Acompanhe o número de solicitações finalizadas no período atual.
                  </div>
                </li>
                <li className="flex items-start">
                  <CalendarDays className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Próximos Eventos/Compromissos:</strong> Fique de olho em prazos importantes e agendamentos relacionados às suas solicitações.
                  </div>
                </li>
                {/* Adicionar mais pontos relevantes do dashboard do cliente */}
              </ul>
            </div>
          </div>
        );
      case 'solicitacoes-guide':
        return (
          <div>
            <DialogTitle>Como Criar uma Nova Solicitação</DialogTitle>
            <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>
                Para solicitar um novo serviço ou reportar uma questão, siga os passos abaixo:
              </p>
              <ol className="list-none space-y-4 pl-0">
                <li className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                  <span className="mr-3 flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">1.</span>
                  <div>
                    <strong>Acesse a Seção de Solicitações.</strong> No menu lateral, clique em "Solicitações". Alternativamente, pode haver um atalho rápido no seu Dashboard.
                  </div>
                </li>
                <li className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                   <span className="mr-3 flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">2.</span>
                  <div>
                    <strong>Inicie uma Nova Solicitação.</strong> Procure por um botão como "Nova Solicitação" ou "Criar Pedido" e clique nele.
                  </div>
                </li>
                <li className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                   <span className="mr-3 flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">3.</span>
                   <div>
                    <strong>Preencha os Detalhes.</strong> No formulário que aparecerá, descreva sua necessidade com o máximo de detalhes possível. Seja claro e forneça todas as informações relevantes.
                  </div>
                </li>
                <li className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                   <span className="mr-3 flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">4.</span>
                  <div>
                     <strong>Compartilhe Arquivos (se necessário).</strong> Se precisar compartilhar documentos, imagens ou outros arquivos, adicione-os em um serviço de armazenamento em nuvem (como Google Drive, Dropbox, etc.) e inclua o link para acesso na descrição da sua solicitação. Certifique-se de que o link está configurado para compartilhamento correto. <Link className="w-4 h-4 inline-block ml-1 text-blue-500" />
                  </div>
                </li>
                <li className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                   <span className="mr-3 flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">5.</span>
                   <div>
                    <strong>Revise e Envie.</strong> Antes de finalizar, revise todas as informações preenchidas e o link dos arquivos (se aplicável) para garantir que estão corretos. Em seguida, clique no botão "Enviar Solicitação". <CheckCircle className="w-4 h-4 inline-block ml-1 text-green-500" />
                  </div>
                </li>
              </ol>
              <p>
                Após o envio, você poderá acompanhar o status da sua solicitação na seção "Minhas Solicitações".
              </p>
            </div>
          </div>
        );
      case 'calendario-guide':
        return (
          <div>
            <DialogTitle>Utilizando o Calendário</DialogTitle>
            <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>
                A página Calendário é sua ferramenta para visualizar e gerenciar compromissos e prazos importantes relacionados às suas solicitações e projetos.
              </p>
               <ul className="list-none space-y-3 pl-0">
                <li className="flex items-start">
                  <CalendarDays className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                   <div>
                    <strong>Visualização:</strong> Veja seus eventos organizados por dia, semana ou mês.
                  </div>
                </li>
                <li className="flex items-start">
                   <FileText className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                   <div>
                    <strong>Detalhes do Evento:</strong> Clique em um evento para ver mais detalhes, como título e data de vencimento da solicitação associada.
                  </div>
                </li>
                <li className="flex items-start">
                  <CalendarDays className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Prazos:</strong> Fique atento aos prazos finais das suas solicitações, que estarão marcados no calendário.
                  </div>
                </li>
                {/* Adicionar mais dicas sobre o calendário */}
              </ul>
            </div>
          </div>
        );
      case 'configuracoes-guide':
        return (
          <div>
            <DialogTitle>Gerenciando suas Configurações</DialogTitle>
            <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>
                A página de Configurações permite que você personalize sua experiência e mantenha suas informações atualizadas.
              </p>
               <ul className="list-none space-y-3 pl-0">
                <li className="flex items-start">
                  <User className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Perfil:</strong> Atualize seus dados pessoais, como nome, e-mail e telefone.
                  </div>
                </li>
                <li className="flex items-start">
                   <Lock className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                   <div>
                    <strong>Segurança:</strong> Altere sua senha para manter sua conta segura.
                  </div>
                </li>
                <li className="flex items-start">
                   <Settings className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Preferências:</strong> Ajuste configurações como tema da interface (claro/escuro).
                  </div>
                </li>
                {/* Detalhar outras opções de configuração */}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Central de Ajuda
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
        Bem-vindo à Central de Ajuda! Aqui você encontra guias e informações para aproveitar ao máximo o sistema.
      </p>

      {/* Seção de Categorias */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Dashboard */}
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer h-full"
              >
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                  {/* Ícone Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Dashboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Entenda a visão geral do sistema.</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              {renderGuideContent('dashboard-guide')}
            </DialogContent>
          </Dialog>

          {/* Card: Solicitações */}
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer h-full"
              >
                 <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 mb-4">
                  {/* Ícone Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Solicitações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Como criar e acompanhar suas solicitações.</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              {renderGuideContent('solicitacoes-guide')}
            </DialogContent>
          </Dialog>

          {/* Card: Calendário */}
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer h-full"
              >
                 <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 mb-4">
                  {/* Ícone Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Calendário</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visualize seus compromissos e prazos.</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              {renderGuideContent('calendario-guide')}
            </DialogContent>
          </Dialog>

          {/* Card: Configurações */}
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer h-full"
              >
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 mb-4">
                  {/* Ícone Placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Configurações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ajuste suas preferências e perfil.</p>
              </div>
            </DialogTrigger>
             <DialogContent>
              {renderGuideContent('configuracoes-guide')}
            </DialogContent>
          </Dialog>

          {/* Adicione mais categorias aqui, se necessário */}
        </div>
      </div>

      {/* Seção de Perguntas Frequentes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {/* FAQ 1 */}
          <AccordionItem value="faq-1">
            <AccordionTrigger className="font-medium text-gray-800 dark:text-white hover:no-underline text-left">Como visualizo o status da minha solicitação?</AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed p-3 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3 flex items-start">
              <ListTodo className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span>
                Você pode visualizar o status de todas as suas solicitações na página "Solicitações". Cada solicitação terá um indicador de status (pendente, em andamento, concluído, cancelado).
              </span>
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 2 */}
          <AccordionItem value="faq-2">
            <AccordionTrigger className="font-medium text-gray-800 dark:text-white hover:no-underline text-left">Posso anexar arquivos à minha solicitação?</AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed p-3 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3 flex items-start">
              <Link className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span>
                Atualmente, a funcionalidade de anexar arquivos diretamente ainda não está disponível. Para compartilhar documentos, imagens ou outros arquivos, por favor, adicione-os em um serviço de armazenamento em nuvem (como Google Drive, Dropbox, etc.) e inclua o link para acesso na descrição da sua solicitação. Certifique-se de que o link esteja configurado corretamente para compartilhamento.
              </span>
            </AccordionContent>
          </AccordionItem>

           {/* FAQ 3 */}
          <AccordionItem value="faq-3">
            <AccordionTrigger className="font-medium text-gray-800 dark:text-white hover:no-underline text-left">Como faço para alterar minha senha?</AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed p-3 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3 flex items-start">
              <Lock className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span>
                Você pode alterar sua senha na página "Configurações". Procure pela seção de segurança ou informações de login.
              </span>
            </AccordionContent>
          </AccordionItem>

          {/* Adicione mais FAQs aqui */}
        </Accordion>
      </div>

       {/* Renderiza o diálogo com base no estado */}
       <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
         <DialogContent className="sm:max-w-[400px]">
           {renderGuideContent(openDialog || '')}
         </DialogContent>
       </Dialog>

    </div>
  );
};

export default HelpCenterPage; 