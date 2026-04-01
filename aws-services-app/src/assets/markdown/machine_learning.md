# 🤖 AWS Machine Learning Services – Revision Card

---

## 📝 Key AWS ML Services (Summary in Keypoints)

### 👁️ Amazon Rekognition
- Image & video **analysis service**.
- Detects **objects, faces, text, inappropriate content**.
- Supports **facial analysis and comparison**.

---

### 🎙️ Amazon Transcribe
- **Speech-to-text** service.
- Converts audio files into text.
- Supports multiple languages, custom vocabularies, and real-time transcription.

---

### 🗣️ Amazon Polly
- **Text-to-speech** service.
- Converts text into **lifelike speech**.
- Supports multiple voices and languages (neural TTS available).

---

### 🌐 Amazon Translate
- **Neural machine translation** service.
- Real-time, scalable text translation.
- Useful for **multilingual applications**.

---

### 💬 Amazon Lex
- **Conversational AI** service (chatbots & voice bots).
- Provides **automatic speech recognition (ASR)** + **natural language understanding (NLU)**.
- Powers **Amazon Alexa**.

---

### ☎️ Amazon Connect
- **Cloud-based contact center** service.
- Uses Lex for chat/voice bots.
- Provides intelligent routing, customer engagement, and analytics.

---

### 🧠 Amazon Comprehend
- **Natural language processing (NLP)**.
- Detects **sentiment, key phrases, language, entities, topics** in text.
- Supports custom classification & entity recognition.

---

### 🧪 Amazon SageMaker
- Fully managed platform for **ML model building, training, and deployment**.
- Provides built-in algorithms, Jupyter notebooks, and auto-scaling endpoints.
- Reduces complexity of ML lifecycle management.

---

### 🔍 Amazon Kendra
- **Enterprise search service** powered by ML.
- Lets users ask **natural language questions** across indexed documents.
- Supports connectors for SharePoint, S3, Salesforce, etc.

---

### 🎯 Amazon Personalize
- **Real-time recommendation engine** (like Amazon.com personalization).
- Provides **personalized product or content recommendations**.
- No ML expertise required.

---

### 📄 Amazon Textract
- Extracts text, handwriting, and data from **scanned documents**.
- Detects **tables and forms** beyond simple OCR.
- Useful for automating document workflows.

---

### ⚙️ Amazon Bedrock
- **Serverless foundation model (FM) service** for building **generative AI applications**.
- Provides access to top foundation models (Anthropic Claude, Amazon Titan, etc.).
- Integrates with other AWS tools (SageMaker, Kendra, etc.) for **customization, fine-tuning, and orchestration**.
- Ideal for **text generation, summarization, chatbots, and knowledge assistants**.

---

### 🧩 Amazon Bedrock AgentCore
- **Framework within Bedrock** for managing **AI agents** that take actions via APIs or data sources.
- Lets developers define **reasoning, orchestration, and tool-use logic** for AI systems.
- Supports **retrieval-augmented generation (RAG)** and **secure data access**.
- Simplifies deployment of **autonomous or semi-autonomous AI agents** built on foundation models.

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice

**Q1.** Which service is used for **image and video analysis**?  
A. Comprehend  
B. Rekognition  
C. Textract  
D. Kendra  
✅ **Answer: B**

---

**Q2.** Which service provides **chatbot building with natural language understanding**?  
A. Polly  
B. Lex  
C. Connect  
D. Transcribe  
✅ **Answer: B**

---

**Q3.** Which service would you use to **extract structured data from scanned forms**?  
A. Translate  
B. Rekognition  
C. Textract  
D. Comprehend  
✅ **Answer: C**

---

**Q4.** Which service powers **real-time personalized recommendations**?  
A. SageMaker  
B. Personalize  
C. Kendra  
D. Comprehend  
✅ **Answer: B**

---

**Q5.** Which service provides **foundation models for generative AI apps**?  
A. SageMaker  
B. Bedrock  
C. Polly  
D. Kendra  
✅ **Answer: B**

---

**Q6.** Which service helps developers **create and orchestrate generative AI agents**?  
A. Bedrock AgentCore  
B. Comprehend  
C. Lex  
D. Connect  
✅ **Answer: A**

---

### 🔹 True / False

**Q7.** Amazon Polly is used to convert speech into text.  
❌ False (that’s **Transcribe**).

**Q8.** Amazon Connect can integrate with Lex to provide intelligent customer support.  
✅ True

**Q9.** SageMaker is only for training ML models, not for deployment.  
❌ False (it covers **training + deployment**).

**Q10.** Amazon Bedrock provides foundation models to build generative AI applications.  
✅ True

**Q11.** Amazon Bedrock AgentCore is used to train models from scratch.  
❌ False (it orchestrates **agent behavior and tool use**, not training).

---

✅ **Exam Tip**: Be ready for scenario questions like:
- “Which service to build a **chatbot** → **Lex**.”
- “Which service to analyze **customer sentiment in reviews** → **Comprehend**.”
- “Which service to build a **recommendation system** → **Personalize**.”
- “Which service for **enterprise document search** → **Kendra**.”
- “Which service to build a **generative AI app using FMs** → **Bedrock**.”
- “Which service to build **AI agents that invoke APIs** → **Bedrock AgentCore**.”