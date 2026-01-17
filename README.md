# Muslim Mosque - Lecture Platform MVP

A web application that enables mosques to share Islamic lectures and educational content with their communities. Users can discover mosques, browse lecture categories, and access curated content from scholars and teachers.

## 🎯 MVP Features

### Core Functionality
- **Mosque Registration**: Mosques can create accounts and register with location details (country, state, local government area)
- **Admin Assignment**: Registered mosque owners can assign admin users to manage content
- **Lecture Categories**: Admins create custom categories (e.g., Hadith, Quran, Seerah, Fiqh, etc.)
- **Lecture Uploads**: Admins upload lectures under each category with metadata (speaker, date, description)
- **User Discovery**: Users can browse featured mosques and search for specific mosques
- **Category Browsing**: Users view lecture categories within a mosque and access lectures
- **User Accounts**: Users create accounts to unlock additional features and engagement

### Data Model

#### Mosque Schema
```
id: UUID (Primary Key)
name: VARCHAR
country: VARCHAR
state: VARCHAR
local_government: VARCHAR
description: TEXT
is_verified: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### Planned: Lecture Categories
```
id: UUID
mosque_id: UUID (Foreign Key)
name: VARCHAR (e.g., "Hadith", "Quran", "Tafsir")
description: TEXT
created_at: TIMESTAMP
```

#### Planned: Lectures
```
id: UUID
category_id: UUID (Foreign Key)
title: VARCHAR
speaker: VARCHAR
description: TEXT
video_url: VARCHAR
date: DATE
uploaded_at: TIMESTAMP
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/muslim-mosque.git
cd muslim-mosque

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or your configured port).

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Main navigation & search
│   └── MosqueCard.jsx      # Reusable mosque card component
├── pages/
│   ├── HomePage.jsx        # Landing page with featured mosques
│   ├── Mosque.jsx          # Mosque detail with lecture categories
│   ├── Signup.jsx          # User registration
│   ├── RegisterMosque.jsx  # Mosque registration
│   └── Login.jsx           # User login (placeholder)
├── data/
│   └── mockMosque.js       # Mock mosque data
├── App.jsx                 # Main app router (React Router)
└── main.jsx                # Entry point
```

## 🎨 Design System

- **Primary Color**: Emerald (`from-emerald-800 via-emerald-700 to-green-600`)
- **Accent**: White buttons for primary actions, Gray for secondary
- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Responsive**: Mobile-first design

## 🔄 Current User Flow

1. **Home Page**: Display 3 featured mosques as clickable cards
2. **Click Mosque Card**: Navigate to mosque detail page showing lecture categories
3. **Header Navigation**:
   - **Register Mosque** (center) → Create a new mosque entry
   - **Sign Up** (right) → User registration
   - **Log In** (right) → User login (placeholder)
4. **Search** (in progress): Filter mosques by name in header

## 📋 Development Roadmap

### Phase 1 (Current MVP)
- ✅ Mosque registration page
- ✅ User signup page
- ✅ Home page with featured mosques
- ✅ Mosque detail view with lecture categories
- ✅ Header navigation
- [ ] Fix dev server (currently debugging)

### Phase 2 (Next)
- [ ] Complete authentication (Sign Up, Log In, Logout)
- [ ] Admin dashboard for mosque owners
- [ ] Admin can assign other admins
- [ ] Lecture category management
- [ ] Implement lecture upload feature
- [ ] Search and filter functionality

### Phase 3
- [ ] Backend API integration (Node.js/Express)
- [ ] Database setup (PostgreSQL or MongoDB)
- [ ] Video streaming support
- [ ] User preferences & bookmarks
- [ ] Lecture playback tracking

### Phase 4
- [ ] Admin verification system
- [ ] User reviews & ratings for lectures
- [ ] Email notifications
- [ ] Analytics dashboard for admins
- [ ] Mobile app

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6
- **State Management**: React Hooks + localStorage (mock, will upgrade to real backend)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 💾 Data Persistence

**Currently**: localStorage (mock database) for development  
**Future**: Backend API with PostgreSQL/MongoDB

Registered mosques and users are stored in browser localStorage and reset on cache clear.

## 🚦 Getting Started Guide

### For Mosque Registration
1. Click **Register Mosque** button in header
2. Fill in mosque name, country, state, local government
3. Add optional description
4. Submit (saves to localStorage)

### For User Signup
1. Click **Sign Up** button in header
2. Fill in username, email, password, gender, date of birth
3. Submit (saves to localStorage)

### To View Mosque Details
1. From home page, click any mosque card
2. View lecture categories under that mosque
3. (Future) Click a category to view lectures

## 📝 License

[Add your license here]

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Last Updated**: January 2026  
**Status**: MVP Phase 1 (In Development)
