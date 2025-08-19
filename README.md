# Krubolab Admin Dashboard

A password-protected internal dashboard for managing products, services, contacts, and orders with full API integration for data persistence.

## Features

- **Password Protection**: Secure login system to protect admin access
- **Products Management**: Add, edit, and delete products with pricing and stock information
- **Services Management**: Manage service offerings with pricing and duration
- **Contacts Management**: Maintain customer and lead information with status tracking
- **Orders Management**: Track orders with customer details and status updates
- **API Integration**: Full CRUD operations through REST API endpoints
- **Data Persistence**: All data is stored and retrieved from the backend API
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with intuitive navigation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Access to the Krubolab API Gateway

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd krubolab
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint in `src/config/env.js`:
```javascript
export const ENV_CONFIG = {
  API_URL: 'https://your-api-gateway-url.com/prod',
  AWS_REGION: 'your-aws-region',
  ENDPOINTS: {
    JSON: '/json'
  }
};
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Login

- **Default Password**: `admin123`
- **Note**: In production, implement proper authentication with secure password hashing and database storage

### Dashboard Navigation

The dashboard is organized into four main sections:

1. **Products**
   - View all products in a table format
   - Add new products with name, price, category, and stock
   - Edit existing product information
   - Delete products from inventory
   - Data is persisted to `products.json` via API

2. **Services**
   - Manage service offerings
   - Track pricing and duration
   - Categorize services for better organization
   - Data is persisted to `services.json` via API

3. **Contacts**
   - Maintain customer and lead database
   - Track contact status (Active, Lead, Inactive, Prospect)
   - Store company information and contact details
   - Data is persisted to `contacts.json` via API

4. **Orders**
   - Monitor order status and progress
   - Update order statuses (Pending, Processing, Shipped, Delivered, Completed, Cancelled)
   - Track customer information and order totals
   - Data is persisted to `orders.json` via API

### Data Management

- **Add New Items**: Click the "Add" button in any section to create new entries
- **Edit Items**: Click the "Edit" button to modify existing information
- **Delete Items**: Use the "Delete" button to remove entries (with confirmation)
- **Status Updates**: Orders can have their status updated directly from the table
- **Real-time Sync**: All changes are immediately persisted to the backend API

## API Integration

### Data Storage

The dashboard uses the existing `apiService.js` to interact with the backend API:

- **GET Operations**: Fetch data from JSON files on the server
- **PUT Operations**: Create/update records in JSON files
- **DELETE Operations**: Remove records from JSON files

### File Structure

Data is organized into separate JSON files:
- `products.json` - Product catalog and inventory
- `services.json` - Service offerings and pricing
- `contacts.json` - Customer and lead database
- `orders.json` - Order tracking and management

### API Endpoints

All operations go through the `/json` endpoint with appropriate HTTP methods:
- `GET /json?filename=products.json` - Retrieve data
- `PUT /json` - Create/update data
- `DELETE /json` - Remove data

## Security Considerations

⚠️ **Important**: This is a basic implementation for demonstration purposes. For production use:

1. **Implement proper authentication**:
   - Use secure password hashing (bcrypt, Argon2)
   - Implement JWT tokens or session management
   - Add rate limiting for login attempts

2. **Data persistence**:
   - The current implementation uses JSON files via API
   - Consider implementing proper database storage
   - Add audit logging for all operations

3. **Access control**:
   - Implement role-based access control (RBAC)
   - Add user management features
   - Log all admin actions

4. **API security**:
   - Use HTTPS in production
   - Implement CORS policies
   - Add input validation and sanitization
   - Secure API Gateway endpoints

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Login component
│   ├── Dashboard.jsx      # Main dashboard with navigation
│   ├── Products.jsx       # Products management with API integration
│   ├── Services.jsx       # Services management with API integration
│   ├── Contacts.jsx       # Contacts management with API integration
│   └── Orders.jsx         # Orders management with API integration
├── services/
│   └── apiService.js      # API client and dashboard service methods
├── config/
│   └── env.js             # Environment configuration and API endpoints
├── App.jsx                # Main app with routing
├── App.css                # Comprehensive styling
└── main.jsx               # App entry point
```

## Customization

### Adding New Fields

To add new fields to any management section:

1. Update the component's state structure
2. Add form inputs in the form section
3. Update the table headers and data display
4. Modify the form submission logic
5. Update the corresponding API service methods

### Styling

The dashboard uses CSS custom properties and modern CSS features. Main styling is in `src/App.css` with responsive design considerations.

### Data Structure

Each section uses the API service for data operations:
- Data is fetched on component mount
- Changes are immediately persisted to the backend
- Error handling and loading states are implemented
- Optimistic updates for better UX

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.