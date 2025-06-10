# 💕 With Love

![Project Preview](https://via.placeholder.com/800x400/FF69B4/FFFFFF?text=With+Love+Preview)

> **🔗 [View project online](https://withlove.wbitencourt.dev)**

## 💝 About the Project

**With Love** is a romantic and interactive web application created especially to celebrate a couple's love. The project was developed with care to create a unique and personalized experience, combining:

- 📸 **Special photo slideshow** of the couple
- 🎵 **Music player** with the song that marks the relationship
- ⏰ **Time counter** showing exactly how long they've been together
- 💌 **Personalized love message**
- 💕 **Romantic animations** with floating hearts
- 📱 **Responsive design** that works perfectly on any device

### 🎯 Motivation

This project was born from the desire to create something special and unique to express love in a technological and creative way. In a digital world, nothing better than a personalized web application to eternalize special moments and create an interactive experience that can be visited at any time to remember shared love.

## 🚀 Technologies Used

- **Next.js 15** - React framework for web applications
- **React 19** - Library for building interfaces
- **TypeScript** - Language with static typing
- **Tailwind CSS** - Styling framework
- **Moment.js** - Date and time manipulation
- **Turbopack** - Ultra-fast bundler for development

## 🛠️ How to Run the Project

### Prerequisites

Make sure you have installed on your machine:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Step by step

1. **Clone the repository**

   ```bash
   git clone https://github.com/wbitencourt/with-love.git
   cd with-love
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the project in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access in browser**
   ```
   http://localhost:3000
   ```

### 🎵 Customizing Content

To customize the project with your own photos and music:

1. **Add your photos** to the `public/photos/` directory

   - Name the photos as: `1.png`, `2.png`, `3.png`, etc.
   - Recommendation: use photos in vertical format (9:16)

2. **Add your music** to the `public/audio/` directory

   - Recommended format: `.ogg` or `.mp3`
   - Update the path in the code if necessary

3. **Customize the relationship date**

   - Edit the date in `src/app/page.tsx` on the line with `startDate`

4. **Customize the love message**
   - Edit the text in the special message section of the `page.tsx` file

## 📁 Project Structure

```
with-love/
├── public/
│   ├── photos/          # Slideshow photos
│   ├── audio/           # Special music
│   └── favicon.ico
├── src/
│   └── app/
│       ├── page.tsx     # Main page
│       ├── layout.tsx   # Application layout
│       └── globals.css  # Global styles
├── package.json
└── README.md
```

## 🌟 Features

- ✨ **Entry screen** with interactive button
- 🎵 **Audio player** with native controls
- 📸 **Photo carousel** with arrow navigation and indicators
- ⏰ **Real-time counter** of the relationship
- 💫 **Floating hearts animations**
- 📱 **Responsive design** for all devices
- 🎨 **Romantic gradients and visual effects**

## 🚀 Deploy

To deploy the application:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Start in production**
   ```bash
   npm start
   ```

## 💖 Created with Love

This project was developed with great care and attention to detail to create a unique and special experience. Every line of code was thought to express love through technology.

---

_Made with 💕 to eternalize special moments_
