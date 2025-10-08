# INRTX-reserve Sale DApp on Polygon (Firebase Prototype)

This is a Next.js prototype for a Decentralized Application (DApp) to sell INRTX-reserve tokens on the Polygon network. It's built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Core Features

- **Wallet Connection**: Connects to MetaMask (EIP-1193 compatible wallets).
- **Token Purchase**: Simulate buying INRTX-reserve tokens with USDT or POL/MATIC.
- **Live Price Conversion**: Fetches live prices for POL/MATIC to USD for accurate transaction amounts.
- **Firebase Integration**: Uses Firebase Authentication (anonymous) and Firestore to record purchases.
- **Live Dashboard**: Displays sale progress, key metrics, and recent purchases in real-time.

## Getting Started

### 1. Environment Setup

First, you need to set up your environment variables. Copy the example file to a new file named `.env.local`:

```bash
cp .env.example .env.local
```

Now, fill in the values in `.env.local`:

- **Firebase Configuration**: Get these values from your Firebase project settings.
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- **DApp Configuration**:
  - `NEXT_PUBLIC_USDT_ADDRESS`: The ERC-20 contract address for USDT on the Polygon mainnet. A common one is `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`.
  - `NEXT_PUBLIC_SALE_CAP`: The total number of tokens available for sale (e.g., `1000000`).
  - `NEXT_PUBLIC_PRICE_API_URL`: The API endpoint to fetch live crypto prices. The default is set to a public CoinGecko endpoint.

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Firebase Setup

### Firestore

This DApp uses Firestore to store purchase records. Make sure you have Firestore enabled in your Firebase project.

**Security Rules**: To ensure that only authenticated users can create purchase records, use the following security rules for your Firestore database:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      // Allow anyone to read purchase data for the dashboard
      allow read: if true;
      // Only allow authenticated users to create a purchase record
      allow create: if request.auth != null;
      // Purchases are immutable
      allow update, delete: if false;
    }
  }
}
```

### Authentication

Enable Anonymous authentication in your Firebase project's Authentication tab. The DApp automatically signs users in anonymously when they connect their wallet.

### Hosting

To deploy your DApp to Firebase Hosting, you will need `firebase.json` and `apphosting.yaml` files. The `apphosting.yaml` is already present. Here is a sample `firebase.json`:

```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}

```

You can deploy using the Firebase CLI:

```bash
firebase deploy
```

## Smart Contracts

The Web3 transaction logic in this prototype is **stubbed**. The functions `buyWithUSDT` and `buyWithPOL` simulate a successful transaction and write data to Firestore. You will need to replace these placeholder functions with actual smart contract interactions using a library like `ethers.js` or `viem`.
