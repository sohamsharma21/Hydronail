# 🌊 Hydronail - Smart Water Treatment & Monitoring System

![Hydronail](https://img.shields.io/badge/Smart%20India%20Hackathon-2024-blue)
![Team](https://img.shields.io/badge/Team-Nova_Minds-green)
![Status](https://img.shields.io/badge/Status-Live-success)

**Live Demo:** https://hydronail.vercel.app

---

## 📋 Project Overview

**Hydronail** is an intelligent water treatment and monitoring system designed for Smart India Hackathon. It provides real-time monitoring, predictive analytics, and automated control for water treatment plants. The system combines IoT sensor data, machine learning predictions, and an intuitive dashboard interface to optimize water treatment processes.

### Team Information
- **Team Name:** Nova_Minds
- **Competition:** Smart India Hackathon
- **Team ID:** 107048
- **Team No:** 19

---

## ✨ Key Features

### 1. **Real-Time Monitoring Dashboard**
   - Live sensor data visualization (pH, Temperature, Turbidity, Chlorine levels)
   - Interactive water quality metrics
   - System status indicators and KPI tracking

### 2. **Plant Control Center**
   - Digital twin visualization of the treatment plant
   - 3D plant scene with real-time status updates
   - Machine and equipment control
   - Treatment flow visualization

### 3. **Machine Learning Dashboard**
   - ML-based predictive analytics
   - Water quality predictions
   - Anomaly detection
   - Treatment optimization recommendations

### 4. **Digital Twin Technology**
   - 3D visualization of the water treatment plant
   - Real-time equipment status
   - Interactive flow simulation
   - Camera presets for different views

### 5. **Alert & Notification System**
   - Configurable email alerts for anomalies
   - Recipient manager for alert distribution
   - Real-time alert notifications
   - Historical alert tracking

### 6. **Water Usage Analytics**
   - Historical water processing data
   - Usage trends and patterns
   - Water reuse recommendations
   - Resource optimization insights

### 7. **Simulator Module**
   - Test sensor data in real-time
   - Simulate different water conditions
   - Training and demonstration purposes

### 8. **Calibration Tools**
   - Sensor calibration management
   - Accuracy verification
   - Maintenance scheduling

### 9. **Reports & Analytics**
   - Comprehensive PDF report generation
   - Data export functionality
   - Compliance documentation

### 10. **PWA Support**
   - Progressive Web App functionality
   - Offline capability
   - Mobile-responsive design

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Three Fiber** - 3D visualization
- **Shadcn UI** - Component library
- **React Query (TanStack)** - Data fetching & caching

### Backend & Services
- **Supabase** - Database & Authentication
- **Supabase Functions** - Serverless backend
- **ThingSpeak** - IoT data ingestion
- **Gradio** - ML model integration

### 3D & Visualization
- **Three.js** - 3D graphics
- **React Three Fiber** - React + Three.js integration
- **Drei** - 3D utilities

### UI/UX Libraries
- **Recharts** - Data visualization
- **Radix UI** - Accessible components
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation

---

## 📁 Project Structure

```
hydronail/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   ├── control-center/     # Plant control interface
│   │   ├── plant3d/            # 3D plant visualization
│   │   ├── digitaltwin/        # Digital twin components
│   │   ├── monitoring/         # Sensor monitoring
│   │   ├── alerts/             # Alert management
│   │   ├── auth/               # Authentication
│   │   └── ui/                 # Shadcn UI components
│   ├── pages/
│   │   ├── Index.tsx           # Home page
│   │   ├── Landing.tsx         # Landing page
│   │   ├── Monitoring.tsx      # Monitoring dashboard
│   │   ├── PlantControlCenter.tsx
│   │   ├── PlantDigitalTwin.tsx
│   │   ├── MLDashboard.tsx     # ML predictions
│   │   ├── Analytics.tsx       # Analytics dashboard
│   │   ├── Alerts.tsx          # Alert management
│   │   ├── Reports.tsx         # Report generation
│   │   ├── WaterReuse.tsx      # Water reuse analytics
│   │   └── ...
│   ├── hooks/
│   │   ├── useWaterData.ts     # Water data fetching
│   │   ├── useThingSpeak.ts    # ThingSpeak integration
│   │   ├── useMLPrediction.ts  # ML predictions
│   │   ├── useControlCenterData.ts
│   │   └── useAlertEmail.ts
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── integrations/
│   │   └── supabase/           # Supabase client & types
│   ├── lib/
│   │   ├── reportGenerator.ts  # PDF report generation
│   │   ├── utils.ts            # Utility functions
│   │   └── validation.ts       # Input validation
│   └── App.tsx                 # Main app component
├── supabase/
│   ├── functions/
│   │   ├── control-machine/    # Machine control API
│   │   ├── ingest-sensor-data/ # Data ingestion
│   │   └── send-alert-email/   # Email alerts
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ or **Bun**
- **npm** or **bun** package manager
- Supabase project setup
- ThingSpeak channel for IoT data

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sohamsharma21/Hydronail.git
   cd Hydronail
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_THINGSPEAK_CHANNEL_ID=your_channel_id
   VITE_THINGSPEAK_READ_KEY=your_read_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
bun run build
```

Preview production build:
```bash
npm run preview
# or
bun run preview
```

---

## 📊 Core Modules

### 1. **Monitoring Dashboard**
Real-time visualization of water quality parameters:
- pH Level tracking
- Water temperature monitoring
- Turbidity measurement
- Chlorine concentration
- Historical trends and comparisons

### 2. **Plant Control Center**
Centralized control interface featuring:
- System overview with KPI metrics
- Machine status and control
- Treatment flow visualization
- Device management and alerts

### 3. **3D Digital Twin**
Immersive plant visualization including:
- Blower systems
- UV treatment units
- Filtration tanks
- Chlorination systems
- Real-time status indicators

### 4. **ML Prediction Engine**
Intelligent forecasting system:
- Water quality predictions
- Anomaly detection
- Optimal treatment recommendations
- Pattern analysis

### 5. **Alert Management**
Proactive notification system:
- Configurable thresholds
- Email alert distribution
- Alert recipient management
- Historical tracking

### 6. **Water Reuse Analytics**
Sustainability focus:
- Water reuse potential analysis
- Treatment process optimization
- Resource efficiency metrics

---

## 🔐 Security Features

- **Authentication** - Supabase Auth with protected routes
- **Data Encryption** - Secure data transmission
- **Role-Based Access Control** - User permission management
- **Environment Variables** - Secure credential storage
- **Input Validation** - Zod schema validation

---

## 📱 Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🌐 Deployment

The application is deployed on **Vercel**:
- **Live URL:** https://hydronail.vercel.app
- **Auto-deployment** from main branch
- **Optimized performance** with edge caching

### Deploy Your Own
1. Fork the repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

---

## 📞 Support & Contact

For issues, feature requests, or questions:
- GitHub Issues: [Create an issue](https://github.com/sohamsharma21/Hydronail/issues)
- Team Contact: Nova_Minds (Smart India Hackathon Team)

---

## 📄 License

This project is developed for Smart India Hackathon 2024. All rights reserved.

---

## 🙏 Acknowledgments

- **Smart India Hackathon** for the opportunity
- **Team Nova_Minds** for dedication and innovation
- **Open Source Community** for amazing libraries and tools
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML models for prediction
- [ ] Multi-plant management system
- [ ] IoT device integration enhancements
- [ ] Real-time collaboration features
- [ ] Blockchain for data integrity
- [ ] Extended API documentation

---

**Made with ❤️ by Team Nova_Minds**
