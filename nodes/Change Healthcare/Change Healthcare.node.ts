/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-changehealthcare/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ChangeHealthcare implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Change Healthcare',
    name: 'changehealthcare',
    icon: 'file:changehealthcare.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Change Healthcare API',
    defaults: {
      name: 'Change Healthcare',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'changehealthcareApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Eligibility',
            value: 'eligibility',
          },
          {
            name: 'Claims',
            value: 'claims',
          },
          {
            name: 'Remittance',
            value: 'remittance',
          },
          {
            name: 'Prior Authorization',
            value: 'priorAuthorization',
          },
          {
            name: 'EdiTransactions',
            value: 'ediTransactions',
          },
          {
            name: 'FhirPatients',
            value: 'fhirPatients',
          },
          {
            name: 'FhirObservations',
            value: 'fhirObservations',
          }
        ],
        default: 'eligibility',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['eligibility'] } },
  options: [
    {
      name: 'Check Eligibility',
      value: 'checkEligibility',
      description: 'Check patient insurance eligibility and benefits',
      action: 'Check eligibility'
    },
    {
      name: 'Get Eligibility Status',
      value: 'getEligibilityStatus',
      description: 'Get status of eligibility request',
      action: 'Get eligibility status'
    },
    {
      name: 'List Eligibility Transactions',
      value: 'listEligibilityTransactions',
      description: 'List eligibility transactions',
      action: 'List eligibility transactions'
    }
  ],
  default: 'checkEligibility',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['claims'] } },
  options: [
    { name: 'Submit Professional Claim', value: 'submitClaim', description: 'Submit professional healthcare claim', action: 'Submit professional claim' },
    { name: 'Submit Institutional Claim', value: 'submitInstitutionalClaim', description: 'Submit institutional healthcare claim', action: 'Submit institutional claim' },
    { name: 'Get Claim Status', value: 'getClaimStatus', description: 'Check status of submitted claims', action: 'Get claim status' },
    { name: 'Get Claim', value: 'getClaim', description: 'Get specific claim details', action: 'Get claim details' },
    { name: 'Update Claim', value: 'updateClaim', description: 'Update existing claim', action: 'Update claim' },
  ],
  default: 'submitClaim',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['remittance'] } },
  options: [
    { name: 'Get Remittance Advice', value: 'getRemittanceAdvice', description: 'Retrieve electronic remittance advice', action: 'Get remittance advice' },
    { name: 'Get Remittance Details', value: 'getRemittanceDetails', description: 'Get specific ERA details', action: 'Get remittance details' },
    { name: 'Search Remittance', value: 'searchRemittance', description: 'Search remittance records', action: 'Search remittance' }
  ],
  default: 'getRemittanceAdvice',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
    },
  },
  options: [
    {
      name: 'Submit Prior Authorization Request',
      value: 'submitPriorAuth',
      description: 'Submit a new prior authorization request',
      action: 'Submit prior authorization request',
    },
    {
      name: 'Get Prior Authorization Status',
      value: 'getPriorAuthStatus',
      description: 'Get the status of a prior authorization request',
      action: 'Get prior authorization status',
    },
    {
      name: 'List Prior Authorizations',
      value: 'listPriorAuthorizations',
      description: 'List prior authorization requests with filters',
      action: 'List prior authorizations',
    },
    {
      name: 'Update Prior Authorization',
      value: 'updatePriorAuth',
      description: 'Update an existing prior authorization request',
      action: 'Update prior authorization',
    },
  ],
  default: 'submitPriorAuth',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['ediTransactions'] } },
  options: [
    { name: 'Submit EDI File', value: 'submitEdiFile', description: 'Submit X12 EDI transaction file', action: 'Submit EDI file' },
    { name: 'Get EDI File', value: 'getEdiFile', description: 'Retrieve EDI file details', action: 'Get EDI file' },
    { name: 'List EDI Files', value: 'listEdiFiles', description: 'List EDI transaction files', action: 'List EDI files' },
    { name: 'Get EDI File Status', value: 'getEdiFileStatus', description: 'Get EDI file processing status', action: 'Get EDI file status' },
    { name: 'Delete EDI File', value: 'deleteEdiFile', description: 'Delete EDI file', action: 'Delete EDI file' }
  ],
  default: 'submitEdiFile',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
		},
	},
	options: [
		{
			name: 'Create Patient',
			value: 'createPatient',
			description: 'Create new patient record',
			action: 'Create patient',
		},
		{
			name: 'Get Patient',
			value: 'getPatient',
			description: 'Get patient by ID',
			action: 'Get patient',
		},
		{
			name: 'Search Patients',
			value: 'searchPatients',
			description: 'Search patients with criteria',
			action: 'Search patients',
		},
		{
			name: 'Update Patient',
			value: 'updatePatient',
			description: 'Update patient record',
			action: 'Update patient',
		},
		{
			name: 'Delete Patient',
			value: 'deletePatient',
			description: 'Delete patient record',
			action: 'Delete patient',
		},
	],
	default: 'createPatient',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
		},
	},
	options: [
		{
			name: 'Create Observation',
			value: 'createObservation',
			description: 'Create new observation',
			action: 'Create observation',
		},
		{
			name: 'Get Observation',
			value: 'getObservation',
			description: 'Get observation by ID',
			action: 'Get observation',
		},
		{
			name: 'Search Observations',
			value: 'searchObservations',
			description: 'Search observations',
			action: 'Search observations',
		},
		{
			name: 'Update Observation',
			value: 'updateObservation',
			description: 'Update observation',
			action: 'Update observation',
		},
		{
			name: 'Delete Observation',
			value: 'deleteObservation',
			description: 'Delete observation',
			action: 'Delete observation',
		},
	],
	default: 'createObservation',
},
{
  displayName: 'Patient First Name',
  name: 'patientFirstName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Patient\'s first name'
},
{
  displayName: 'Patient Last Name',
  name: 'patientLastName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Patient\'s last name'
},
{
  displayName: 'Patient Date of Birth',
  name: 'patientDateOfBirth',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Patient\'s date of birth (YYYY-MM-DD format)'
},
{
  displayName: 'Patient Member ID',
  name: 'patientMemberId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Patient\'s insurance member ID'
},
{
  displayName: 'Insurance Payer ID',
  name: 'insurancePayerId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Insurance payer identifier'
},
{
  displayName: 'Provider NPI',
  name: 'providerNpi',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '',
  description: 'Provider\'s National Provider Identifier (NPI)'
},
{
  displayName: 'Service Type Codes',
  name: 'serviceTypeCodes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['checkEligibility']
    }
  },
  default: '30',
  description: 'Service type codes (comma-separated). Default is 30 for health benefit plan coverage'
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['getEligibilityStatus']
    }
  },
  default: '',
  description: 'The transaction ID to check status for'
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['listEligibilityTransactions']
    }
  },
  default: '',
  description: 'Start date for transaction search (YYYY-MM-DD format)'
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['listEligibilityTransactions']
    }
  },
  default: '',
  description: 'End date for transaction search (YYYY-MM-DD format)'
},
{
  displayName: 'Status Filter',
  name: 'statusFilter',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['eligibility'],
      operation: ['listEligibilityTransactions']
    }
  },
  options: [
    { name: 'All', value: '' },
    { name: 'Completed', value: 'completed' },
    { name: 'Pending', value: 'pending' },
    { name: 'Failed', value: 'failed' }
  ],
  default: '',
  description: 'Filter transactions by status'
},
{
  displayName: 'Claim Data',
  name: 'claimData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitClaim'] } },
  default: '{}',
  description: 'Professional claim data in X12 EDI format or JSON structure',
},
{
  displayName: 'Provider Info',
  name: 'providerInfo',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitClaim'] } },
  default: '{}',
  description: 'Healthcare provider information including NPI and credentials',
},
{
  displayName: 'Patient Info',
  name: 'patientInfo',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitClaim'] } },
  default: '{}',
  description: 'Patient demographic and insurance information',
},
{
  displayName: 'Claim Data',
  name: 'claimData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitInstitutionalClaim'] } },
  default: '{}',
  description: 'Institutional claim data in X12 EDI format or JSON structure',
},
{
  displayName: 'Facility Info',
  name: 'facilityInfo',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitInstitutionalClaim'] } },
  default: '{}',
  description: 'Healthcare facility information including NPI and credentials',
},
{
  displayName: 'Patient Info',
  name: 'patientInfo',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['submitInstitutionalClaim'] } },
  default: '{}',
  description: 'Patient demographic and insurance information',
},
{
  displayName: 'Claim ID',
  name: 'claimId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['getClaimStatus'] } },
  default: '',
  description: 'Unique identifier for the submitted claim',
},
{
  displayName: 'Provider Info',
  name: 'providerInfo',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['getClaimStatus'] } },
  default: '{}',
  description: 'Healthcare provider information for claim inquiry',
},
{
  displayName: 'Claim ID',
  name: 'claimId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['getClaim'] } },
  default: '',
  description: 'Unique identifier for the claim to retrieve',
},
{
  displayName: 'Claim ID',
  name: 'claimId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['updateClaim'] } },
  default: '',
  description: 'Unique identifier for the claim to update',
},
{
  displayName: 'Claim Data',
  name: 'claimData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claims'], operation: ['updateClaim'] } },
  default: '{}',
  description: 'Updated claim data in X12 EDI format or JSON structure',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['remittance'],
      operation: ['getRemittanceAdvice']
    }
  },
  default: '',
  placeholder: '2023-01-01/2023-01-31',
  description: 'Date range for remittance advice retrieval (format: YYYY-MM-DD/YYYY-MM-DD)'
},
{
  displayName: 'Payer ID',
  name: 'payerId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['remittance'],
      operation: ['getRemittanceAdvice']
    }
  },
  default: '',
  description: 'Specific payer identifier to filter remittance advice'
},
{
  displayName: 'ERA ID',
  name: 'eraId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['remittance'],
      operation: ['getRemittanceDetails']
    }
  },
  default: '',
  description: 'Electronic Remittance Advice ID for specific ERA details'
},
{
  displayName: 'Search Criteria',
  name: 'searchCriteria',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['remittance'],
      operation: ['searchRemittance']
    }
  },
  default: '',
  description: 'Search criteria for remittance records'
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['remittance'],
      operation: ['searchRemittance']
    }
  },
  default: '',
  placeholder: '2023-01-01/2023-01-31',
  description: 'Date range for remittance search (format: YYYY-MM-DD/YYYY-MM-DD)'
},
{
  displayName: 'Authorization Request Data',
  name: 'authRequest',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['submitPriorAuth'],
    },
  },
  default: '{}',
  description: 'Prior authorization request data in X12 EDI format',
},
{
  displayName: 'Patient Information',
  name: 'patientInfo',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['submitPriorAuth'],
    },
  },
  default: '{}',
  description: 'Patient demographic and insurance information',
},
{
  displayName: 'Provider Information',
  name: 'providerInfo',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['submitPriorAuth'],
    },
  },
  default: '{}',
  description: 'Healthcare provider information and credentials',
},
{
  displayName: 'Authorization ID',
  name: 'authId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['getPriorAuthStatus', 'updatePriorAuth'],
    },
  },
  default: '',
  description: 'The ID of the prior authorization request',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: false,
  },
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['listPriorAuthorizations'],
    },
  },
  default: {},
  options: [
    {
      name: 'range',
      displayName: 'Date Range',
      values: [
        {
          displayName: 'Start Date',
          name: 'startDate',
          type: 'dateTime',
          default: '',
          description: 'Start date for filtering prior authorizations',
        },
        {
          displayName: 'End Date',
          name: 'endDate',
          type: 'dateTime',
          default: '',
          description: 'End date for filtering prior authorizations',
        },
      ],
    },
  ],
  description: 'Date range for filtering prior authorization requests',
},
{
  displayName: 'Status Filter',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['listPriorAuthorizations'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Approved',
      value: 'approved',
    },
    {
      name: 'Denied',
      value: 'denied',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
  ],
  default: '',
  description: 'Filter by authorization status',
},
{
  displayName: 'Authorization Data',
  name: 'authData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['priorAuthorization'],
      operation: ['updatePriorAuth'],
    },
  },
  default: '{}',
  description: 'Updated authorization data',
},
{
  displayName: 'File Data',
  name: 'fileData',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['ediTransactions'], operation: ['submitEdiFile'] } },
  default: '',
  description: 'X12 EDI file content to submit',
  typeOptions: {
    alwaysOpenEditWindow: true,
    rows: 10,
  },
},
{
  displayName: 'Transaction Type',
  name: 'transactionType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['ediTransactions'], operation: ['submitEdiFile'] } },
  options: [
    { name: '837P - Professional Claims', value: '837P' },
    { name: '837I - Institutional Claims', value: '837I' },
    { name: '837D - Dental Claims', value: '837D' },
    { name: '835 - Payment/Remittance Advice', value: '835' },
    { name: '270 - Eligibility Inquiry', value: '270' },
    { name: '271 - Eligibility Response', value: '271' },
    { name: '276 - Claim Status Inquiry', value: '276' },
    { name: '277 - Claim Status Response', value: '277' },
    { name: '999 - Functional Acknowledgment', value: '999' }
  ],
  default: '837P',
  description: 'Type of X12 EDI transaction',
},
{
  displayName: 'File ID',
  name: 'fileId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['ediTransactions'], operation: ['getEdiFile', 'getEdiFileStatus', 'deleteEdiFile'] } },
  default: '',
  description: 'Unique identifier of the EDI file',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: false,
  },
  displayOptions: { show: { resource: ['ediTransactions'], operation: ['listEdiFiles'] } },
  default: {},
  description: 'Date range for filtering files',
  options: [
    {
      name: 'range',
      displayName: 'Range',
      values: [
        {
          displayName: 'Start Date',
          name: 'startDate',
          type: 'dateTime',
          default: '',
          description: 'Start date for file search (ISO 8601 format)',
        },
        {
          displayName: 'End Date',
          name: 'endDate',
          type: 'dateTime',
          default: '',
          description: 'End date for file search (ISO 8601 format)',
        },
      ],
    },
  ],
},
{
  displayName: 'Transaction Type Filter',
  name: 'transactionTypeFilter',
  type: 'options',
  displayOptions: { show: { resource: ['ediTransactions'], operation: ['listEdiFiles'] } },
  options: [
    { name: 'All', value: '' },
    { name: '837P - Professional Claims', value: '837P' },
    { name: '837I - Institutional Claims', value: '837I' },
    { name: '837D - Dental Claims', value: '837D' },
    { name: '835 - Payment/Remittance Advice', value: '835' },
    { name: '270 - Eligibility Inquiry', value: '270' },
    { name: '271 - Eligibility Response', value: '271' },
    { name: '276 - Claim Status Inquiry', value: '276' },
    { name: '277 - Claim Status Response', value: '277' },
    { name: '999 - Functional Acknowledgment', value: '999' }
  ],
  default: '',
  description: 'Filter files by transaction type',
},
{
	displayName: 'Patient Resource',
	name: 'patient_resource',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['createPatient'],
		},
	},
	default: '{\n  "resourceType": "Patient",\n  "name": [{\n    "family": "Doe",\n    "given": ["John"]\n  }],\n  "gender": "male",\n  "birthDate": "1990-01-01"\n}',
	description: 'FHIR Patient resource in JSON format',
},
{
	displayName: 'Patient ID',
	name: 'patientId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['getPatient'],
		},
	},
	default: '',
	description: 'The ID of the patient to retrieve',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['searchPatients'],
		},
	},
	default: '',
	description: 'Patient name to search for',
},
{
	displayName: 'Identifier',
	name: 'identifier',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['searchPatients'],
		},
	},
	default: '',
	description: 'Patient identifier to search for',
},
{
	displayName: 'Birth Date',
	name: 'birthdate',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['searchPatients'],
		},
	},
	default: '',
	description: 'Patient birth date to search for (YYYY-MM-DD)',
},
{
	displayName: 'Patient ID',
	name: 'patientId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['updatePatient'],
		},
	},
	default: '',
	description: 'The ID of the patient to update',
},
{
	displayName: 'Patient Resource',
	name: 'patient_resource',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['updatePatient'],
		},
	},
	default: '{\n  "resourceType": "Patient",\n  "id": "patient-id",\n  "name": [{\n    "family": "Doe",\n    "given": ["John"]\n  }],\n  "gender": "male",\n  "birthDate": "1990-01-01"\n}',
	description: 'Updated FHIR Patient resource in JSON format',
},
{
	displayName: 'Patient ID',
	name: 'patientId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirPatients'],
			operation: ['deletePatient'],
		},
	},
	default: '',
	description: 'The ID of the patient to delete',
},
{
	displayName: 'Observation Resource',
	name: 'observation_resource',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['createObservation'],
		},
	},
	default: '{}',
	description: 'FHIR Observation resource data',
},
{
	displayName: 'Observation ID',
	name: 'observationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['getObservation'],
		},
	},
	default: '',
	description: 'Unique identifier for the observation',
},
{
	displayName: 'Patient',
	name: 'patient',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['searchObservations'],
		},
	},
	default: '',
	description: 'Patient reference for filtering observations',
},
{
	displayName: 'Code',
	name: 'code',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['searchObservations'],
		},
	},
	default: '',
	description: 'Observation code for filtering',
},
{
	displayName: 'Date',
	name: 'date',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['searchObservations'],
		},
	},
	default: '',
	description: 'Date range for filtering observations',
},
{
	displayName: 'Observation ID',
	name: 'observationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['updateObservation'],
		},
	},
	default: '',
	description: 'Unique identifier for the observation to update',
},
{
	displayName: 'Observation Resource',
	name: 'observation_resource',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['updateObservation'],
		},
	},
	default: '{}',
	description: 'Updated FHIR Observation resource data',
},
{
	displayName: 'Observation ID',
	name: 'observationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fhirObservations'],
			operation: ['deleteObservation'],
		},
	},
	default: '',
	description: 'Unique identifier for the observation to delete',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'eligibility':
        return [await executeEligibilityOperations.call(this, items)];
      case 'claims':
        return [await executeClaimsOperations.call(this, items)];
      case 'remittance':
        return [await executeRemittanceOperations.call(this, items)];
      case 'priorAuthorization':
        return [await executePriorAuthorizationOperations.call(this, items)];
      case 'ediTransactions':
        return [await executeEdiTransactionsOperations.call(this, items)];
      case 'fhirPatients':
        return [await executeFhirPatientsOperations.call(this, items)];
      case 'fhirObservations':
        return [await executeFhirObservationsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEligibilityOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('changehealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'checkEligibility': {
          const patientFirstName = this.getNodeParameter('patientFirstName', i) as string;
          const patientLastName = this.getNodeParameter('patientLastName', i) as string;
          const patientDateOfBirth = this.getNodeParameter('patientDateOfBirth', i) as string;
          const patientMemberId = this.getNodeParameter('patientMemberId', i) as string;
          const insurancePayerId = this.getNodeParameter('insurancePayerId', i) as string;
          const providerNpi = this.getNodeParameter('providerNpi', i) as string;
          const serviceTypeCodes = this.getNodeParameter('serviceTypeCodes', i) as string;

          const requestBody = {
            controlNumber: Date.now().toString(),
            tradingPartnerServiceId: insurancePayerId,
            provider: {
              npi: providerNpi,
              firstName: 'Provider',
              lastName: 'Name'
            },
            subscriber: {
              memberId: patientMemberId,
              firstName: patientFirstName,
              lastName: patientLastName,
              dateOfBirth: patientDateOfBirth
            },
            serviceTypes: serviceTypeCodes.split(',').map(code => code.trim())
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/medicalnetwork/eligibility/v3`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: requestBody,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEligibilityStatus': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/eligibility/v3/${transactionId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listEligibilityTransactions': {
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          const statusFilter = this.getNodeParameter('statusFilter', i) as string;

          const queryParams: any = {};
          if (startDate) queryParams.startDate = startDate;
          if (endDate) queryParams.endDate = endDate;
          if (statusFilter) queryParams.status = statusFilter;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/eligibility/v3/transactions${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeClaimsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('changehealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'submitClaim': {
          const claimData = this.getNodeParameter('claimData', i) as object;
          const providerInfo = this.getNodeParameter('providerInfo', i) as object;
          const patientInfo = this.getNodeParameter('patientInfo', i) as object;

          const requestBody = {
            claim: claimData,
            provider: providerInfo,
            patient: patientInfo,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/medicalnetwork/professionalclaims/v3`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'submitInstitutionalClaim': {
          const claimData = this.getNodeParameter('claimData', i) as object;
          const facilityInfo = this.getNodeParameter('facilityInfo', i) as object;
          const patientInfo = this.getNodeParameter('patientInfo', i) as object;

          const requestBody = {
            claim: claimData,
            facility: facilityInfo,
            patient: patientInfo,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/medicalnetwork/institutionalclaims/v3`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getClaimStatus': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const providerInfo = this.getNodeParameter('providerInfo', i) as object;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/claimstatus/v3`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            qs: {
              claimId: claimId,
              provider: JSON.stringify(providerInfo),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/claims/v3/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const claimData = this.getNodeParameter('claimData', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/medicalnetwork/claims/v3/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: claimData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRemittanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('changehealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getRemittanceAdvice': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;
          
          const queryParams: any = {
            date_range: dateRange
          };
          
          if (payerId) {
            queryParams.payer_id = payerId;
          }
          
          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/remittance/v3?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getRemittanceDetails': {
          const eraId = this.getNodeParameter('eraId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/remittance/v3/${eraId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'searchRemittance': {
          const searchCriteria = this.getNodeParameter('searchCriteria', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          
          const queryParams: any = {
            search_criteria: searchCriteria
          };
          
          if (dateRange) {
            queryParams.date_range = dateRange;
          }
          
          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/remittance/v3/search?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePriorAuthorizationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('changehealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'submitPriorAuth': {
          const authRequest = this.getNodeParameter('authRequest', i) as any;
          const patientInfo = this.getNodeParameter('patientInfo', i) as any;
          const providerInfo = this.getNodeParameter('providerInfo', i) as any;

          const requestBody = {
            auth_request: authRequest,
            patient_info: patientInfo,
            provider_info: providerInfo,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/medicalnetwork/priorauthorization/v3`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPriorAuthStatus': {
          const authId = this.getNodeParameter('authId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/priorauthorization/v3/${authId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listPriorAuthorizations': {
          const dateRange = this.getNodeParameter('dateRange', i) as any;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: any = {};
          
          if (dateRange && dateRange.range) {
            if (dateRange.range.startDate) {
              queryParams.start_date = dateRange.range.startDate;
            }
            if (dateRange.range.endDate) {
              queryParams.end_date = dateRange.range.endDate;
            }
          }

          if (status) {
            queryParams.status = status;
          }

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/medicalnetwork/priorauthorization/v3${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePriorAuth': {
          const authId = this.getNodeParameter('authId', i) as string;
          const authData = this.getNodeParameter('authData', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/medicalnetwork/priorauthorization/v3/${authId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: { auth_data: authData },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i },
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEdiTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('changehealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'submitEdiFile': {
          const fileData = this.getNodeParameter('fileData', i) as string;
          const transactionType = this.getNodeParameter('transactionType', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/apip/edi/v2/files`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              file_data: fileData,
              transaction_type: transactionType,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEdiFile': {
          const fileId = this.getNodeParameter('fileId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/apip/edi/v2/files/${fileId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listEdiFiles': {
          const transactionTypeFilter = this.getNodeParameter('transactionTypeFilter', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as any;

          let queryParams: string[] = [];
          
          if (transactionTypeFilter) {
            queryParams.push(`transaction_type=${encodeURIComponent(transactionTypeFilter)}`);
          }
          
          if (dateRange?.range?.startDate) {
            queryParams.push(`start_date=${encodeURIComponent(dateRange.range.startDate)}`);
          }
          
          if (dateRange?.range?.endDate) {
            queryParams.push(`end_date=${encodeURIComponent(dateRange.range.endDate)}`);
          }

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/apip/edi/v2/files${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEdiFileStatus': {
          const fileId = this.getNodeParameter('fileId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/apip/edi/v2/files/${fileId}/status`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteEdiFile': {
          const fileId = this.getNodeParameter('fileId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/apip/edi/v2/files/${fileId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFhirPatientsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('changehealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createPatient': {
					const patientResource = this.getNodeParameter('patient_resource', i) as object;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/fhir/r4/Patient`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/fhir+json',
							'Accept': 'application/fhir+json',
						},
						body: patientResource,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPatient': {
					const patientId = this.getNodeParameter('patientId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/fhir/r4/Patient/${patientId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'searchPatients': {
					const name = this.getNodeParameter('name', i) as string;
					const identifier = this.getNodeParameter('identifier', i) as string;
					const birthdate = this.getNodeParameter('birthdate', i) as string;

					const queryParams: string[] = [];
					if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
					if (identifier) queryParams.push(`identifier=${encodeURIComponent(identifier)}`);
					if (birthdate) queryParams.push(`birthdate=${encodeURIComponent(birthdate)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/fhir/r4/Patient${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updatePatient': {
					const patientId = this.getNodeParameter('patientId', i) as string;
					const patientResource = this.getNodeParameter('patient_resource', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/fhir/r4/Patient/${patientId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/fhir+json',
							'Accept': 'application/fhir+json',
						},
						body: patientResource,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deletePatient': {
					const patientId = this.getNodeParameter('patientId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/fhir/r4/Patient/${patientId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFhirObservationsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('changehealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createObservation': {
					const observationResource = this.getNodeParameter('observation_resource', i) as object;
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/fhir/r4/Observation`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/fhir+json',
						},
						json: true,
						body: observationResource,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'getObservation': {
					const observationId = this.getNodeParameter('observationId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/fhir/r4/Observation/${observationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'searchObservations': {
					const patient = this.getNodeParameter('patient', i) as string;
					const code = this.getNodeParameter('code', i) as string;
					const date = this.getNodeParameter('date', i) as string;
					
					const queryParams: string[] = [];
					if (patient) queryParams.push(`patient=${encodeURIComponent(patient)}`);
					if (code) queryParams.push(`code=${encodeURIComponent(code)}`);
					if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
					
					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/fhir/r4/Observation${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'updateObservation': {
					const observationId = this.getNodeParameter('observationId', i) as string;
					const observationResource = this.getNodeParameter('observation_resource', i) as object;
					
					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/fhir/r4/Observation/${observationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/fhir+json',
						},
						json: true,
						body: observationResource,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'deleteObservation': {
					const observationId = this.getNodeParameter('observationId', i) as string;
					
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/fhir/r4/Observation/${observationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
