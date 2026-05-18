# 📌 Amazon EC2 (Elastic Compute Cloud) – Flash Card

---

## 📝 Introduction
Amazon EC2 (Elastic Compute Cloud) provides **resizable compute capacity** in the AWS cloud.

### ✅ Key Principles
1. **Virtual servers in the cloud** – Instances launched with chosen CPU, memory, and storage.
2. **Scalable & elastic** – Easily scale up/down using Auto Scaling and Load Balancing.
3. **Integrated with AWS ecosystem** – Works with EBS, IAM, VPC, CloudWatch, etc.

---

## 💻 Instance Types
Different families optimized for specific workloads:

| Family    | Instance Examples         | Optimization                       | Typical Use Cases                                                 |
|-----------|---------------------------|------------------------------------|-------------------------------------------------------------------|
| **t**     | T3, T3a, T4g              | Burstable general-purpose          | Dev/test, low-cost web servers, small databases                   |
| **m**     | M6i, M6g, M7i, M7g        | General-purpose (balanced CPU/Mem) | Web apps, SaaS backends, moderate databases                       |
| **c**     | C6g, C6i, C7g, C7i        | Compute-optimized (high CPU)       | Batch processing, HPC, high-performance web servers, ML inference |
| **r**     | R6i, R6g, R7i, R7g        | Memory-optimized                   | Databases (PostgreSQL, MySQL), in-memory caches (Redis), SAP HANA |
| **i**     | I4i, I4g                  | Storage-optimized (NVMe SSD)       | High IOPS NoSQL (MongoDB, Cassandra), transactional databases     |
| **g**     | G5, G5g, G6               | GPU (graphics/ML inference)        | 3D rendering, gaming, ML inference, virtual workstations          |
| **p**     | P4d, P5                   | GPU (ML/HPC training)              | ML training, deep learning, computational finance                 |
| **inf**   | Inf1, Inf2                | AWS Inferentia (ML inference)      | Cost-effective ML inference (image/speech, NLP)                   |
| **x**     | X1e, X2gd, X2iedn, X2iezn | High memory (enterprise)           | Large in-memory databases (SAP HANA, Oracle DB), big data         |
| **z**     | z1d                       | High CPU + high memory             | EDA, relational DBs with high per-core licensing costs            |
| **d / h** | D3, D3en, H1              | HDD storage-optimized              | Data warehousing, big data (Hadoop/Spark), high disk throughput   |

---

## 💰 Purchasing Options
- **On-Demand** – Pay per second/minute, no commitment. Best for short-term, unpredictable workloads.
- **Reserved Instances (RI)** – Up to 72% discount for 1–3 year commitment.
- **Savings Plans** – Flexible pricing commitment ($/hour over 1–3 years).
- **Spot Instances** – Up to 90% discount, can be interrupted. Good for batch jobs, stateless apps.
- **Dedicated Hosts / Dedicated Instances** – Physical server dedicated to a single customer (compliance/licensing).
- **Capacity Reservations** – Reserve capacity in a specific AZ.

---

## 🏗️ Placement Groups
Control placement of EC2 instances within AWS infrastructure:

- **Cluster** – Instances close together in one AZ.  
  → High throughput, low latency (HPC, big data).
- **Spread** – Instances spread across racks, each with separate power/network.  
  → High availability, resilience to hardware failures.
- **Partition** – Instances divided into logical groups, each group isolated.  
  → Useful for distributed systems like Hadoop, Cassandra.

---

## 🌐 ENI (Elastic Network Interfaces)
- A **virtual network card** for EC2 instances.
- Can attach multiple ENIs to an instance.
- Each ENI has:
    - Primary private IP address (mandatory).
    - Secondary private IPs.
    - One Elastic IP (optional).
    - Security Groups.
    - MAC address.
- Useful for:
    - High availability network solutions.
    - Management and production networks separation.
    - Network appliances with multiple interfaces.

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which EC2 purchasing option provides the largest discount but can be interrupted at short notice?  
A. On-Demand  
B. Spot  
C. Reserved  
D. Savings Plan  
✅ **Answer: B**

---

**Q2.** You are running a Hadoop cluster. Which Placement Group type should you choose?  
A. Cluster  
B. Spread  
C. Partition  
D. Dedicated Host  
✅ **Answer: C**

---

**Q3.** Which of the following are valid EC2 instance families? (Select TWO)  
A. t4g  
B. d7s  
C. r6i  
D. p4x  
✅ **Answer: A, C**

---

**Q4.** An application requires **low latency and high throughput** between EC2 instances in the same AZ. Which placement group should you use?  
A. Spread  
B. Partition  
C. Cluster  
D. Multi-AZ  
✅ **Answer: C**

---

**Q5.** What is the main difference between Reserved Instances and Savings Plans?  
A. Reserved Instances apply to compute and storage, while Savings Plans apply only to compute.  
B. Reserved Instances apply to a specific instance type in a region, while Savings Plans are more flexible.  
C. Reserved Instances are more expensive than On-Demand.  
D. Savings Plans require dedicated hardware.  
✅ **Answer: B**

---

### 🔹 True / False
**Q6.** You can attach multiple ENIs to a single EC2 instance.  
✅ True

**Q7.** Spot instances are recommended for critical production workloads requiring guaranteed availability.  
❌ False

**Q8.** Spread placement groups allow only up to 7 instances per AZ.  
✅ True

**Q9.** A Dedicated Host gives visibility into physical sockets and cores.  
✅ True

**Q10.** EC2 instance store volumes persist even after stopping the instance.  
❌ False (they are ephemeral).

---

✅ **Exam Tip:** Always pay attention to keywords in questions like **cost optimization, availability, high-performance computing, or compliance**. They often hint at the right purchasing option or placement strategy.


