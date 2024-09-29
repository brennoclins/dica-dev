# Dica Dev: Blog Tech

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Welcome to **Dica-Dev**! This is a tech blog with tips for software developers. The blog posts are generated from the issues in this project's GitHub repository.

## Technologies Used

- [Next.js](https://nextjs.org/): React framework for server-side rendering and static site generation.
- [Biome.js](https://biomejs.dev/): Tool for code linting and formatting.
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs): Utility-first CSS framework for rapid styling.
- [CSS Modules](): For local CSS scoping.
- [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript that adds static typing to the code.
- [Axios](https://axios-http.com/docs/intro#:~:text=What%20is%20Axios?%20Axios%20is%20a%20promise-based%20HTTP%20Client%20for): HTTP client for making requests to the GitHub API.
- [date-fns](https://date-fns.org/): Library for date manipulation and formatting.
- [API de Contexto do React](https://react.dev/reference/react/useContext): For global state management.
- [React Hook](https://react.dev/reference/react/hooks): For managing state and side effects in React.

## Features

- **Blog Posts**: The GitHub repository issues are used as blog posts. Each issue created in the repository becomes a new article on the blog.
- **Frontend Interface**: Built with Next.js, Tailwind CSS, and CSS Modules for a modern and responsive user experience.
- **GitHub API Requests**: Uses Axios to fetch all issues from the repository and display them as blog posts.

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/brennoclins/dica-dev.git
   ```

2. Install the dependencies:
    ```bash
    cd dica-dev
    npm install
    ```

3. Configure the environment variables: Create a .env.local file at the root of the project and add the following variables:
    ```bash
    NEXT_PUBLIC_GITHUB_USER=brennoclins
    NEXT_PUBLIC_GITHUB_REPO=dica-dev
    ```

4. Run the project:
    ```bash
    npm run dev
    ```

5. Access the project in the browser:
    ```bash
    http://localhost:3000
    ```

## Contribution
Contributions are welcome! Feel free to open issues and pull requests.


## Blog Link
- [Access the blog at: Dica-Dev](https://dica-dev.vercel.app/)