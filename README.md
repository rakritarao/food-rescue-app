<div align="center">

# 🍲 Food Rescue

### Real-time food waste redistribution network

*Connecting restaurants with surplus food to shelters and NGOs to reduce food wastage and help those in need.*

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)]()

[Problem](#-the-problem) • [Solution](#-the-solution) • [Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Impact](#-impact-metrics) • [Roadmap](#-roadmap)

</div>

---

## Overview

**Food Rescue** is a mobile-first coordination platform that closes the gap between restaurants with surplus prepared food and the shelters, food banks, and NGOs that need it, in real time. Unlike consumer marketplaces that sell surplus food at a discount, Food Rescue is purpose-built for **charitable redistribution**, with a verified-NGO network and a volunteer driver layer to physically move food from kitchen to community.

> Restaurants throw away an estimated **40% of prepared food daily**. Most of it is edible, safe, and simply unclaimed. Food Rescue exists to make sure "surplus" never means "wasted."

---

## The Problem

- Restaurants generate large volumes of surplus, safe-to-eat food every single day.
- Nearby shelters and food banks are frequently **unaware** the surplus exists, or find out too late to collect it.
- Existing platforms like **Too Good To Go** solve a *consumer* problem (cheap food for individuals), not a *charity* problem (getting food to people who need it most).

## The Solution

Food Rescue is a three-sided real-time marketplace:

| Actor | Role |
|---|---|
| **Restaurants** | Post surplus food listings in seconds — item, quantity, pickup window |
| **Shelters / NGOs** | Get instant push notifications for nearby listings and claim pickups |

Both sides operate on a shared real-time feed, so a surplus post can go from *"we have 20 meals left over"* to *"picked up and delivered"* in minutes.

---

## Features

- **Real-time surplus listings** : restaurants post food with photos, quantity, allergen notes, and pickup windows
- **Instant push notifications** : verified NGOs are alerted the moment a nearby listing goes live
- **NGO verification layer** : shelters and food banks are vetted before they can claim listings
- **Pickup window & location logic** : time-boxed claims prevent food from being "reserved and forgotten"
- **Impact dashboard** : kilograms of food saved and meals delivered, tracked per restaurant and per city
- **In-app coordination** : lightweight chat/status updates between restaurant, NGO, and driver for a given handoff

---

## Architecture

```
┌──────────────────┐         ┌───────────────────────┐         ┌──────────────────┐
│   Restaurant     │         │                       │         │   Shelter / NGO  │
│   (React Native) │───────▶│   Firebase Backend     │───────▶│  (React Native)  │
│                  │        │                        │         │                  │
│  Post surplus    │        │  • Firestore (data)    │         │  Receive push    │
│  food listing    │        │  • Cloud Functions     │         │  notification    │
└──────────────────┘        │  • Cloud Messaging     │         │  Claim listing   │
                            │  • Cloud Messaging     │         │  Claim listing   │
                            │  • Auth (verification) │         └──────────────────┘
                            │  • Realtime updates    │
                            └────────────────────────┘
```

**Core data flow:**
1. Restaurant creates a listing → written to **Firestore**.
2. A **Cloud Function** triggers on new-listing writes, geo-queries nearby verified NGOs, and fans out **push notifications** via **Firebase Cloud Messaging**.
3. First NGO to claim locks the listing (optimistic locking / transaction) to prevent double-claims.
4.  Status updates (claimed → picked up → delivered) propagate in real time to all parties.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native |
| **Backend / Database** | Firebase (Firestore) |
| **Real-time messaging** | Firebase Cloud Messaging (FCM) |
| **Auth & Verification** | Firebase Authentication |
| **Serverless logic** | Cloud Functions for Firebase |
| **Geolocation** | Geo-queries for proximity matching (restaurant ↔ NGO) |

---

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- React Native development environment ([official setup guide](https://reactnative.dev/docs/environment-setup))
- A Firebase project with Firestore, Auth, and Cloud Messaging enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/food-rescue.git
cd food-rescue

# Install dependencies
npm install

# Add your Firebase config
cp .env.example .env
# then fill in your Firebase project credentials in .env

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

### Environment Variables

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

---
