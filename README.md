# AlbatrossAI CRM

![AlbatrossAI Logo](/logo.png) 

A modern, AI-powered CRM solution built with Next.js, Tailwind CSS, and TypeScript.

## Features

- 🚀 AI-powered lead scoring and prioritization
- 🎨 Drag-and-drop pipeline management
- 📊 Real-time analytics dashboard
- 📅 Built-in meeting scheduler
- 🎯 Visual lead "energy" tracking
- 🖥️ Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **State Management**: Zustand
- **Drag-and-Drop**: @dnd-kit
- **UI Components**: ShadCN/ui
- **Authentication**: Next-Auth

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/albatross-crm.git
   cd albatross-crm

 2. Install dependencies:

npm install

3. Set up environment variables:

cp .env.example .env.local

4. Edit .env.local with your credentials

5. Development

npm run dev
Open http://localhost:3000 in your browser.

## Building for Production

npm run build
npm start

## Project Structure

albatross-crm/
├── app/                  # App router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── api/              # API routes
├── components/           # Reusable components
├── lib/                  # Utilities and helpers
├── styles/               # Global styles
├── public/               # Static assets
├── types/                # TypeScript types
└── tailwind.config.js    # Tailwind configuration

## Configuration
Edit these files for customization:

tailwind.config.js - Tailwind theme and plugins

app/layout.tsx - Main application layout

lib/constants.ts - Default data and configurations

## Troubleshooting
Common Issues

TypeScript Errors:
npm install --save-dev @types/react @types/react-dom @types/node

Turbopack Errors:
npm run dev -- --no-turbo

Styling Not Applying:
Verify globals.css imports Tailwind directives
Check tailwind.config.js content paths

## Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

## License
Distributed under the MIT License. See LICENSE for more information.

## Contact
Sanelisiwe Sileku - [@Sanelisiwe71701](https://x.com/Sanelisiwe71701) - sanelisiwe.sileku@gmail.com

Project Link: https://github.com/sanerita/ALBATROSSAI

