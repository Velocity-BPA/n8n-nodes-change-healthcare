# n8n-nodes-change-healthcare

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Change Healthcare's suite of healthcare APIs. With 7 resources covering eligibility verification, claims processing, remittance advice, prior authorizations, EDI transactions, and FHIR patient data management, it enables healthcare organizations to automate critical administrative workflows and improve operational efficiency.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Healthcare](https://img.shields.io/badge/Healthcare-API-green)
![EDI](https://img.shields.io/badge/EDI-Transactions-orange)
![FHIR](https://img.shields.io/badge/FHIR-R4-purple)

## Features

- **Eligibility Verification** - Real-time insurance eligibility and benefit verification for patients
- **Claims Management** - Submit, track, and manage healthcare claims processing workflows
- **Remittance Processing** - Automated processing of Electronic Remittance Advice (ERA) documents
- **Prior Authorization** - Streamline prior authorization requests and status tracking
- **EDI Transaction Handling** - Process standard healthcare EDI transactions (270/271, 276/277, 835, 837)
- **FHIR Patient Management** - Create, update, and retrieve patient records using FHIR R4 standards
- **FHIR Clinical Data** - Access and manage clinical observations and diagnostic data
- **Enterprise Security** - Secure API key authentication with healthcare compliance standards

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-change-healthcare`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-change-healthcare
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-change-healthcare.git
cd n8n-nodes-change-healthcare
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-change-healthcare
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Change Healthcare API key from the developer portal | Yes |
| Environment | Select production or sandbox environment | Yes |
| Client ID | Your registered application client identifier | Yes |
| Base URL | Override default API base URL if needed | No |

## Resources & Operations

### 1. Eligibility

| Operation | Description |
|-----------|-------------|
| Check Eligibility | Verify patient insurance eligibility and benefits |
| Get Eligibility Status | Retrieve status of previous eligibility requests |
| Batch Eligibility Check | Process multiple eligibility verifications |

### 2. Claims

| Operation | Description |
|-----------|-------------|
| Submit Claim | Submit new healthcare claims for processing |
| Get Claim Status | Check the status of submitted claims |
| Search Claims | Search claims by various criteria |
| Update Claim | Modify existing claim information |
| Cancel Claim | Cancel a previously submitted claim |

### 3. Remittance

| Operation | Description |
|-----------|-------------|
| Get Remittance | Retrieve Electronic Remittance Advice documents |
| List Remittances | Get list of available remittance documents |
| Parse ERA | Parse and extract data from ERA files |
| Download ERA | Download ERA documents in various formats |

### 4. Prior Authorization

| Operation | Description |
|-----------|-------------|
| Submit Authorization | Submit new prior authorization requests |
| Check Auth Status | Get status of authorization requests |
| Update Authorization | Modify existing authorization requests |
| Cancel Authorization | Cancel pending authorization requests |
| List Authorizations | Retrieve list of authorizations |

### 5. EdiTransactions

| Operation | Description |
|-----------|-------------|
| Send EDI Transaction | Submit EDI transactions (837, 270, 276) |
| Receive EDI Response | Retrieve EDI response transactions (271, 277, 835) |
| Validate EDI | Validate EDI transaction format and content |
| Track Transaction | Monitor EDI transaction processing status |
| Batch EDI Processing | Handle multiple EDI transactions |

### 6. FhirPatients

| Operation | Description |
|-----------|-------------|
| Create Patient | Create new patient record using FHIR R4 |
| Get Patient | Retrieve patient information by ID |
| Update Patient | Modify existing patient record |
| Search Patients | Search patients by demographics |
| Delete Patient | Remove patient record |
| Get Patient History | Retrieve patient record version history |

### 7. FhirObservations

| Operation | Description |
|-----------|-------------|
| Create Observation | Add new clinical observation |
| Get Observation | Retrieve observation by ID |
| Update Observation | Modify existing observation |
| Search Observations | Search observations by patient, date, code |
| Delete Observation | Remove clinical observation |
| Batch Observations | Process multiple observations |

## Usage Examples

```javascript
// Check patient eligibility
{
  "subscriberId": "123456789",
  "memberDateOfBirth": "1990-01-15",
  "providerNPI": "1234567890",
  "serviceDate": "2024-01-15"
}
```

```javascript
// Submit professional claim
{
  "claimType": "professional",
  "patientId": "PAT001",
  "providerId": "PRV001",
  "serviceLines": [
    {
      "procedureCode": "99213",
      "chargeAmount": 150.00,
      "serviceDate": "2024-01-15"
    }
  ]
}
```

```javascript
// Create FHIR patient
{
  "resourceType": "Patient",
  "name": [
    {
      "family": "Smith",
      "given": ["John", "Robert"]
    }
  ],
  "gender": "male",
  "birthDate": "1990-01-15",
  "identifier": [
    {
      "system": "http://hospital.org/patients",
      "value": "PAT001"
    }
  ]
}
```

```javascript
// Submit prior authorization
{
  "patientId": "PAT001",
  "providerId": "PRV001",
  "serviceCode": "99285",
  "requestedDate": "2024-02-01",
  "clinicalInfo": "Emergency department visit for chest pain"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API credentials | Verify API key and client ID in credentials |
| 429 Rate Limited | Too many requests in time window | Implement delay between requests or use batch operations |
| 400 Bad Request | Invalid request format or missing required fields | Validate input data against API documentation |
| 404 Not Found | Requested resource does not exist | Check resource IDs and ensure they exist in the system |
| 500 Internal Server Error | Change Healthcare service error | Retry request after delay or contact support |
| Network Timeout | Request timed out | Increase timeout settings or check network connectivity |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-change-healthcare/issues)
- **Change Healthcare API Docs**: [Change Healthcare Developer Portal](https://developers.changehealthcare.com)
- **FHIR R4 Specification**: [HL7 FHIR R4](https://hl7.org/fhir/R4/)