# MediShare: Revolutionizing Healthcare with Blockchain and AI

![WhatsApp Image 2025-04-06 at 21 56 37_730244e7](https://github.com/user-attachments/assets/638d2fcb-6f3b-4c9b-a849-a1bbd3d4d44e)

Welcome to **MediShare**, an innovative platform designed to transform healthcare by integrating blockchain technology, generative AI, and real-time communication. Our mission is to enhance patient care, ensure medication authenticity, and foster a collaborative health community.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
  - [1. Medical Report Summarization](#1-medical-report-summarization)
  - [2. Smart Medication Scanning](#2-smart-medication-scanning)
  - [3. Medicine Donation Network](#3-medicine-donation-network)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Introduction

In today's fast-paced world, accessing accurate medical information and authentic medications is crucial. **MediShare** addresses these challenges by offering:

- **Comprehensive Medical Summaries**: Upload medical reports to receive concise summaries, including diagnosed conditions, prescribed medications with their uses, and personalized lifestyle suggestions.
- **Medication Verification**: Scan medication QR codes to obtain detailed information, verify authenticity via blockchain, and prevent counterfeit drug usage.
- **Community-Driven Medicine Donations**: Connect with government hospitals, NGOs, and individuals to donate or acquire unused, unexpired medications, reducing waste and promoting health equity.

## Features

### 1. Medical Report Summarization

Utilizing generative AI, our platform analyzes uploaded medical reports to provide:

- **Diagnosed Conditions**: Clear identification of medical issues.
- **Prescribed Medications**: Details of medications, their purposes, and dosages.
- **Lifestyle Suggestions**: Tailored advice to support health and well-being.

*Example*: Upload a blood test report to receive insights into cholesterol levels with dietary recommendations.

### 2. Smart Medication Scanning

Our smart scanning feature enables users to:

- **Verify Medication Authenticity**: Scan QR codes to access blockchain-stored data, ensuring the medication's legitimacy.
- **Access Detailed Information**: Learn about medication uses, side effects, and guidelines.
- **Prevent Counterfeit Consumption**: Blockchain integration safeguards against fake medicines, promoting user safety.

*Example*: Before consuming a medication, scan its QR code to confirm its authenticity and access usage instructions.

### 3. Medicine Donation Network

**MediShare** fosters a community of care by enabling:

- **Donations of Unused Medications**: Individuals can donate unexpired medicines to those in need.
- **Collaboration with Hospitals and NGOs**: Streamlined processes for organizations to distribute medications effectively.
- **Duplication Prevention**: Blockchain ensures transparent tracking, preventing duplicate donations and misuse.

*Example*: A person with surplus medication can list it on the platform, allowing nearby hospitals or individuals to claim and utilize it appropriately.

### 4. AI-Powered Chatbot (RAG-Based)
MediShare includes an intelligent Retrieval-Augmented Generation (RAG) based chatbot to enhance user interaction and support. This chatbot is capable of:

Context-Aware Assistance: Understands platform policies, user queries, and donation workflows.

Real-Time Recommendations: Provides suggestions based on available medicines in the donation database, ensuring accurate and up-to-date information.

Document + Data Integration: Combines knowledge from uploaded reports and live backend data to offer highly personalized responses.

🔧 Powered By:

Groq API with Gamma Model: For fast and efficient natural language understanding.

FAISS Vector Database: To index and retrieve contextual data from donation records and policies.

LLaMA Embeddings: Used to convert textual data (like reports and medicines) into vector format for smarter retrieval.

Example: A user asks, “Can I donate expired medicine?” — the chatbot fetches policy context and responds accurately. Or, if asked, “Which painkillers are currently available for donation?” — it checks live data and replies accordingly.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Blockchain**:
  - **Smart Contracts**: Developed using Solidity
  - **Development Framework**: Hardhat
  - **API Integration**: Ethers.js
- **Artificial Intelligence**: Generative AI models for natural language processing and data summarization
- **Real-Time Communication**: WebSockets for live data updates
- **Database**: MongoDB
- **Deployment**: Docker and cloud platforms like AWS

## Architecture

**MediShare** is built with a modular architecture:

- **API Gateway**: Manages and routes user requests efficiently.
- **AI Service**: Processes medical reports and generates summaries with lifestyle recommendations.
- **Blockchain Service**: Manages smart contract interactions to verify medication authenticity and record donation transactions.
- **Real-Time Service**: Uses WebSockets to provide live updates and notifications to users.
- **Donation Matching Engine**: Connects donors with recipients by tracking and verifying medicine donations securely via blockchain.


## Usage

- **Medical Report Summarization:**  
  Navigate to the "Upload Report" section, submit your report, and instantly receive a summary with actionable insights.

- **Smart Medication Scanning:**  
  Use the "Scan Medication" feature to verify drug authenticity by scanning the QR code on your medicine. Receive detailed drug information and safety guidelines in real-time.

- **Medicine Donation:**  
  Register as a donor or recipient. Post available medicines or list needs, and let our donation matching engine connect you with government hospitals, NGOs, or individuals for safe, verified medicine transactions.

![WhatsApp Image 2025-04-06 at 21 57 49_af1926f4](https://github.com/user-attachments/assets/7950cad9-3029-44bf-8302-12f890ca6f83)
![WhatsApp Image 2025-04-06 at 21 58 42_fc796bbf](https://github.com/user-attachments/assets/78c23c0f-c0f6-4ac1-8c6f-17d633124f75)
![WhatsApp Image 2025-04-06 at 22 02 48_c66e2b95](https://github.com/user-attachments/assets/d32082fc-b663-407b-8752-a801710e07c1)
![WhatsApp Image 2025-04-06 at 22 03 20_84031096](https://github.com/user-attachments/assets/9383bbaf-2839-433d-8ae4-5fd04c813e24)


## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For collaboration, questions, or further information, please reach out:

- **Email:** priyansh56701@gmail.com
- **LinkedIn:** [Arman Singh](https://www.linkedin.com/in/arman-singh-9bb83628a/)

Join us in redefining healthcare. With MediShare, every medical report is simplified, every medication verified, and every donation transparently managed. Let's build a healthier future—together.
``` 

