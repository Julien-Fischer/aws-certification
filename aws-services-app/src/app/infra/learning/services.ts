import {AwsService} from "../../domain/learning/models/aws-service.model";

export const AWS_SERVICES: AwsService[] = [
    // Compute Services
    {
        id: 'ec2',
        name: 'Amazon EC2',
        description: 'Scalable virtual servers in the cloud',
        icon: 'fas fa-server',
        category: 'Compute'
    },
    {
        id: 'lambda',
        name: 'AWS Lambda',
        description: 'Run code without thinking about servers',
        icon: 'fas fa-bolt',
        category: 'Compute'
    },
    {
        id: 'container',
        name: 'Amazon Container',
        description: 'ECS,Fargate, ECR & EKS',
        icon: 'fas fa-cube',
        category: 'Compute'
    },

    // Storage Services
    {
        id: 's3',
        name: 'Amazon S3',
        description: 'Object storage built to store and retrieve any amount of data',
        icon: 'fas fa-hdd',
        category: 'Storage'
    },
    {
        id: 'ebs',
        name: 'Amazon EBS',
        description: 'High performance block storage',
        icon: 'fas fa-database',
        category: 'Storage'
    },

    // Database Services
    {
        id: 'aurora',
        name: 'Amazon Aurora',
        description: 'High-performance managed relational database',
        icon: 'fas fa-table',
        category: 'Databases'
    },
    {
        id: 'rds',
        name: 'Amazon RDS',
        description: 'Managed relational database service',
        icon: 'fas fa-database',
        category: 'Databases'
    },
    {
        id: 'dynamodb',
        name: 'Amazon DynamoDB',
        description: 'Fast and flexible NoSQL database',
        icon: 'fas fa-th',
        category: 'Databases'
    },

    // Networking Services
    {
        id: 'route53',
        name: 'Amazon Route 53',
        description: 'Scalable domain name system (DNS)',
        icon: 'fas fa-route',
        category: 'Networking'
    },
    {
        id: 'cloudfront',
        name: 'Amazon CloudFront',
        description: 'Global content delivery network',
        icon: 'fas fa-globe',
        category: 'Networking'
    },
    {
        id: 'load_balancing',
        name: 'Amazon  Load Balancing',
        description: 'Amazon  Load Balancing types',
        icon: 'fas fa-diagram-project',
        category: 'Networking'
    },
    {
        id: 'vpc',
        name: 'Amazon Routing',
        description: 'VPC, Bastion, DX, NAT Gateway...',
        icon: 'fas fa-network-wired',
        category: 'Networking'
    },
    // AI/Big DATA Services
    {
        id: 'machine_learning',
        name: 'Machine Learning',
        description: 'AWS Machine Learning Services',
        icon: 'fas fa-brain',
        category: 'Data, AI & Analytics'
    },
    {
        id: 'athena',
        name: 'Amazon Athena',
        description: 'Serverless interactive query service for S3',
        icon: 'fas fa-database',
        category: 'Data, AI & Analytics'
    },
    // Messaging Services
    {
        id: 'messaging',
        name: 'Messaging Services',
        description: 'Asynchronous AWS services (SQS, SNS, MQ)',
        icon: 'fas fa-shuffle',
        category: 'Messaging'
    },
    {
        id: 'kinesis',
        name: 'Amazon Kinesis',
        description: 'Amazon Kinesis description',
        icon: 'fas fa-arrows-turn-right',
        category: 'Messaging'
    },
    {
        id: 'kinesis_data_firehose',
        name: 'Kinesis Data Firehose',
        description: 'Amazon Kinesis Data Firehose',
        icon: 'fas fa-arrows-turn-right',
        category: 'Messaging'
    },
    // Security Services
    {
        id: 'iam',
        name: 'AWS IAM',
        description: 'Identity and access management',
        icon: 'fas fa-shield-alt',
        category: 'Security'
    },
    {
        id: 'cognito',
        name: 'Amazon Cognito',
        description: 'Identity management for your apps',
        icon: 'fas fa-user-shield',
        category: 'Security'
    },
    {
        id: 'audit_monitoring',
        name: 'Audit & Monitoring',
        description: 'AWS Audit & Monitoring',
        icon: 'fas fa-cloud-meatball',
        category: 'Security'
    },
    {
        id: 'encryption_security',
        name: 'Encryption & Security',
        description: 'Encryption & Security',
        icon: 'fas fa-key',
        category: 'Security'
    }
];