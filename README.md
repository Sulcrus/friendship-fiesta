# Kathmandu Friendship Fiesta - Event Registration Platform

A beautiful, modern event registration platform built for the Interact Club's Kathmandu Friendship Fiesta event.

## Features

- **Registration Form**: Google Forms-like interface for easy event registration
- **Payment Integration**: Support for both cash and QR code payments with QR generation
- **Admin Dashboard**: Complete admin panel to track and manage all registrations
- **Event Pass Generation**: Beautiful, downloadable event passes with QR codes
- **Real-time Database**: Powered by Convex for real-time data sync
- **Responsive Design**: Clean, minimal design that works on all devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```
CONVEX_DEPLOYMENT=secret-opossum-540
NEXT_PUBLIC_CONVEX_URL=https://secret-opossum-540.convex.cloud
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Setup Convex (if needed)
```bash
npx convex dev
```

## Usage

### For Participants
1. Visit the main page
2. Fill out the registration form with:
   - Full name
   - Home club name
   - Phone number
   - Payment method (cash or QR)
3. If using QR payment, scan the generated QR code and upload payment screenshot
4. Submit registration and receive your event pass

### For Administrators
1. Navigate to `/admin`
2. View registration statistics
3. Review and approve/reject pending registrations
4. Track all participant data

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Styled Components
- **Database**: Convex
- **QR Generation**: qrcode library
- **PDF/Image Generation**: html2canvas
- **File Upload**: React Dropzone

## Project Structure

```
friendship-fiesta/
├── app/
│   ├── components/         # Reusable React components
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main registration page
├── convex/
│   ├── schema.ts         # Database schema
│   └── registrations.ts  # Database functions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is built for the Interact Club of Kathmandu Friendship Fiesta event.
