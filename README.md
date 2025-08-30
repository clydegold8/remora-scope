# Urban Traffic Hub

A modern web application for monitoring and analyzing urban traffic patterns, pedestrian movement, and environmental data. Built with React, TypeScript, and Supabase for real-time data management.

## 🚗 Features

- **Traffic Monitoring**: Track vehicle and pedestrian counts in real-time
- **Environmental Data**: Monitor air quality and pollution levels
- **GPS Integration**: Location-based data collection with altitude tracking
- **Data Visualization**: Interactive charts and graphs for trend analysis
- **World Map**: Geographic visualization of sensor locations and data
- **Real-time Analytics**: Live data updates and monitoring dashboard
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Customizable theme with smooth transitions
- **Data Management**: Full CRUD operations for traffic detection records

## 🛠️ Technologies

This project is built with modern web technologies:

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Data Visualization**: Chart.js, React Chart.js 2
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Maps**: Interactive world map with location plotting
- **State Management**: React hooks and context
- **Icons**: Lucide React icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Database Setup

This application uses Supabase for data persistence. To enable full functionality:

1. Click the green "Supabase" button in the top right of the Lovable interface
2. Connect to your Supabase project
3. The application will automatically configure the necessary database tables and functions

## 📊 Usage

### Adding Traffic Data

1. Use the sensor form to input traffic detection data
2. Include location coordinates (latitude/longitude) for map visualization
3. Add environmental data like air quality readings
4. Submit to store in the database

### Viewing Analytics

- **Charts Tab**: Switch between line charts (trends) and bar charts (comparisons)
- **World Map**: View geographic distribution of sensor data
- **Data Table**: Browse, search, and manage all detection records
- **Statistics**: Real-time metrics displayed in the dashboard cards

### Data Management

- **Create**: Add new traffic detection records via the form
- **Read**: View all data in the interactive data table
- **Update**: Edit existing records (when connected to Supabase)
- **Delete**: Remove records with confirmation prompts

## 🎨 Customization

The application features a comprehensive design system built with Tailwind CSS:

- **Color Scheme**: Urban-themed color palette with primary blues and accent greens
- **Animations**: Smooth transitions and hover effects throughout the interface
- **Responsive**: Fully responsive design optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Data visualization components
│   ├── ui/             # shadcn/ui base components
│   └── *.tsx           # Feature components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Deployment

### Using Lovable (Recommended)

1. Open your [Lovable project](https://lovable.dev/projects/833af5fd-3e66-4f5e-ace7-918e0a84eb1f)
2. Click "Publish" in the top right corner
3. Your app will be deployed instantly with a public URL

### Custom Domain

To connect a custom domain:

1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

Learn more: [Custom Domain Setup Guide](https://docs.lovable.dev/tips-tricks/custom-domain)

## 🤝 Contributing

This project was built using Lovable's AI-powered development platform. To make changes:

### Using Lovable Interface
- Visit the [project URL](https://lovable.dev/projects/833af5fd-3e66-4f5e-ace7-918e0a84eb1f)
- Use natural language prompts to modify the application
- Changes are automatically committed to the repository

### Using Your IDE
- Clone this repository
- Make changes locally
- Push changes to sync with Lovable

### Using GitHub Features
- **GitHub Codespaces**: Cloud-based development environment
- **Direct editing**: Edit files directly in the GitHub interface
- **Issues & PRs**: Standard GitHub collaboration workflow

## 📄 License

This project is part of the Urban Analytics Solutions suite for traffic and environmental monitoring.

## 🆘 Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Integration Guide](https://docs.lovable.dev/integrations/supabase/)
- [Community Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

Built with ❤️ using [Lovable](https://lovable.dev)