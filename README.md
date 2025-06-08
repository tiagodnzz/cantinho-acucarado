# Cantinho Açucarado

Projeto de site institucional e painel administrativo para o Cantinho Açucarado, desenvolvido para divulgação, contato e gestão de mensagens e avaliações de clientes.

## Tecnologias e Bibliotecas Utilizadas

- **Frontend**
  - HTML5, CSS3, JavaScript (ES6)
  - [Bootstrap 5](https://getbootstrap.com/) (layout responsivo e componentes)
  - [Bootstrap Icons](https://icons.getbootstrap.com/)
  - [Font Awesome 6](https://fontawesome.com/)
  - [SwiperJS](https://swiperjs.com/) (carrosséis e sliders)
  - [Fancybox](https://fancyapps.com/fancybox/) (galeria de imagens)
  - Google Maps API (exibição de mapa de localização)

- **Backend/Serviços**
  - [Firebase](https://firebase.google.com/)
    - Firebase Hosting (hospedagem do site)
    - Firebase Authentication (autenticação de usuários do painel admin)
    - Firebase Firestore (banco de dados para mensagens, avaliações e analytics)

- **Outras Bibliotecas**
  - Chart.js (gráficos no dashboard admin)

## Estrutura de Pastas

```
public/
  assets/
    css/         # Arquivos de estilos (admin.css, auth.css, home.css)
    imgs/        # Imagens do site (logo, produtos, equipe, etc)
    js/          # Scripts JS organizados por módulos, serviços, UI e privados (admin)
    videos/      # Vídeos usados no site
  pages/
    admin/       # Páginas do painel administrativo (dashboard, mensagens, avaliações)
      components/  # Componentes reutilizáveis do admin (sidebar, navbar, loader)
    auth/        # Página de login administrativo
    home/        # Página principal do site
  404.html       # Página de erro personalizada
  favicon.png    # Ícone do site
firebase.json    # Configuração do Firebase Hosting
.firebaserc      # Projeto padrão do Firebase
```

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (opcional, apenas para instalar o Firebase CLI)
- [Firebase CLI](https://firebase.google.com/docs/cli) instalada globalmente:
  ```sh
  npm install -g firebase-tools
  ```

### Passos

1. **Clone o repositório**
   ```sh
   git clone <url-do-repositorio>
   cd cantinho-acucarado
   ```

2. **Instale as dependências do Firebase (se necessário)**
   O projeto não depende de pacotes npm para rodar o frontend, mas para deploy local ou em produção, use o Firebase CLI.

3. **Faça login no Firebase**
   ```sh
   firebase login
   ```

4. **Inicie o servidor local**
   ```sh
   firebase serve
   ```
   ou (Recomendado)
   ```sh
   firebase emulators:start 
   ```
   O site estará disponível em `http://localhost:5000`.

5. **Deploy para produção**
   ```sh
   firebase deploy
   ```

### Observações

- O painel administrativo requer autenticação via Firebase Authentication.
- As mensagens, avaliações e analytics são salvos no Firestore.
- O site é totalmente estático, hospedado no Firebase Hosting.
- As rotas amigáveis são gerenciadas pelo `firebase.json` usando rewrites.

## Deploy Automático (CI/CD)

Este projeto utiliza **GitHub Actions** para realizar o deploy automático no Firebase Hosting sempre que há um push na branch `main` ou quando é aberto um Pull Request.

- Ao fazer um **push** na branch `main`, o workflow `.github/workflows/firebase-hosting-merge.yml` é executado e publica automaticamente o site em produção no Firebase Hosting.
- Ao abrir um **Pull Request**, o workflow `.github/workflows/firebase-hosting-pull-request.yml` gera uma prévia do site para revisão.

Os arquivos de configuração dos pipelines estão em:
- [.github/workflows/firebase-hosting-merge.yml](.github/workflows/firebase-hosting-merge.yml)
- [.github/workflows/firebase-hosting-pull-request.yml](.github/workflows/firebase-hosting-pull-request.yml)

**Resumo do fluxo:**
1. O código é enviado para o GitHub.
2. O GitHub Actions executa o deploy automático no Firebase Hosting.
3. O site é atualizado automaticamente sem necessidade de comandos manuais.

Para mais detalhes, consulte a documentação do [Firebase Hosting CI/CD](https://firebase.google.com/docs/hosting/github-integration).

## Funcionalidades

O projeto Cantinho Açucarado oferece as seguintes funcionalidades:

- **Site institucional**
  - Apresentação da empresa, missão e valores
  - Exibição de produtos e serviços oferecidos
  - Seção sobre a equipe
  - Galeria de fotos e vídeos de eventos
  - Mapa de localização com Google Maps
  - Formulário de contato para envio de mensagens e avaliações

- **Botão flutuante do WhatsApp**
  - Acesso rápido ao WhatsApp para contato direto com a empresa

- **Painel administrativo**
  - Login seguro com autenticação via Firebase Authentication
  - Dashboard com gráficos de analytics (visitas, mensagens, avaliações)
  - Visualização e gerenciamento de mensagens recebidas pelo site
  - Visualização e gerenciamento de avaliações de clientes

- **Consentimento de cookies**
  - Banner de consentimento para coleta de dados de analytics

- **Analytics customizado**
  - Rastreamento de pageviews e interações relevantes, armazenados no Firestore

- **Responsividade**
  - Layout adaptado para dispositivos móveis, tablets e desktops

- **Página de erro personalizada**
  - Página 404 customizada para navegação amigável

---

Desenvolvido com carinho por Tiago Diniz ❤️