# Retailer Rewards Program

## Overview

The **Retailer Rewards Program** is a software solution designed to calculate and manage reward points for customers based on their transaction history. This codebase provides the logic for tracking purchases and assigning points according to specific business rules.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It demonstrates a clean, test-driven implementation of a frontend application that fetches and processes data according to the following business logic.

### Rewards Calculation Rules
- **2 points** for every dollar spent over $100 in a single transaction.
- **1 point** for every dollar spent between $50 and $100.

For example, a **$120** purchase earns **90 points**: `(120 - 100) * 2 + (100 - 50) * 1 = 40 + 50 = 90`.

## Technology Stack

*   **Framework**: React.js
*   **UI Library**: None (plain CSS)
*   **Package Manager**: npm / yarn
*   **Build Tools**: React Scripts (`create-react-app`)
*   **Testing**: Jest & React Testing Library

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  Clone the repository to your local machine.
2.  Install the project dependencies:

```bash
npm install
# or
yarn install
```

### Configuration

This project uses environment variables for configuration.
1.  Create a `.env` file in the root directory.
2.  Add the necessary secrets and API keys (refer to project documentation or team lead for keys).

### Running the Application

To start the application in development mode:

```bash
npm start
```

### Building for Production

To create a production-ready build in the `dist/` or `build/` folder:

```bash
npm run build
```

### Testing

To run the test suite and generate coverage reports (located in `coverage/`):

```bash
npm test
```