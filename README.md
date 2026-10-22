# 🩺 Physio Sathi
### AI-Powered Rehabilitation Discovery & Cost Planning

**Making rehabilitation discovery easier, one step at a time.**

Physio Sathi is a healthcare technology platform designed to simplify the
process of discovering physiotherapy services, comparing potential costs,
and researching rehabilitation equipment.

Finding appropriate physiotherapy services after an injury, fracture, or
surgery can be challenging. Patients and caregivers may need to search
multiple sources, contact providers individually, compare costs, and
research equipment purchase or rental options.

Physio Sathi aims to bring these activities into one connected journey
using AI-assisted preference organization, rule-based matching, and
TinyFish-powered external equipment research.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Target Users](#-target-users)
- [Key Features](#-key-features)
- [AI and Matching Approach](#-ai-and-matching-approach)
- [TinyFish Integration](#-tinyfish-integration)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Business Model](#-business-model)
- [Expected Impact](#-expected-impact)
- [Privacy and Clinical Safety](#-privacy-and-clinical-safety)
- [Future Scope](#-future-scope)
- [Limitations](#-limitations)
- [Contributing](#-contributing)
- [Team](#-team)
- [Project Links](#-project-links)
- [License](#-license)

---

## 🌟 Overview

Physio Sathi focuses on three connected parts of the rehabilitation journey:

1. **Physiotherapy Discovery** — Helping patients explore available
   physiotherapists and rehabilitation centres.

2. **Cost Planning** — Helping users compare available service information
   and understand potential expenses.

3. **Equipment Research** — Helping users research rehabilitation
   equipment purchase and rental options.

The platform combines a modern web application with AI assistance and
external information retrieval to make rehabilitation-related research
more organized and convenient.

### Our Vision

To make rehabilitation discovery more accessible and convenient by
connecting patients, caregivers, physiotherapists, and rehabilitation
equipment providers through a unified digital experience.

---

## ❗ Problem Statement

Patients recovering from fractures, injuries, or surgery often face
several challenges when searching for rehabilitation services.

### 1. Fragmented Provider Discovery

Patients may depend on phone calls, personal recommendations, messaging
groups, and separate online searches to find physiotherapists.

### 2. Difficulty Comparing Costs

Home visits, rehabilitation-centre visits, transportation, and other
expenses can make it difficult to understand the overall potential cost
of rehabilitation.

### 3. Equipment Purchase and Rental

Some rehabilitation equipment may only be needed temporarily. Patients
may want to investigate rental alternatives before purchasing equipment.

### 4. Information Overload

Information about providers, prices, and equipment can be spread across
different websites and sources, making comparison time-consuming.

### 5. Local Provider Discovery

Physiotherapists may benefit from being discovered by patients within
their service areas, while patients need relevant local options.

Physio Sathi aims to address these challenges by bringing care discovery,
cost planning, and equipment research into one connected workflow.

---

## 💡 Our Solution

Physio Sathi is designed to help users move from describing their needs
to reviewing relevant rehabilitation options.

The proposed journey is:

1. The user enters relevant preferences, such as location, budget, and
   preferred visit type.
2. The application searches available provider listings.
3. Matching logic filters options according to relevant criteria.
4. Users compare available provider information and potential costs.
5. AI assistance helps organize preferences and explain available
   information.
6. TinyFish supports research into relevant external equipment pages.
7. Users review the results and follow the next step supported by the
   application.

The platform is intended to support informed discovery rather than
replace professional medical judgment.

---

## 👥 Target Users

### Patients

People recovering from injuries, fractures, or surgery who need help
discovering physiotherapy services and researching rehabilitation
equipment.

### Caregivers and Family Members

People helping patients arrange care, compare potential expenses, and
investigate available options.

### Physiotherapists

Professionals who may benefit from improved visibility among relevant
local patients and enquiries.

### Rehabilitation Equipment Providers

Businesses offering rehabilitation equipment for purchase or rental
that may benefit from additional product discovery and enquiries.

---

## ✨ Key Features

### 1. Physiotherapist Discovery

Explore available physiotherapists and rehabilitation centres using
relevant search preferences and available provider information.

### 2. Provider Matching

Filter available listings using criteria such as location, visit type,
budget, and other supported preferences.

### 3. Cost Planning

Compare available cost information and calculate estimates using
explicit application logic.

Actual prices may vary by provider and service. Estimates should not be
treated as guaranteed quotations.

### 4. AI-Assisted Preference Organization

Help users express their requirements in natural language and organize
those preferences into a more structured format.

### 5. Rehabilitation Equipment Research

Investigate external equipment information, including purchase or rental
options where available.

### 6. Source-Aware Results

Provide original-source links where available so users can verify
important details directly.

### 7. User-Friendly Interface

Provide a web-based experience intended to make provider discovery,
cost comparison, and equipment research easier to navigate.

> **Implementation note:** The exact availability of these features
> depends on the current application build. Only describe a feature as
> implemented if it is working in the deployed or tested application.

---

## 🤖 AI and Matching Approach

Physio Sathi separates AI assistance from deterministic application logic.

### AI Assistance

AI can help with:

- Understanding natural-language preferences.
- Organizing user requirements.
- Asking relevant clarification questions, where supported.
- Explaining available options.
- Summarizing retrieved equipment information.

AI-generated summaries may be incomplete and should remain reviewable.

### Rule-Based Matching

The application's matching logic can filter available provider listings
according to explicit criteria.

Examples include:

- Location or PIN-code matching.
- Preferred visit type.
- Budget constraints.
- Availability of relevant provider information.

The criteria used depend on the fields and data available in the
application.

### Deterministic Cost Calculations

Cost estimates should be calculated using explicit application logic
and available input values rather than relying on an AI model to invent
prices.

### Important Distinction

Using an AI API does not mean that Physio Sathi necessarily uses a
custom-trained machine-learning model.

Unless a custom model has actually been trained and evaluated, the AI
component should be described as AI-assisted preference understanding
and information organization.

---

## 🌐 TinyFish Integration

TinyFish is intended to support external rehabilitation-equipment
research.

Internal application data may not contain every relevant equipment
option. External information retrieval can help users investigate
additional sources.

### Proposed Workflow

1. **Request Validation**

   The backend validates the equipment research request.

2. **External Search**

   TinyFish Search identifies potentially relevant external pages and
   URLs.

3. **Page Retrieval**

   TinyFish Fetch can retrieve selected page content when needed.

4. **Information Organization**

   Available fields may include product names, listed prices, rental
   terms, and source URLs.

5. **Source Presentation**

   The application organizes available information and provides
   original-source links where possible.

6. **User Verification**

   Users review the information and verify important details with the
   original source.

### Why TinyFish?

TinyFish can help extend equipment research beyond information already
stored in the application's internal database.

This integration is intended to reduce the effort required to discover
and compare external equipment information.

### Responsible Use

- External pages may be unavailable or change over time.
- Not every page contains all required fields.
- Listed prices and rental terms may be outdated.
- Retrieved information must not be treated as proof of seller
  reliability or medical suitability.
- Users should verify important information with the original source.

**Integration status:** Update this section to describe the exact
TinyFish capabilities that have been implemented and tested. If Search
or Fetch is not yet integrated, identify it as planned functionality
rather than a completed feature.

---

## 🛠️ Technology Stack

The intended technology stack includes the following technologies.

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| Tailwind CSS | Styling and responsive layouts |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modelling |
| AI API | Natural-language assistance, if configured |
| TinyFish Search | External equipment-page discovery |
| TinyFish Fetch | External page-content retrieval |

The final stack should reflect the actual dependencies and services
configured in the repository.

---

## 🏗️ System Architecture

The proposed architecture separates the frontend, backend, internal
data, and external services.

```text
                 USER
                   |
                   v
          REACT + VITE FRONTEND
                   |
                   v
             EXPRESS API
                   |
                   v
          APPLICATION LOGIC
          /        |        \
         /         |         \
        v          v          v
  MONGODB       AI API     TINYFISH
  ATLAS                    SEARCH/FETCH
        |          |          |
        v          v          v
  INTERNAL     AI-ASSISTED   EXTERNAL
  LISTINGS     EXPLANATIONS  INFORMATION
        \          |          /
         \         |         /
          v        v        v
         NORMALIZED RESULTS
                   |
                   v
          USER REVIEWS OPTIONS

          💚 Final Note




Physio Sathi explores how AI assistance, transparent cost planning,
provider discovery, and external equipment research can work together
to simplify rehabilitation-related decisions.

Our goal is to make the discovery process more organized and convenient
for patients and caregivers while creating potential opportunities
for physiotherapists and equipment providers.
