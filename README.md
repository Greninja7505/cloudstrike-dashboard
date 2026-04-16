# CloudStrike Dashboard

A modern, real-time performance testing dashboard for distributed load testing across cloud runners. Built on cloud infrastructure using React, TypeScript, and Vite for fast development and production builds. Leverage the power of cloud-native distributed testing to measure application performance at scale across multiple cloud regions and infrastructure providers.

## Overview

CloudStrike Dashboard is a comprehensive cloud-native solution for managing and monitoring distributed load tests across global cloud infrastructure. It provides an intuitive control panel to configure test patterns, monitor live execution in real-time, and analyze results aggregated from multiple cloud infrastructure runners. Designed for cloud-first teams who need to validate application performance at scale using distributed cloud computing resources.

## Features

### Load Testing Patterns
- **SPIKE**: Instant traffic surge (0 to 100 concurrent requests) - Tests breaking points
- **RAMP**: Gradual traffic increase over 60 seconds - Tests scaling behavior  
- **SUSTAINED**: Steady 50 concurrent requests for 90 seconds - Tests endurance

### Real-Time Monitoring
- Live test execution tracking
- Latency percentile visualization (p50, p95, p99)
- Request/response metrics dashboard
- Real-time log streaming

### Test Management
- Distributed load runner support across cloud platforms
- Multiple concurrent test patterns running in parallel on cloud infrastructure
- Test history and results archival in cloud storage
- GitHub Actions integration for seamless CI/CD cloud automation
- Cloud-based performance data persistence with Supabase
- Automatic scaling of cloud runners based on test parameters

### User Experience
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

Follow these steps to initialize the project on your local machine:

**Step 1: Clone the Repository**
```bash
git clone https://github.com/Greninja7505/cloudstrike-dashboard.git
cd cloudstrike-dashboard
```

**Step 2: Install Package Manager (if needed)**
```bash
# Install Bun if you don't have it already
curl -fsSL https://bun.sh/install | bash
```

**Step 3: Install Dependencies**
```bash
# Install all project dependencies
bun install
```

**Step 4: Configure Environment Variables**
```bash
# Create a .env file by copying the template
cp .env.example .env

# Edit .env and add your configuration:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_GITHUB_TOKEN=your_github_token (optional for GitHub Actions integration)
```

**Step 5: Set Up Supabase Database (Optional)**
- Create a Supabase project at https://app.supabase.com
- Create a `test_runs` table with the schema defined in the database configuration
- Copy your project URL and anonymous key to the .env file

### Development

**Start the Development Server:**
```bash
# Launch the development server with hot module replacement
bun run dev

# Server will start and display:
# Local: http://localhost:5173/
# Open this URL in your browser to access the dashboard
```

**Access the Application:**
- Navigate to `http://localhost:5173` in your web browser
- The development server includes hot reload, so changes are reflected instantly
- Open browser developer tools (F12 or Cmd+Option+I) to view console logs and debug

**Development Workflow:**
```bash
# Watch for file changes and run tests automatically
bun run test:watch

# In another terminal, run linting to check code quality
bun run lint

# Fix linting issues automatically where possible
bun run lint --fix
```

### Building for Production

**Create an Optimized Build:**
```bash
# Build for production with optimizations and minification
bun run build

# This generates a dist/ folder with optimized files ready for deployment
```

**Test Production Build Locally:**
```bash
# Preview the production build before deploying
bun run preview

# Server will display:
# Local: http://localhost:4173/
# Open this URL to test the production build locally
```

**Development Build (for debugging):**
```bash
# Build in development mode for easier debugging
bun run build:dev
```

### Cloud Deployment

**Deploy to Vercel (Recommended - Zero Configuration):**
```bash
# Install Vercel CLI (if not already installed)
bun install -g vercel

# Deploy to production
vercel deploy --prod

# Follow the prompts to link your project
# Vercel will automatically detect and build your Vite project
```

**Deploy to Other Cloud Platforms:**

Deployment instructions for other platforms:

**AWS/S3 + CloudFront:**
```bash
bun run build
aws s3 sync dist/ s3://your-bucket-name
```

**Azure Static Web Apps:**
```bash
# Follow Azure deployment wizard in Azure Portal
# Connect your GitHub repository for automatic CI/CD
```

**Google Cloud Platform:**
```bash
bun run build
gcloud app deploy
```

**GitHub Pages:**
```bash
# For GitHub Pages, update vite.config.ts base path
# Then deploy the dist/ folder to your gh-pages branch
```

## Available Commands

### Development Commands
- `bun run dev` - Start development server with hot module replacement (localhost:5173)
- `bun run lint` - Run ESLint to check code quality
- `bun run lint --fix` - Automatically fix linting issues

### Testing Commands
- `bun run test` - Run all tests once and exit
- `bun run test:watch` - Run tests in watch mode with file monitoring

### Build Commands
- `bun run build` - Create optimized production build
- `bun run build:dev` - Create development build with debugging support
- `bun run preview` - Preview production build locally (localhost:4173)

### Utility Commands
- `bun install` - Install all project dependencies
- `git push` - Push changes to repository

## Pages

- **Home** - Dashboard overview with test status summary
- **Control Panel** - Configure and trigger load tests
- **How It Works** - Documentation and usage guide
- **History** - View past test results and metrics

## Configuration Files

Key configuration files and how to customize them:

**`vite.config.ts` - Vite Build Configuration**
- Controls the bundler and development server behavior
- Modify port, proxy settings, and build output
- Includes plugin configuration for React and component tagging

**`tailwind.config.ts` - Tailwind CSS Customization**
- Customize theme colors, spacing, and typography
- Define breakpoints for responsive design
- Add custom component styles

**`tsconfig.json` - TypeScript Configuration**
- Set TypeScript compiler options
- Configure module resolution and path aliases (@/ for src/)
- Enable strict type checking

**`vitest.config.ts` - Test Runner Configuration**
- Configure test environment and globals
- Set up test coverage thresholds
- Define test file patterns

**`.env` - Environment Variables**
```
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# GitHub Integration (Optional)
VITE_GITHUB_TOKEN=your_github_token
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=your_repo_name
```

## Recent Updates

- [x] Simplified dashboard graph to show latency percentiles using actual captured data from cloud runners (Apr 2026)
- [x] Optimized cloud test runner initialization with improved timeout handling across multiple cloud regions (Apr 2026)
- [x] Fixed Supabase cloud database polling for reliable test result retrieval (Apr 2026)
- [x] Implemented automated workflow data extraction for GitHub Actions cloud runners (Apr 2026)
- [x] Enhanced frontend robustness with detailed test run polling from distributed cloud infrastructure (Apr 2026)
- [x] Cloud-native architecture improvements for global scalability

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

## Troubleshooting

**Port Already in Use**
```bash
# If localhost:5173 is already in use, Vite will use the next available port
# Or specify a custom port:
bun run dev -- --port 3000
```

**Dependencies Installation Issues**
```bash
# Clear cache and reinstall
bun install --force

# Or use npm if Bun has issues
npm install
```

**Environment Variables Not Loading**
- Ensure `.env` file is in the project root
- Restart the development server after changing .env
- Check that variable names start with `VITE_` for frontend access

**Supabase Connection Issues**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Check that Supabase project is running
- Ensure test_runs table exists in your Supabase database

**Build Failures**
```bash
# Clear build cache
rm -rf dist/

# Rebuild from scratch
bun run build
```

## Support

For issues and feature requests, please check the project's issue tracker. For cloud deployment questions, consult the platform-specific documentation:
- Vercel: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/en/actions
- Supabase: https://supabase.com/docs
