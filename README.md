# bank.com.br

## Project's status: In Development

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

 
### 📷 Screenshots
   ##### Dashboard Page (without transactions made)
![image](https://github.com/user-attachments/assets/339986b9-3b7c-49cb-a7b2-5355c37f0315)

   ##### Dashboard Page (with transactions made)
![image](https://github.com/user-attachments/assets/2ce990a7-9b72-4c5d-87ec-27ea2c68ea00)

   ##### Dashboard Page (with transaction's graph)
![image](https://github.com/user-attachments/assets/195b0bd1-2f4f-486d-8828-1f5c4ea64dd1)

   ##### Create Transaction Modal
![image](https://github.com/user-attachments/assets/cf57be8c-963f-4ab8-967a-70f176208170)

   ##### Resume Transaction Modal
![image](https://github.com/user-attachments/assets/e282f683-958e-4c77-9546-cfbadd6038df)


## ✒️ Authors

- **Joel** - _Software Engineer_ - [GitHub](https://github.com/joelbrs), [Linkedin](https://linkedin.com/in/joelbrs)
