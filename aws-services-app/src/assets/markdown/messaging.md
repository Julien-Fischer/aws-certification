# 📩 AWS Messaging – Flash Card

---

## 📦 Amazon SQS (Simple Queue Service)

### 🔹 Key Principles
- **Fully managed message queueing** service.
- **Decouples producers & consumers** (asynchronous communication).
- Messages are stored **durably across AZs** until processed/deleted.
- **Pull-based model** → consumers poll messages.
- Messages can be **delayed** or sent with **visibility timeout**.
- Integrates with **Lambda, EC2, ECS, S3 events, etc.**

### 🔹 FIFO Queues (First-In, First-Out)
- Guarantee **message order**.
- **Exactly-once processing** (no duplicates).
- Support **message groups** for parallelism.
- Lower throughput than standard queues (up to 3,000 msg/s with batching).

---

## 📢 Amazon SNS (Simple Notification Service)

### 🔹 Key Principles
- **Fully managed pub/sub** messaging service.
- **Push-based model** → publishers send messages, subscribers receive them.
- Supports multiple protocols: **HTTP/S, Email, SMS, Lambda, SQS, Kinesis Firehose**.
- Highly available and durable (multi-AZ).

### 🔹 Advanced Features
- **Message filtering** → subscribers only receive messages matching specific attributes.
- **Cross-region delivery** → publish in one region, deliver to endpoints in others.
- Fan-out pattern: SNS → multiple SQS queues/Lambdas in parallel.

---

## 📨 Amazon MQ
- **Managed message broker** for **Apache ActiveMQ & RabbitMQ**.
- Ideal for **migrating legacy apps** using standard messaging APIs (JMS, NMS, AMQP, MQTT, STOMP).
- Provides **broker failover, HA, encryption in transit & at rest**.
- Use case: hybrid environments needing **open protocols**.

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which service guarantees message ordering and exactly-once delivery?  
A. SNS  
B. SQS Standard  
C. SQS FIFO  
D. Amazon MQ  
✅ **Answer: C**

---

**Q2.** Which AWS service supports **pub/sub push messaging with filtering**?  
A. SQS  
B. SNS  
C. Kinesis Data Streams  
D. MQ  
✅ **Answer: B**

---

**Q3.** You need to migrate an on-prem app using **JMS API** to AWS without rewriting code. Which service do you choose?  
A. SQS  
B. SNS  
C. Amazon MQ  
D. Kinesis  
✅ **Answer: C**

---

### 🔹 True / False
**Q4.** SQS is pull-based, SNS is push-based.  
✅ True

**Q5.** SNS supports cross-region delivery.  
✅ True

**Q6.** Amazon MQ is better for new cloud-native apps than SQS/SNS.  
❌ False (SQS/SNS are preferred for new apps).

---

✅ **Exam Tip**:
- **SQS = queueing (decouple, pull model).**
- **SQS FIFO = strict ordering, exactly-once.**
- **SNS = pub/sub, push model, filtering, cross-region.**
- **Amazon MQ = legacy migration with open protocols.**  
