# Dica Dev: Технический блог

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Добро пожаловать в **Dica-Dev**! Это технический блог с советами для разработчиков программного обеспечения. Сообщения в блоге генерируются из issues в репозитории GitHub этого проекта.

## Используемые технологии

- [Next.js](https://nextjs.org/): Фреймворк React для серверного рендеринга и генерации статических сайтов.
- [Biome.js](https://biomejs.dev/): Инструмент для линтинга и форматирования кода.
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs): FrУтилитарный CSS-фреймворк для быстрой стилизации.
- [CSS Modules](): Для локальной области видимости CSS.
- [TypeScript](https://www.typescriptlang.org/): Надстройка над JavaScript, добавляющая статическую типизацию кода.
- [Axios](https://axios-http.com/docs/intro#:~:text=What%20is%20Axios?%20Axios%20is%20a%20promise-based%20HTTP%20Client%20for): HTTP-клиент для выполнения запросов к API GitHub.
- [date-fns](https://date-fns.org/):  Библиотека для работы с датами и их форматирования.
- [API de Contexto do React](https://react.dev/reference/react/useContext): Для управления глобальным состоянием.
- [React Hook](https://react.dev/reference/react/hooks): Для управления состоянием и побочными эффектами в React.

## Функциональные возможности

- **Сообщения в блоге**: Issues из репозитория GitHub используются как сообщения в блоге. Каждое созданное issue в репозитории становится новой статьей в блоге.
- **Интерфейс Frontend**: Построен с использованием Next.js, Tailwind CSS и CSS Modules для современного и адаптивного пользовательского интерфейса.
- **Запросы к API GitHub**: Использует Axios для получения всех issues из репозитория и отображения их как сообщений в блоге.

## Как запустить проект

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/brennoclins/dica-dev.git
   ```

2. IУстановите зависимости:
    ```bash
    cd dica-dev
    npm install
    ```

3. Настройте переменные окружения: Создайте файл .env.local в корне проекта и добавьте следующие переменные:
    ```bash
    NEXT_PUBLIC_GITHUB_USER=brennoclins
    NEXT_PUBLIC_GITHUB_REPO=dica-dev
    ```

4. Запустите проект:
    ```bash
    npm run dev
    ```

5. Откройте проект в браузере:
    ```bash
    http://localhost:3000
    ```

## Вклад
Вклады приветствуются! Не стесняйтесь открывать issues и pull requests.


## Ссылка на блогg
- [Перейти к блогу: Dica-Dev](https://dica-dev.vercel.app/)