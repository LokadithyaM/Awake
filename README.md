# Awake

**A minimalistic goal-tracking platform with personalized insights powered by gemini and a personal mail space that is built for your productivity.**

[Product demo]\(https\://www\.youtube.com/watch?v=pqpSk4MElFo)

## Overview

Awake is a focused productivity tool designed to help users track their goals efficiently while receiving personalized insights. It also enables seamless communication with mentors via a WhatsApp-like interface. The platform leverages shared memory creation and dynamic refresh for an intuitive and real-time experience.

## Features

- **Goal Tracking**: Set, track, and refine personal goals.
- **Personalized Insights**: AI-driven analytics tailored to user progress.
- **Mentor Communication**: WhatsApp-like chat interface for real-time discussions.
- **Shared Memory Creation**: Persistent user context for meaningful interactions.

## Tech Stack

- **Frontend**: Next.js (TypeScript)
- **Backend**: Node.js
- **Database**: MongoDB
- **Authentication**: Custom Next.js auth, Iron Session
- **State Management**: currently using polling.
- **Deployment**: Vercel

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (latest LTS)
- MongoDB

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/awake.git
   cd awake
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file and configure the following:
   ```env
   MONGODB_URI=your_mongo_connection_string
   NEXTAUTH_SECRET=your_secret_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage

- **Set Goals**: Define and monitor progress toward your objectives.
- **Receive Insights**: AI-powered suggestions based on your activity.
- **Chat with Mentors**: Real-time messaging for guidance and feedback.
- **Stay Synced**: Automatic session-based state updates.

## Roadmap

-

## Contribution

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature XYZ'`
4. Push the branch: `git push origin feature-name`
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

---

*Empowering users to achieve goals with clarity, insights, and real-time mentorship.*

