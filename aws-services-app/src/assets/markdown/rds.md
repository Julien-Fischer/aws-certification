# 🗄️ Amazon RDS – Flash Card

---

## 📝 Introduction
Amazon RDS is a **managed relational database service** that simplifies database setup, operation, and scaling in the cloud.  
It supports multiple engines: **MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora**.

---

## ✅ Advantages (Keypoints)
1. **Managed Service**: AWS handles backups, patching, monitoring, scaling.  
2. **High Availability**: Built-in support for Multi-AZ deployments.  
3. **Security**: Integrated with KMS encryption, IAM authentication, VPC.  
4. **Performance & Scaling**: Read replicas for horizontal read scaling.  
5. **Cost-effective**: Pay for usage, storage, and throughput.  

---

## 🔄 Read Replicas vs Multi-AZ

### 📖 Read Replicas
- **Asynchronous replication**.  
- Used to **scale read traffic** (reporting, analytics, read-heavy apps).  
- Can promote replica to standalone DB in case of failure.  
- Up to 15 replicas (depending on engine).  

### 🏢 Multi-AZ
- **Synchronous replication**.  
- Used for **high availability and failover**.  
- Standby instance in another AZ (not used for reads).  
- Failover automatic in case of primary failure.  

👉 **Exam Tip**:  
- **Read Replicas = Performance scaling**.  
- **Multi-AZ = Availability / durability**.  

---

## ⚙️ RDS Custom (Oracle & MSSQL)

### ✅ 3 Keypoints
1. **Customizable managed databases**: deeper access to the OS and database environment (patching, custom configurations).  
2. **Supports Oracle & SQL Server only** (not open-source engines).  
3. **Still managed by AWS** (automated backups, monitoring) but gives more **flexibility** compared to standard RDS.  

---

## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which RDS feature is best for **disaster recovery and automatic failover**?  
A. Read Replicas  
B. Multi-AZ  
C. RDS Proxy  
D. RDS Custom  
✅ **Answer: B**

---

**Q2.** Which option allows scaling **read traffic** in RDS?  
A. Multi-AZ  
B. Read Replicas  
C. Cross-Region Copy  
D. RDS Custom  
✅ **Answer: B**

---

**Q3.** Which engines are supported by **RDS Custom**?  
A. MySQL & PostgreSQL  
B. Oracle & SQL Server  
C. MariaDB & Aurora  
D. All RDS engines  
✅ **Answer: B**

---

### 🔹 True / False
**Q4.** Read replicas use synchronous replication.  
❌ False (they use **asynchronous**).  

**Q5.** Multi-AZ improves read performance.  
❌ False (standby is not used for reads).  

**Q6.** RDS is integrated with IAM for authentication.  
✅ True  

---

✅ **Exam Tip**: Expect scenario-based questions like:  
- “You need to improve **read performance** for an RDS database → **Read Replicas**.”  
- “You need automatic failover for high availability → **Multi-AZ**.”  
