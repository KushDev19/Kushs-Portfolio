export interface Project {
  id: number;
  title: string;
  challenge: string;
  approach: string[];
  impact: {
    accuracy?: string;
    r2Score?: string;
    status: string;
    description?: string;
  };
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  category?: string[];
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: 'UniWallet - Smart Campus Wallet',
    challenge: 'College students juggle 5+ apps for banking, meal plans, budgeting, and payments, leading to fragmented financial management and missed spending insights.',
    approach: [
      'Integrated Plaid API for secure bank account linking in sandbox mode',
      'Built AI Financial Coach (FinBot) using Ollama Cloud for personalized advice',
      'Implemented smart transaction categorization across dining, transport, books, events',
      'Created unified wallet system consolidating campus wallets and meal plans',
    ],
    impact: {
      status: 'Top 5 Finalist',
      description: 'Developed in 48 hours at HackFest 2025 @ Rutgers Newark, delivering a fully functional AI-powered financial platform.',
    },
    techStack: ['Next.js 16', 'React 19', '.NET 8', 'MySQL', 'Ollama AI', 'Plaid API', 'TypeScript'],
    githubUrl: 'https://github.com/JiyanBhalara/Uni-Wallet-Dev',
    category: ['Full-Stack', 'AI', 'Hackathon'],
  },
  {
    id: 2,
    title: 'Student Performance Predictor',
    challenge: 'Educators need to identify students requiring additional support by predicting academic outcomes from demographic and performance data.',
    approach: [
      'Evaluated 8 regression algorithms (Linear, Ridge, Lasso, Random Forest, XGBoost, CatBoost)',
      'Implemented separate preprocessing pipelines for numerical and categorical features',
      'Built responsive Flask web interface for real-time predictions',
      'Deployed production-ready application on Render.com',
    ],
    impact: {
      accuracy: 'Best Model Selected',
      r2Score: 'R² optimization',
      status: 'Production Deployed',
      description: 'Analyzed 1,000 student records with automated model selection using 5-fold cross-validation.',
    },
    techStack: ['Python', 'Flask', 'Scikit-learn', 'XGBoost', 'CatBoost', 'Pandas', 'Render'],
    githubUrl: 'https://github.com/KushDev19/ML-Project',
    category: ['Machine Learning', 'Full-Stack', 'Deployment'],
  },
  {
    id: 3,
    title: 'Jarvis - Personal AI Assistant',
    challenge: 'Daily task automation through voice commands requires seamless integration of speech recognition, web APIs, and system utilities.',
    approach: [
      'Implemented voice interaction with speech-to-text and text-to-speech conversion',
      'Integrated OpenWeather and WolframAlpha APIs for real-time data',
      'Built modular architecture supporting custom commands and plugins',
      'Created system automation for app launching, screenshots, and file management',
    ],
    impact: {
      status: 'Fully Functional',
      description: 'Voice-powered AI assistant with 5+ capability categories and extensible plugin system.',
    },
    techStack: ['Python', 'Speech Recognition', 'OpenWeather API', 'WolframAlpha API', 'Text-to-Speech'],
    githubUrl: 'https://github.com/KushDev19/jarvis',
    category: ['AI', 'Automation', 'Voice'],
  },
  {
    id: 4,
    title: 'Flight Price Prediction',
    challenge: 'Travelers struggle with unpredictable flight pricing patterns and lack tools for informed booking decisions.',
    approach: [
      'Cleaned and analyzed 10,000+ flight records from Excel datasets',
      'Engineered 15+ time-based and route-based features',
      'Performed extensive EDA on journey dates, airlines, duration, and pricing correlations',
      'Implemented feature encoding and scaling for ML readiness',
    ],
    impact: {
      status: 'EDA Complete',
      description: 'Comprehensive data preparation pipeline ready for model training and deployment.',
    },
    techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
    githubUrl: 'https://github.com/KushDev19/Flight-EDA-and-Price-Prediction',
    category: ['EDA', 'Machine Learning', 'Feature Engineering'],
  },
  {
    id: 5,
    title: 'Sales EDA & Purchase Prediction',
    challenge: 'Understanding sales patterns and building accurate forecasting models requires comprehensive data exploration and feature engineering.',
    approach: [
      'Performed extensive EDA with distribution, trend, and correlation analysis',
      'Handled missing values and corrected data types systematically',
      'Implemented and compared multiple regression models (Linear, Random Forest, XGBoost)',
      'Evaluated models using RMSE and R² metrics with prediction visualization',
    ],
    impact: {
      accuracy: 'Multi-model comparison',
      r2Score: 'RMSE + R² metrics',
      status: 'Complete Pipeline',
      description: 'End-to-end data science workflow from raw data to model evaluation.',
    },
    techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'Matplotlib', 'Seaborn'],
    githubUrl: 'https://github.com/KushDev19/Sales-EDA-and-Purchase-Prediction',
    category: ['EDA', 'Machine Learning', 'Prediction'],
  },
];
