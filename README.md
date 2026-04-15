# 🚀 Slang Sense

Slang Sense is a full-stack AI-powered web application designed to decode and explain modern internet slang. It helps users understand Gen-Z, Gen-Alpha, and evolving digital language by combining fast dataset-based lookup with intelligent AI-driven analysis.

---

## 🎯 Purpose

The goal of Slang Sense is to bridge the gap between rapidly evolving internet language and user understanding. As slang changes quickly across social media and communities, this platform provides a reliable way to interpret meanings, tone, and context in real time.

---

## ✨ Features

- 🔍 **Slang Detection** – Identify slang words and phrases instantly  
- 🧠 **AI Fallback Analysis** – Handles unknown slang using AI  
- 💬 **Sentence-Level Interpretation** – Understand full conversations  
- 📚 **Searchable Slang Library** – Explore stored slang terms  
- 🔥 **Trending Slang** – Discover popular internet expressions  
- 📅 **Slang of the Day** – Daily learning feature  
- 🤖 **Chatbot Interface** – Interactive slang explanations  
- 🏷️ **Generation Tagging** – Labels like Gen-Z, Gen-Alpha, Millennial  

---

## 🛠️ Tech Stack

### 👨‍💻 Languages Used
- TypeScript
- JavaScript
- HTML
- CSS

### ⚙️ Frameworks & Libraries
- Next.js
- React

### 🗄️ Data Handling
- CSV Dataset (Urban Dictionary-based slang data)

---

## 🤖 AI Integration

Slang Sense integrates AI to enhance understanding beyond predefined data.

- Uses AI models for **fallback analysis**
- Interprets **unseen or new slang**
- Generates:
  - Meaning
  - Tone (casual, sarcastic, offensive, etc.)
  - Example usage
  - Contextual explanation

This ensures the app stays relevant even as language evolves.

---

## 🔌 API Architecture

The application uses **Next.js API Routes** to handle backend logic.

### Key API Responsibilities:
- Process user input
- Check slang against local dataset
- Trigger AI fallback when needed
- Return structured response to frontend

---

## ⚙️ How It Works

Slang Sense follows a **hybrid processing pipeline**:

1. **User Input**
   - User enters a slang word, phrase, or sentence

2. **Dataset Lookup**
   - System checks local CSV dataset for a match

3. **Condition Check**
   - ✅ If found → return stored meaning  
   - ❌ If not found → trigger AI analysis  

4. **AI Processing**
   - AI interprets the input contextually

5. **Response Output**
   - Meaning  
   - Tone  
   - Example  
   - Generation category  

---

## 🌐 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/Slang-Sense.git
cd Slang-Sense
