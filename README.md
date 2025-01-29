# bank.com.br

## Project's status: In Development

#### OBS.: This project has resulted in the publication of two articles on my profile in dev.to
   - [Idempotência: Melhorando a Resiliência de Seu Sistema - Parte I](https://dev.to/joelbrs/idempotencia-melhorando-a-resiliencia-de-seu-sistema-parte-i-1c99)
   - [Idempotência: Melhorando a Resiliência de Seu Sistema - Parte II](https://dev.to/joelbrs/idempotencia-melhorando-a-resiliencia-de-seu-sistema-parte-ii-4p6k)

### 📝 Table of Contents

- [Getting Started](#getting-started)
- [How to Run](#how-to-run)
- [Development](#development)
- [Funcionalities](#functionalities)
- [Screenshots](#screenshots)
- [Authors](#authors)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 📋 Prerequisites

Ensure you have the following installed:

- Git
- Node.js
- pnpm
- Docker

### 🔧 Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/joelbrs/bank.com.br
   ```

2. Navigate to the client project directory:

   ```sh
   cd ./bank.com.br
   ```

3. Set environment configuration file in the server and web folder inside app

4. Install dependencies:
   ```sh
   pnpm install
   ```

## ⚙️ How to Run

1. Start the development server:

   ```sh
   pnpm start:dev
   ```

2. Start the development web:

   ```sh
   pnpm dev
   ```

### 🛠️ Built With

- Web:

  - [React](https://reactjs.org/) - The library for building user interfaces
  - [TypeScript](https://www.typescriptlang.org/) - The programming language
  - [Vite](https://vitejs.dev/) - The build tool
  - [Relay](https://relay.dev/) - The GraphQL framework
  - [TailwindCSS](https://tailwindcss.com/) - The CSS framework

- Server:
  - [Node.js](https://nodejs.org/) - The runtime environment
  - [Koa](https://koajs.com/) - The web framework
  - [TypeScript](https://www.typescriptlang.org/) - The programming language
  - [GraphQL](https://graphql.org/) - The query language
  - [MongoDB](https://www.mongodb.com/) - The database
  - [Jest](https://jestjs.io/) - The tests

## 📋 Functionalities

1. **User Registration**: Allows a user to register using CPF, full name, e-mail and password.
2. **User Confirmation**: Confirms the user's account through a link sent to the registered email.
3. **User Login**: Allows user login using CPF and password or through an access link sent to the registered email (user's account should have be confirmed).
4. **Create Transaction**: Allows you to create a transaction with another user's account.
5. **Detail Transaction**: Allows you to detail a specific transaction that you've made.
6. **Recent Transactions**: Lists the 5 last transactions carried out by the user.
7. **Transaction Metrics**: Displays a graph with the transactions carried out monthly by the user, detailing how many were as a recipient and how many as a sender.

 
### 📷 Screenshots (Dashboard)
   ##### Dashboard without transactions made
![image](https://github.com/user-attachments/assets/339986b9-3b7c-49cb-a7b2-5355c37f0315)

   ##### Dashboard with transactions made
![image](https://github.com/user-attachments/assets/583a5adf-74e7-4d47-a9d9-1d0cb4cc0226)

   ##### Dashboard with transaction's graph
![image](https://github.com/user-attachments/assets/b0aae1c2-c273-4e21-b74d-ce6ef6476426)

   ##### Create Transaction Modal
![image](https://github.com/user-attachments/assets/2c2743a8-5513-4378-8765-0ea4ba47266e)

   ##### Resume Transaction Modal
![image](https://github.com/user-attachments/assets/ac74519c-1f1f-4636-93ea-47f2d9983348)

## ✒️ Authors

- **Joel** - _Software Engineer_ - [GitHub](https://github.com/joelbrs), [Linkedin](https://linkedin.com/in/joelbrs)
