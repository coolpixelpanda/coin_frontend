# Coin Transfer App

A modern cryptocurrency transfer and exchange web application built with React, featuring secure authentication and real-time crypto price tracking.

## Features

- 🔐 **Secure Authentication** - Sign up and sign in with email/password
- 💰 **Crypto Price Tracking** - Real-time Bitcoin and Ethereum prices
- 🔄 **Instant Exchange** - Convert crypto to USD instantly
- 📊 **Transaction Status** - Track your exchange transactions
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

## API Endpoints

The application is configured to work with the following API endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/crypto-price/{id}` - Get cryptocurrency price
- `POST /api/exchange` - Exchange crypto to USD
- `GET /api/transaction-status` - Check transaction status

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd coin-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.jsx  # Homepage with sign in/up buttons
│   ├── SignIn.jsx       # Sign in form
│   ├── SignUp.jsx       # Sign up form
│   └── Dashboard.jsx    # Main dashboard with crypto features
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state management
├── services/            # API services
│   └── api.js          # API client and endpoints
├── App.jsx             # Main app component with routing
├── main.jsx           # App entry point
├── index.css          # Tailwind CSS imports
└── globals.css        # CSS custom properties
```

## Usage

### Authentication
1. Visit the homepage
2. Click "Sign Up" to create a new account or "Sign In" to log in
3. Fill in your details and submit the form

### Dashboard Features
1. **Crypto Prices**: View real-time Bitcoin and Ethereum prices
2. **Exchange**: Convert your crypto to USD by filling out the exchange form
3. **Transaction Status**: Check the status of your transactions using the transaction ID

## Backend Integration

This is a frontend-only application. To make it fully functional, you'll need to implement the backend API endpoints. The API client is already configured to work with:

- Base URL: `http://localhost:3002/api`
- Authentication: Bearer token in headers
- Error handling: Automatic logout on 401 errors

## Technologies Used

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

## Customization

### API Configuration
Update the `API_BASE_URL` in `src/services/api.js` to point to your backend server.

### Styling
The app uses Tailwind CSS with custom CSS variables defined in `src/globals.css`. You can customize the color scheme by modifying these variables.

### Adding New Cryptocurrencies
To add support for more cryptocurrencies:
1. Update the crypto selection in the Dashboard component
2. Add corresponding API calls in the crypto service
3. Update the price display logic

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Code Style

The project uses ESLint for code linting. Make sure to follow the configured rules for consistent code style.

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
