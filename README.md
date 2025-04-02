# Awake

## Deployment History

Due to a force merge, Git history is missing. However, you can verify the deployment logs on Vercel to confirm that this project was built from scratch.



![image]\([https://github.com/user-attachments/assets/436d1bc9-6949-4db5-9517-fb6c705af2c9](https://github.com/user-attachments/assets/436d1bc9-6949-4db5-9517-fb6c705af2c9))

![image]\([https://github.com/user-attachments/assets/1e45a325-88bc-4caf-b026-1e050eadf38e](https://github.com/user-attachments/assets/1e45a325-88bc-4caf-b026-1e050eadf38e))

![image]\([https://github.com/user-attachments/assets/c98f73c2-825d-42b8-b1e1-bd524a727f01](https://github.com/user-attachments/assets/c98f73c2-825d-42b8-b1e1-bd524a727f01))

## About Awake

Awake is a minimalistic goal-tracking platform designed to enhance productivity with AI-driven insights and seamless communication. It features real-time goal tracking, personalized analytics, and a WhatsApp-like messaging system for mentorship and collaboration.

[Product Demo](https://www.youtube.com/watch?v=pqpSk4MElFo)\
[Live Application](https://simple-nextjs-app-green.vercel.app/)

## Features

- **Goal Tracking** – Set, track, and refine personal objectives.
- **Personalized Insights** – AI-powered analytics tailored to user progress.
- **Real-Time Mentor Communication** – WhatsApp-like chat interface for productive discussions.
- **Integrated Mail Space** – Streamlined communication for better focus.
- **Persistent Context** – Shared memory creation for enhanced user interactions.

## Tech Stack

- **Frontend:** Next.js (TypeScript)
- **Backend:** Node.js
- **Database:** MongoDB
- **Authentication:** Custom Next.js authentication with Iron Session
- **State Management:** Currently using polling (WebSockets/SWR planned for future updates)
- **Deployment:** Vercel

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (latest LTS version)
- MongoDB (local or cloud instance)

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
   ```sh
   MONGODB_URI=your_mongo_connection_string
   NEXTAUTH_SECRET=your_secret_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage

- **Set Goals:** Define and monitor progress toward objectives.
- **Receive AI Insights:** Get personalized suggestions based on activity.
- **Chat with Mentors:** Engage in real-time conversations for guidance.
- **Stay Synced:** Automatic session-based state updates ensure continuity.

## Roadmap

- **Implement WebSockets for real-time updates**
- **Expand AI insights with deeper analytics**
- **Introduce task collaboration features**
- **Enhance UI for better usability**

## Contribution

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add feature XYZ'
   ```
4. Push the branch:
   ```sh
   git push origin feature-name
   ```
5. Open a Pull Request.

---

**Empowering users to achieve their goals with clarity, insights, and real-time mentorship.**

