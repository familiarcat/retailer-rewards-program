# Retailer Rewards Program

## Overview

The **Retailer Rewards Program** is a software solution designed to calculate and manage reward points for customers based on their transaction history. This codebase provides the logic for tracking purchases and assigning points according to specific business rules.

## Technology Stack

*   **Runtime Environment**: Node.js
*   **Package Manager**: npm / yarn
*   **Build Tools**: Standard build scripts outputting to `build/` or `dist/`
*   **Testing**: Configured with code coverage reports

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