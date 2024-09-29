# Dica Dev: Blog Tech

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Bem-vindo ao **Dica-Dev**! Este é um blog tech com dicas para desenvolvedores de software. Os posts do blog são gerados a partir das issues do repositório GitHub deste projeto.

- [Don't speak Portuguese? Click and read the README in English](/README_US.md)
- [Не говорите по-португальски? Нажмите и прочитайте README на русском языке](/READEM_RU.md)
- [Non parli portoghese? Clicca e leggi il README in italiano](/README_IT.md)
- [不會說葡萄牙語？點擊並閱讀義大利語自述文件](/README_CN.md)


## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/): Framework React para renderização do lado do servidor e geração de sites estáticos.
- [Biome.js](https://biomejs.dev/): Ferramenta para linting e formatação de código.
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs): Framework CSS utilitário para estilização rápida e eficiente.
- [CSS Modules](): Para escopo local de CSS.
- [TypeScript](https://www.typescriptlang.org/): Superset de JavaScript que adiciona tipagem estática ao código.
- [Axios](https://axios-http.com/docs/intro#:~:text=What%20is%20Axios?%20Axios%20is%20a%20promise-based%20HTTP%20Client%20for): Cliente HTTP para fazer requisições à API do GitHub.
- [date-fns](https://date-fns.org/): Biblioteca para manipulação e formatação de datas.
- [API de Contexto do React](https://react.dev/reference/react/useContext): Para gerenciamento de estado global.
- [React Hook](https://react.dev/reference/react/hooks): Para gerenciar o estado e os efeitos colaterais no React.

## Funcionalidades

- **Posts do Blog**: As issues do repositório GitHub são usadas como posts do blog. Cada issue criada no repositório se torna um novo artigo no blog.
- **Interface Frontend**: Construída com Next.js, Tailwind CSS e CSS Modules para uma experiência de usuário moderna e responsiva.
- **Requisições à API do GitHub**: Utiliza Axios para buscar todas as issues do repositório e exibi-las como posts no blog.

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/brennoclins/dica-dev.git
   ```

2. Instale as dependências:
    ```bash
    cd dica-dev
    npm install
    ```

3. Configure as variáveis de ambiente: Crie um arquivo **.env.local** na raiz do projeto e adicione as seguintes variáveis:
    ```bash
    NEXT_PUBLIC_GITHUB_USER=brennoclins
    NEXT_PUBLIC_GITHUB_REPO=dica-dev
    ```

4. Execute o projeto:
    ```bash
    npm run dev
    ```

5. Acesse o projeto no navegador:
    ```bash
    http://localhost:3000
    ```

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.


## Link do Blog
- [Acesse o blog em: Dica-Dev](https://dica-dev.vercel.app/)