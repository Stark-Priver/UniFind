# UniFIND - University Lost & Found System

UniFIND is a comprehensive lost and found management system designed specifically for Mbeya University of Science and Technology. It facilitates the reporting, claiming, and management of lost items within the university community.

## Features

- **User Authentication**: Secure Firebase-based authentication system
- **Item Reporting**: Easy-to-use interface for reporting lost or found items
- **Location Tracking**: Google Maps integration for precise item location marking
- **Real-time Chat**: Direct communication between users and administrators
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Image Upload**: Support for multiple image uploads per item
- **Search & Filter**: Advanced search capabilities with multiple filtering options
- **Responsive Design**: Mobile-first approach ensuring accessibility across all devices

## Tech Stack

- **Frontend**: Next.js 13 with App Router
- **UI Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Maps**: Google Maps API
- **Real-time Updates**: Firebase Real-time Database
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18.x or higher
- Firebase account
- Google Maps API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unifind.git
   ```

2. Install dependencies:
   ```bash
   cd unifind
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
unifind/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── items/             # Item management pages
│   └── api/               # API routes
├── components/            # Reusable components
│   └── ui/               # UI components
├── lib/                   # Utility functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Authentication Flow

1. Users can sign up using email/password
2. Admin accounts are pre-configured in Firebase
3. Authentication state is managed globally
4. Protected routes require authentication

## Database Schema

### Users Collection
- id: string
- email: string
- name: string
- role: 'admin' | 'user'
- createdAt: timestamp

### Items Collection
- id: string
- title: string
- description: string
- type: 'lost' | 'found'
- category: string
- location: GeoPoint
- date: timestamp
- images: string[]
- status: 'pending' | 'claimed' | 'approved' | 'rejected'
- userId: string
- createdAt: timestamp

### Claims Collection
- id: string
- itemId: string
- userId: string
- status: 'pending' | 'approved' | 'rejected'
- proofDescription: string
- createdAt: timestamp

### Messages Collection
- id: string
- claimId: string
- senderId: string
- content: string
- createdAt: timestamp

## Security Rules

Firebase security rules are implemented to:
- Restrict data access based on user roles
- Prevent unauthorized modifications
- Validate data integrity
- Ensure user privacy

## Deployment

The application can be deployed to various platforms:

### Vercel Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic CI/CD

### Firebase Hosting
1. Install Firebase CLI
2. Initialize Firebase Hosting
3. Deploy using `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@unifind.com or create an issue in the repository.