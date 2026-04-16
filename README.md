# CloudStrike Dashboard

A modern, real-time performance testing dashboard for distributed load testing across cloud runners. Built on cloud infrastructure using React, TypeScript, and Vite for fast development and production builds. Leverage the power of cloud-native distributed testing to measure application performance at scale across multiple cloud regions and infrastructure providers.

## Overview

CloudStrike Dashboard is a comprehensive cloud-native solution for managing and monitoring distributed load tests across global cloud infrastructure. It provides an intuitive control panel to configure test patterns, monitor live execution in real-time, and analyze results aggregated from multiple cloud infrastructure runners. Designed for cloud-first teams who need to validate application performance at scale using distributed cloud computing resources.

## Features

### 🎯 Load Testing Patterns
- **SPIKE**: Instant traffic surge (0 to 100 concurrent requests) - Tests breaking points
- **RAMP**: Gradual traffic increase over 60 seconds - Tests scaling behavior  
- **SUSTAINED**: Steady 50 concurrent requests for 90 seconds - Tests endurance

### 📊 Real-Time Monitoring
- Live test execution tracking
- Latency percentile visualization (p50, p95, p99)
- Request/response metrics dashboard
- Real-time log streaming

### 📈 Test Management
- Distributed load runner support across cloud platforms
- Multiple concurrent test patterns running in parallel on cloud infrastructure
- Test history and results archival in cloud storage
- GitHub Actions integration for seamless CI/CD cloud automation
- Cloud-based performance data persistence with Supabase
- Automatic scaling of cloud runners based on test parameters

### 🎨 User Experience
- Modern UI with shadcn/ui components
- Responsive design for desktop and mobile
- Dark theme optimized for monitoring
- Smooth animations with Framer Motion

## Tech Stack

### Cloud Infrastructure
- **Cloud Platform**: GitHub Actions (Azure VM runners globally distributed)
- **Cloud Database**: Supabase (PostgreSQL in the cloud)
- **Cloud CDN**: Cloudflare
- **Cloud Hosting**: Vercel

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (serverless-ready)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query + Context API

### Backend & Testing
- **Testing**: Vitest + Playwright
- **Load Generation**: Autocannon
- **Package Manager**: Bun

## Project Structure

```
src/
├── pages/              # Route pages (Home, ControlPanel, History, etc.)
├── components/         # React components
│   └── ui/            # shadcn/ui component library
├── context/           # Global state management
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
└── test/              # Unit and e2e tests
```

## Getting Started

Deploy CloudStrike Dashboard to cloud hosting in minutes.

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (cloud database)
- GitHub account (for Actions integration)
- Cloud hosting provider (Vercel, Netlify, or your preferred platform)

### Installation

```bash
# Install dependencies
bun install

# Create .env file with your Supabase credentials
cp .env.example .env
```

### Development

```bash
# Start development server
bun run dev

# Open browser to http://localhost:5173
```

### Building

```bash
# Build for production (cloud-ready)
bun run build

# Preview production build
bun run preview
```

### Cloud Deployment

Deploy to your preferred cloud platform:

```bash
# Deploy to Vercel (recommended)
vercel deploy

# Or deploy to other cloud platforms (AWS, Azure, GCP, etc.)
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build
- `bun run test` - Run tests once
- `bun run test:watch` - Run tests in watch mode

## Pages

- **Home** - Dashboard overview with test status summary
- **Control Panel** - Configure and trigger load tests
- **How It Works** - Documentation and usage guide
- **History** - View past test results and metrics

## Configuration

Key configuration files:
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Test runner configuration

## Recent Updates

- ✅ Simplified dashboard graph to show latency percentiles using actual captured data from cloud runners (Apr 2026)
- ✅ Optimized cloud test runner initialization with improved timeout handling across multiple cloud regions (Apr 2026)
- ✅ Fixed Supabase cloud database polling for reliable test result retrieval (Apr 2026)
- ✅ Implemented automated workflow data extraction for GitHub Actions cloud runners (Apr 2026)
- ✅ Enhanced frontend robustness with detailed test run polling from distributed cloud infrastructure (Apr 2026)
- ✅ Cloud-native architecture improvements for global scalability

## Contributing

When contributing, please:
1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Use meaningful commit messages

## License

This project is part of the CloudStrike initiative.

## Architecture

CloudStrike is built on a cutting-edge cloud-native architecture:
- **Serverless Frontend**: Deployed on global CDN for low-latency access
- **Cloud Database**: Real-time data sync with Supabase across regions
- **Distributed Load Runners**: GitHub Actions provides ephemeral cloud VMs for each test
- **Real-time Cloud Polling**: WebSocket-style updates from multiple cloud runners
- **Horizontal Cloud Scaling**: Automatically scales load across cloud infrastructure

## Support

For issues and feature requests, please check the project's issue tracker. For cloud deployment questions, consult the platform-specific documentation (Vercel, GitHub Actions, Supabase).
