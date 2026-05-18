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

**Q4.** A microservice application is being hosted in the ap-southeast-1 and ap-northeast-1 regions. The ap-southeast-1 region accounts for 80% of traffic, with the rest from ap-northeast-1. As part of the company’s business continuity plan, all traffic must be rerouted to the other region if one of the regions’ servers fails. Which solution can comply with the requirement?
A. Set up an 80/20 weighted routing in the application load balancer and enable health checks.
B. Set up an 80/20 weighted routing in the network load balancer and enable health checks.
C. Set up an 80/20 weighted routing policy in AWS Route 53 and enable health checks.
D. Set up a failover routing policy in AWS Route 53 and enable health checks.
✅ **Answer: C**

Explanation:

```
The correct solution for this scenario is to use AWS Route 53's weighted routing policy with health checks. This setup allows the distribution of traffic across multiple AWS regions based on assigned weights (in this case, 80% to ap-southeast-1 and 20% to ap-northeast-1) and automatically reroutes traffic if one region becomes unavailable due to server failure.

- Option C is correct because AWS Route 53’s weighted routing policy allows you to assign weights to resource record sets (RRS) which correspond to different AWS regions. When combined with health checks, Route 53 can monitor the health of the application in each region. If a region becomes unhealthy, Route 53 will reroute traffic to the healthy region based on the configured weights.
- Option A and B are incorrect because application and network load balancers operate at the regional level, not the global level. Therefore, they cannot reroute traffic between regions.
- Option D, while involving Route 53, suggests a failover routing policy, which is not suitable for distributing traffic with a specific percentage split across regions. Failover routing is typically used for active-passive failover, not for load distribution, which doesn't align with the requirement to handle traffic in an 80/20 proportion.

The weighted routing policy of AWS Route 53, with appropriate health checks, satisfies the business requirement by distributing traffic in the specified ratio and ensuring business continuity by redirecting traffic in the event of a regional failure.
```

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


