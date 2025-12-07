# Zenith Currency Converter

A professional-grade currency conversion web application featuring real-time rate simulation, interactive historical trend charts, and persistent conversion history. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Conversion**: Instant currency conversion between major world currencies.
- **Dual Modes**: 
  - **Static Mode**: Uses fixed exchange rates for stable testing.
  - **Live API Mode**: Simulates real-time market fluctuations and network latency.
- **Interactive Charts**: Visualizes 7-day exchange rate trends using Recharts.
- **Conversion History**: Saves calculation results to LocalStorage for persistence across sessions.
- **Robust Validation**: 
  - Prevents negative or non-numeric inputs.
  - Detects currency mismatches (Source vs Target).
  - Provides immediate visual feedback and tooltips.

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Custom SVG Components

## Installation & Running

Ensure you have Node.js installed.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Development Server**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3.  **Running Tests**
    This project uses standard React testing scripts.
    ```bash
    npm test
    ```

## Usage Guide

1.  **Enter Amount**: Type a positive number in the input field. The app prevents negative inputs automatically.
2.  **Select Currencies**: Choose a "From" and "To" currency from the dropdowns. Hover over codes to see full currency names.
3.  **View Trends**: The chart at the bottom automatically updates to show the simulated historical performance of the selected pair.
4.  **Save Calculation**: Click "Save Calculation" to store the result in the history sidebar.
5.  **Live Mode**: Toggle the "Static Mode / Live API" button in the top right to simulate network fetching and rate volatility.

## Notes on Exchange Rates

*   **Simulation**: Currently, this application uses a mock service (`services/currencyService.ts`) to simulate API calls.
*   **Volatility**: In "Live Mode", a random noise algorithm is applied to base rates to demonstrate UI updates and loading states without requiring an external API key.
*   **Base Currency**: All internal calculations use USD as the base anchor.

## Known Limitations & Future Improvements

*   **Real API Integration**: The current version uses simulated data. Future updates will integrate with a real provider like OpenExchangeRates or Fixer.io.
*   **Offline Support**: While it works locally, PWA capabilities could be added for full offline support.
*   **More Currencies**: The list is currently limited to major global currencies.
