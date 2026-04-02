# 🌐 Amazon Route 53 – Flash Card

---

## 📝 Route 53 Keypoints
- **DNS + Domain registration service**.
- **Highly available & fully managed** (globally distributed).
- Supports **domain registration, DNS resolution, and health checks**.
- Can route traffic **within AWS and to external resources**.

---

## 📑 Record Types (Focus: CNAME vs Alias)
- **CNAME (Canonical Name)**
    - Maps a domain name → another domain name.
    - Cannot be used for the **root domain** (e.g. `example.com`).

- **Alias Record (AWS-specific)**
    - Points a domain → **AWS resource** (e.g. ELB, CloudFront, S3 website, API Gateway).
    - Works for **root domain**.
    - Alias queries are **free**.

⚠️ **Limitation**: You cannot set an **Alias record** for an **EC2 public DNS name**.

---
## Best Practices

- Use health checks for critical applications
- Implement multiple routing policies for redundancy
- Monitor DNS query patterns and performance
- Use alias records for AWS resources when possible
- Set appropriate TTL values for your records
- Regularly review and update DNS configurations
- Use Route 53 Resolver for hybrid cloud DNS resolution

---

## 🎯 AWS Record Targets
- Common alias targets include:
    - **Elastic Load Balancers (ALB/NLB/CLB)**
    - **CloudFront distributions**
    - **S3 static websites**
    - **API Gateway**
    - **Global Accelerator**

---
## Domain Registration
- Register new domain names
- Transfer existing domains
- Manage domain renewals

---

## 🧭 Routing Policies
1. **Simple** → one record, returns all values (no health checks).
2. **Weighted** → split traffic by % between resources.
3. **Latency-based** → direct users to region with lowest latency.
4. **Failover** → primary/secondary setup with health checks.
5. **Geolocation** → based on user’s location.
6. **Geoproximity (traffic flow only)** → bias routing based on distance & weights.
7. **Multi-value Answer** → returns multiple healthy IPs (basic load balancing).

---

## 🔄 Multi-Value vs Routing Policies
- **Multi-value Answer** → returns several healthy records (like simple load balancing).
- Not as advanced as **ELB** or traffic policies but useful for redundancy.
- Works with **health checks**.

---

## 🏗️ Hybrid DNS with Route 53
- Allows **private DNS resolution in VPCs** + public DNS via Route 53.
- Useful for **hybrid cloud architectures**.

---

## 🔌 Resolver Endpoints
- **Inbound endpoint**: allows on-prem DNS → query Route 53 private hosted zones.
- **Outbound endpoint**: allows VPC resources → resolve DNS queries to on-prem servers.
- Common in **hybrid environments with Direct Connect or VPN**.

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which record type allows mapping the root domain (`example.com`) to an ELB?  
A. CNAME  
B. Alias  
C. A record  
D. TXT  
✅ **Answer: B (Alias)**

---

**Q2.** Which routing policy allows traffic distribution across multiple regions based on network latency?  
A. Simple  
B. Weighted  
C. Latency-based  
D. Failover  
✅ **Answer: C**

---

**Q3.** Which Route 53 feature enables AWS → On-prem DNS resolution?  
A. Alias Records  
B. Resolver Endpoints  
C. Multi-Value Answer  
D. Failover Policy  
✅ **Answer: B**

---

### 🔹 True / False
**Q4.** Alias records are free, while CNAME queries are billed.  
✅ True

**Q5.** Alias records can point to EC2 public DNS names.  
❌ False

**Q6.** Multi-Value Answer is a full replacement for load balancers.  
❌ False

---

✅ **Exam Tip**:
- **Alias > CNAME** in AWS (root support, free queries, AWS targets).
- **Routing policies** = key exam topic (expect scenario-based Qs).
- **Hybrid DNS & Resolver Endpoints** show up in VPC + hybrid architectures.


