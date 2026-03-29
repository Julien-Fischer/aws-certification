# 📌 AWS Lambda – Revision Card

## 📝 Introduction
AWS Lambda is a **serverless compute service** that runs code without provisioning or managing servers.

### ✅ Key Principles
1. **Event-driven execution** – Runs code in response to events (S3, API Gateway, DynamoDB, etc.).
2. **Fully managed infrastructure** – No server management, scales automatically.
3. **Pay-per-use** – Billed by execution time and resources consumed.

---

## 🚀 Advantages
- **Serverless**: No servers to manage.
- **On-demand execution**: Code runs only when scheduled or triggered.
- **Automatic scaling**: Instantly scales with workload.

---

## ⏳ Limits per Region
- **Execution time**: Up to **15 minutes** per function.
- **Memory allocation**: From **128 MB to 10 GB**.
- **Concurrency executions**: Default **1,000+ concurrent executions** per account (can be increased).
- **Notes**: Cold start issues may occur for some runtimes.

---

## ⚡ Features
- **Lambda SnapStart**: Reduces cold start latency for Java functions by initializing and caching execution environments.
- **Environment variables** for configuration.
- **Layers** to share code across functions.

---

## 🌍 Lambda@Edge vs CloudFront Functions
| Feature              | Lambda@Edge                                                     | CloudFront Functions                                 |
|----------------------|-----------------------------------------------------------------|------------------------------------------------------|
| Execution location   | Edge locations                                                  | Edge locations                                       |
| Runtime              | Node.js, Python                                                 | Lightweight JS only                                  |
| Max execution time   | ~5 seconds                                                      | <1 ms                                                |
| Use cases            | Complex request/response manipulation (auth, headers, rewrites) | Simple header manipulation, redirects, caching logic |
| Cost                 | Higher                                                          | Lower                                                |

---

## 🔗 Lambda with VPC & Proxy
- By default, Lambda runs **outside your VPC**.
- To access **private resources (RDS, EC2, ElastiCache)** → attach Lambda to a VPC (requires ENIs, increases cold start time).
- Can act as a **proxy** via API Gateway.

---

## 📊 Integrations
- **CloudWatch**:
    - Logs function output automatically.
    - Metrics on invocations, errors, duration, concurrency.
- **CloudTrail**: Audit API calls.
- **X-Ray**: Trace function performance.

---

## 💻 Compatible Runtimes
- Supported languages: **Python, Node.js, Java, Go, Ruby, .NET, PowerShell**.
- **Custom runtimes** supported via Runtime API.
- **Lambda container images**: Deploy using Docker images (up to 10 GB).

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which of the following is a valid use case for Lambda SnapStart?  
A. Reduce cold start for Java functions.  
B. Speed up Node.js Lambda invocations.  
C. Allow longer execution time.  
D. Reduce Lambda costs by 50%.

✅ **Answer: A**

---

**Q2.** What is the maximum execution time for a Lambda function?  
A. 5 minutes  
B. 10 minutes  
C. 15 minutes  
D. Unlimited

✅ **Answer: C**

---

**Q3.** Which service is best for **simple header manipulations** at CloudFront edge locations?  
A. Lambda standard function  
B. Lambda@Edge  
C. CloudFront Functions  
D. EC2 at edge

✅ **Answer: C**
