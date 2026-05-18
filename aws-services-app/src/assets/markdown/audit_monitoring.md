# 📊 AWS Audit & Monitoring – Flash Card

---

## ☁️ Amazon CloudWatch

### ✅ Keypoints Summary
1. **Monitoring & observability** service for AWS resources & applications.  
2. Collects **metrics, logs, and events** for real-time visibility.  
3. Integrates with alarms, dashboards, and automation.  

---

### 📈 CloudWatch Metrics
- Built-in for all AWS services (e.g., EC2 CPUUtilization, S3 BucketSize).  
- Custom metrics can be published (e.g., from apps).  
- Supports **high-resolution metrics** (up to 1 sec granularity).  

---

### 📝 CloudWatch Logs
- Collects logs from: EC2, Lambda, CloudTrail, API Gateway, VPC Flow Logs, etc.  
- **Subscription filters** → stream logs to **Lambda, Kinesis, or ElasticSearch** for processing.  

---

### 🏢 Multi-Account Aggregation
- **CloudWatch cross-account observability** → aggregate metrics/logs from multiple AWS accounts & Regions.  

---

### 🖥️ CloudWatch Agents
- **Old Logs Agent**: collects logs only.  
- **Unified Agent**: collects **logs + metrics** (OS-level like memory, disk, processes).  

---

### 🚨 CloudWatch Alarms
- Trigger actions when metrics cross a threshold.  
- Actions: **SNS notification, Auto Scaling, EC2 recovery**.  

---

### 🔍 CloudWatch Insights
- Advanced log analytics tools:  
  - **Logs Insights** → query logs.  
  - **Container Insights** → monitor ECS/EKS.  
  - **Lambda Insights** → function-level metrics.  
  - **Contributor Insights** → top contributors to traffic/errors.  
  - **Application Insights** → detect anomalies in app performance.  

---

## 🛡️ AWS CloudTrail

### ✅ Keypoints Summary
1. Provides **governance, compliance, and audit logs** of AWS API activity.  
2. Records all **management events** (control plane) and optional **data events** (e.g., S3 object access, Lambda invoke).  
3. Default trail per account (90-day history in Event Viewer).  

---

### 🔗 Integration
- Can send logs to **S3** for long-term storage.  
- Can stream to **CloudWatch Logs** for real-time monitoring.  

---

### 📌 CloudTrail Events
- **Management Events** → account & resource config changes.  
- **Data Events** → object/data-level (e.g., S3 `GetObject`, Lambda `Invoke`).  
- **Insights Events** → detect unusual API activity (e.g., burst of failed logins).  

---

## 🛠️ AWS Config

### ✅ Keypoints Summary
- Tracks **resource configuration changes over time**.  
- Helps with **compliance, auditing, troubleshooting**.  
- Stores config history in S3 and integrates with CloudWatch Events.  

---

### 📏 Config Rules
- Predefined or custom rules (e.g., “EBS volumes must be encrypted”).  
- Evaluate resource compliance automatically.  

### 🔧 Config Rules Remediation
- Can trigger **Systems Manager Automation Docs (SSM)** to auto-remediate non-compliance.  

### 🔔 Config Notifications
- Sends compliance change notifications via **SNS or EventBridge**.  

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which service provides **API activity history** for auditing?  
A. CloudWatch  
B. CloudTrail  
C. Config  
D. GuardDuty  
✅ **Answer: B**

---

**Q2.** Which CloudWatch feature allows analyzing logs with SQL-like queries?  
A. Contributor Insights  
B. Logs Insights  
C. Metrics Explorer  
D. Unified Agent  
✅ **Answer: B**

---

**Q3.** Which Config feature allows enforcing compliance via automatic correction?  
A. Config Rules  
B. Config Remediations  
C. Config Snapshots  
D. Config Aggregator  
✅ **Answer: B**

---

### 🔹 True / False
**Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.  
✅ True  

**Q5.** CloudTrail Insights automatically fixes misconfigurations.  
❌ False 
Explanation:
```
That's **Config Remediation**.  
```

**Q6.** CloudWatch Alarms can trigger Auto Scaling policies.  
✅ True  

---

✅ **Exam Tip**:  
- **CloudWatch = Monitoring (metrics/logs)**.  
- **CloudTrail = Auditing (API calls/events)**.  
- **Config = Compliance (resource config history & rules)**.  
Expect scenario-based questions like *“Which service do you use to detect unusual login attempts?”* → **CloudTrail Insights**.
