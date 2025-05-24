# ✨ Hubsa2 ✨

## 📖 Descrição

Bem-vindo ao Hubsa2! 🎉 Este projeto é um sistema completo para gerenciar solicitações de forma eficiente, oferecendo interfaces intuitivas tanto para clientes quanto para administradores. Com o Hubsa2, você pode facilmente visualizar, criar e acompanhar o status das solicitações do início ao fim. 🚀

## 💻 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

*   ⚛️ React
*   ➡️ Next.js
*   📝 TypeScript
*   🎨 Tailwind CSS
*   ☁️ Supabase (para persistência de dados e autenticação segura)

## ⚙️ Instalação

Siga estes passos para configurar e rodar o Hubsa2 no seu ambiente local:

1.  Clone o repositório para a sua máquina:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <pasta_do_seu_projeto>
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    # ou, se preferir usar yarn:
    # yarn install
    ```

3.  Configure as variáveis de ambiente essenciais:
    Crie um arquivo chamado `.env.local` na pasta raiz do projeto e adicione suas chaves do Supabase (substitua os placeholders pelos seus valores reais):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=SUA_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
    ```

4.  Prepare seu banco de dados Supabase:
    Assegure-se de que a estrutura do banco de dados esteja pronta, incluindo as tabelas `requests`, `clients`, `users` e `request_comments` (verifique se a tabela de comentários ainda é relevante para o DB, mesmo após a remoção da UI). É crucial configurar as políticas de segurança (Row Level Security - RLS) corretamente para garantir que as operações de dados respeitem as permissões dos usuários.

## ▶️ Como Executar (Desenvolvimento Local)

Para iniciar a aplicação em modo de desenvolvimento, execute o comando:

```bash
npm run dev
# ou:
# yarn dev
```

A aplicação estará disponível no seu navegador através do endereço `http://localhost:3000` (ou a porta configurada, se for diferente). Alterações no código serão automaticamente recarregadas.

## ☁️ Deploy em VPS

Para fazer o deploy da aplicação em um servidor VPS, siga estes passos:

1.  **Construir a aplicação para produção:**
    No ambiente de produção (ou localmente antes de enviar para o VPS), execute o comando de build:
    ```bash
    npm run build
    # ou:
    # yarn build
    ```
    Este comando criará uma pasta `.next` (ou similar) com a versão otimizada para produção.

2.  **Transferir os arquivos para o VPS:**
    Copie os arquivos do projeto (incluindo a pasta `.next` gerada e o arquivo `.env.local` com as variáveis de ambiente de produção) para o seu servidor VPS. Você pode usar `scp` ou `rsync` para isso.

3.  **Instalar dependências no VPS:**
    No terminal do VPS, navegue até a pasta do projeto e instale as dependências (ignorando `devDependencies` para um ambiente de produção mais limpo):
    ```bash
    npm install --production
    # ou:
    # yarn install --production
    ```

4.  **Configurar variáveis de ambiente no VPS:**
    Certifique-se de que o arquivo `.env.local` (ou o método que você usa para gerenciar variáveis de ambiente no seu servidor, como variáveis de ambiente do sistema) esteja configurado corretamente com as chaves do Supabase e outras variáveis necessárias para o ambiente de produção.

5.  **Executar a aplicação em produção:**
    Use um gerenciador de processos como o PM2 para manter a aplicação rodando de forma confiável em segundo plano. Primeiro, instale o PM2 globalmente (se ainda não tiver):
    ```bash
    npm install -g pm2
    # ou:
    # yarn global add pm2
    ```
    Depois, inicie a aplicação:
    ```bash
    pm2 start npm --name "hubsa2" -- run start
    # ou:
    # pm2 start yarn --name "hubsa2" -- run start
    ```
    (`--name "hubsa2"` define um nome para o processo do PM2, facilitando o gerenciamento).

6.  **Configurar um proxy reverso (Recomendado):**
    Use um servidor web como Nginx ou Apache para atuar como proxy reverso para a aplicação Node.js rodando com PM2. Isso permite configurar um nome de domínio, gerenciar certificados SSL e servir arquivos estáticos de forma mais eficiente. (As instruções de configuração de Nginx/Apache variam e não estão detalhadas aqui).

Lembre-se de adaptar os caminhos e comandos conforme a sua configuração específica do VPS e o método de deploy.

## 🚀 Deploy na Vercel

A maneira mais rápida e fácil de fazer deploy do Hubsa2 é usando a Vercel. Siga estes passos:

1. **Crie uma conta na Vercel:**
   - Acesse [vercel.com](https://vercel.com) e crie uma conta (você pode fazer login com sua conta do GitHub)

2. **Importe seu projeto:**
   - No dashboard da Vercel, clique em "Add New Project"
   - Selecione o repositório "hubsa2betav1" da lista
   - A Vercel detectará automaticamente que é um projeto Next.js

3. **Configure as variáveis de ambiente:**
   - Na seção de configuração do projeto, adicione as seguintes variáveis de ambiente:
     ```
     NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
     ```

4. **Deploy:**
   - Clique em "Deploy"
   - A Vercel irá automaticamente construir e fazer deploy do seu projeto
   - Você receberá uma URL única para acessar sua aplicação (exemplo: `hubsa2betav1.vercel.app`)

5. **Configurações adicionais (opcional):**
   - Você pode configurar um domínio personalizado nas configurações do projeto
   - A Vercel oferece integração automática com o GitHub para deploy contínuo
   - Cada push para a branch main resultará em um novo deploy automático

## 📝 Uso

Explore as funcionalidades do Hubsa2:

*   **Página de Solicitações:** Visualize todas as solicitações (administradores) ou apenas as suas (clientes). 📊
*   **Detalhes da Solicitação:** Veja informações detalhadas e edite solicitações específicas (as permissões de edição dependem do seu perfil). 🔍
*   **Nova Solicitação:** Crie novas solicitações para iniciar o processo de trabalho. ✨

l
