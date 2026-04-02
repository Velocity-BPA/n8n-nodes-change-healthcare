/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ChangeHealthcare } from '../nodes/Change Healthcare/Change Healthcare.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ChangeHealthcare Node', () => {
  let node: ChangeHealthcare;

  beforeAll(() => {
    node = new ChangeHealthcare();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Change Healthcare');
      expect(node.description.name).toBe('changehealthcare');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Eligibility Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-access-token',
        baseUrl: 'https://api.changehealthcare.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('checkEligibility operation', () => {
    it('should successfully check patient eligibility', async () => {
      const mockResponse = {
        controlNumber: '123456789',
        tradingPartnerServiceId: 'AETNA',
        eligibilityStatus: 'Active Coverage',
        benefits: []
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'checkEligibility',
          patientFirstName: 'John',
          patientLastName: 'Doe',
          patientDateOfBirth: '1990-01-01',
          patientMemberId: 'MEM123456',
          insurancePayerId: 'AETNA',
          providerNpi: '1234567890',
          serviceTypeCodes: '30'
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEligibilityOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.changehealthcare.com/medicalnetwork/eligibility/v3',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Content-Type': 'application/json'
        },
        body: expect.objectContaining({
          tradingPartnerServiceId: 'AETNA',
          subscriber: expect.objectContaining({
            memberId: 'MEM123456',
            firstName: 'John',
            lastName: 'Doe'
          })
        }),
        json: true
      });
    });

    it('should handle errors when checking eligibility fails', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'checkEligibility',
          patientFirstName: 'John',
          patientLastName: 'Doe',
          patientDateOfBirth: '1990-01-01',
          patientMemberId: 'MEM123456',
          insurancePayerId: 'INVALID',
          providerNpi: '1234567890',
          serviceTypeCodes: '30'
        };
        return params[param];
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid payer ID'));

      const result = await executeEligibilityOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid payer ID');
    });
  });

  describe('getEligibilityStatus operation', () => {
    it('should successfully get eligibility status', async () => {
      const mockResponse = {
        transactionId: 'TXN123',
        status: 'completed',
        eligibilityResponse: {}
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getEligibilityStatus',
          transactionId: 'TXN123'
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEligibilityOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.changehealthcare.com/medicalnetwork/eligibility/v3/TXN123',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('listEligibilityTransactions operation', () => {
    it('should successfully list eligibility transactions', async () => {
      const mockResponse = {
        transactions: [
          { id: 'TXN123', status: 'completed', createdDate: '2023-01-01' },
          { id: 'TXN124', status: 'pending', createdDate: '2023-01-02' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'listEligibilityTransactions',
          startDate: '2023-01-01',
          endDate: '2023-01-31',
          statusFilter: 'completed'
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEligibilityOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/medicalnetwork/eligibility/v3/transactions'),
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });
});

describe('Claims Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.changehealthcare.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should submit professional claim successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('submitClaim')
      .mockReturnValueOnce({ claimType: 'professional' })
      .mockReturnValueOnce({ npi: '1234567890' })
      .mockReturnValueOnce({ patientId: 'P123' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      claimId: 'CLM123',
      status: 'submitted',
    });

    const items = [{ json: {} }];
    const result = await executeClaimsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      claimId: 'CLM123',
      status: 'submitted',
    });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.changehealthcare.com/medicalnetwork/professionalclaims/v3',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        claim: { claimType: 'professional' },
        provider: { npi: '1234567890' },
        patient: { patientId: 'P123' },
      },
      json: true,
    });
  });

  it('should get claim status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getClaimStatus')
      .mockReturnValueOnce('CLM123')
      .mockReturnValueOnce({ npi: '1234567890' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      claimId: 'CLM123',
      status: 'processed',
      statusDate: '2024-01-15',
    });

    const items = [{ json: {} }];
    const result = await executeClaimsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('processed');
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getClaim');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeClaimsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Remittance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.changehealthcare.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getRemittanceAdvice operation', () => {
    it('should retrieve remittance advice successfully', async () => {
      const mockResponse = {
        remittanceAdvice: [
          { eraId: '12345', payerId: 'ABC123', amount: 1500.00 }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRemittanceAdvice')
        .mockReturnValueOnce('2023-01-01/2023-01-31')
        .mockReturnValueOnce('ABC123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.changehealthcare.com/medicalnetwork/remittance/v3?date_range=2023-01-01%2F2023-01-31&payer_id=ABC123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getRemittanceAdvice', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRemittanceAdvice')
        .mockReturnValueOnce('2023-01-01/2023-01-31')
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRemittanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getRemittanceDetails operation', () => {
    it('should get remittance details successfully', async () => {
      const mockResponse = {
        eraId: '12345',
        details: { paymentAmount: 1500.00, checkNumber: 'CHK001' }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRemittanceDetails')
        .mockReturnValueOnce('12345');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.changehealthcare.com/medicalnetwork/remittance/v3/12345',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('searchRemittance operation', () => {
    it('should search remittance records successfully', async () => {
      const mockResponse = {
        results: [
          { eraId: '12345', payerId: 'ABC123' },
          { eraId: '67890', payerId: 'DEF456' }
        ],
        totalCount: 2
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchRemittance')
        .mockReturnValueOnce('payer_id:ABC123')
        .mockReturnValueOnce('2023-01-01/2023-01-31');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.changehealthcare.com/medicalnetwork/remittance/v3/search?search_criteria=payer_id%3AABC123&date_range=2023-01-01%2F2023-01-31',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('PriorAuthorization Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.changehealthcare.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should submit prior authorization request successfully', async () => {
    const mockResponse = {
      authorization_id: 'auth123',
      status: 'pending',
      submission_date: '2024-01-01T10:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('submitPriorAuth')
      .mockReturnValueOnce({ procedure: 'MRI', diagnosis: 'R51' })
      .mockReturnValueOnce({ member_id: 'P123', name: 'John Doe' })
      .mockReturnValueOnce({ npi: '1234567890', name: 'Dr. Smith' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePriorAuthorizationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.changehealthcare.com/medicalnetwork/priorauthorization/v3',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        auth_request: { procedure: 'MRI', diagnosis: 'R51' },
        patient_info: { member_id: 'P123', name: 'John Doe' },
        provider_info: { npi: '1234567890', name: 'Dr. Smith' },
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should get prior authorization status successfully', async () => {
    const mockResponse = {
      authorization_id: 'auth123',
      status: 'approved',
      approval_date: '2024-01-02T14:30:00Z',
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPriorAuthStatus')
      .mockReturnValueOnce('auth123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePriorAuthorizationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.changehealthcare.com/medicalnetwork/priorauthorization/v3/auth123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should list prior authorizations with filters successfully', async () => {
    const mockResponse = {
      authorizations: [
        { authorization_id: 'auth123', status: 'approved' },
        { authorization_id: 'auth124', status: 'pending' },
      ],
      total_count: 2,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listPriorAuthorizations')
      .mockReturnValueOnce({
        range: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
        },
      })
      .mockReturnValueOnce('approved');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePriorAuthorizationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.changehealthcare.com/medicalnetwork/priorauthorization/v3?start_date=2024-01-01T00%3A00%3A00Z&end_date=2024-01-31T23%3A59%3A59Z&status=approved',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should update prior authorization successfully', async () => {
    const mockResponse = {
      authorization_id: 'auth123',
      status: 'updated',
      last_modified: '2024-01-03T09:15:00Z',
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updatePriorAuth')
      .mockReturnValueOnce('auth123')
      .mockReturnValueOnce({ additional_info: 'Updated procedure details' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePriorAuthorizationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.changehealthcare.com/medicalnetwork/priorauthorization/v3/auth123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        auth_data: { additional_info: 'Updated procedure details' },
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPriorAuthStatus')
      .mockReturnValueOnce('invalid-auth-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Authorization not found'),
    );

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executePriorAuthorizationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{
      json: { error: 'Authorization not found' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalidOperation');

    await expect(
      executePriorAuthorizationOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Unknown operation: invalidOperation');
  });
});

describe('EdiTransactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-access-token',
        baseUrl: 'https://api.changehealthcare.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  it('should submit EDI file successfully', async () => {
    const mockResponse = { fileId: 'file123', status: 'submitted' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('submitEdiFile')
      .mockReturnValueOnce('ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *220101*1000*U*00401*000000001*0*P*>')
      .mockReturnValueOnce('837P');

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.changehealthcare.com/apip/edi/v2/files',
      headers: {
        'Authorization': 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      body: {
        file_data: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *220101*1000*U*00401*000000001*0*P*>',
        transaction_type: '837P'
      },
      json: true,
    });
  });

  it('should get EDI file successfully', async () => {
    const mockResponse = { fileId: 'file123', content: 'edi-content', status: 'processed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEdiFile')
      .mockReturnValueOnce('file123');

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.changehealthcare.com/apip/edi/v2/files/file123',
      headers: {
        'Authorization': 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should list EDI files with filters successfully', async () => {
    const mockResponse = { files: [{ fileId: 'file123' }, { fileId: 'file456' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listEdiFiles')
      .mockReturnValueOnce('837P')
      .mockReturnValueOnce({ range: { startDate: '2023-01-01T00:00:00Z', endDate: '2023-01-31T23:59:59Z' } });

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.changehealthcare.com/apip/edi/v2/files?transaction_type=837P&start_date=2023-01-01T00%3A00%3A00Z&end_date=2023-01-31T23%3A59%3A59Z',
      headers: {
        'Authorization': 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get EDI file status successfully', async () => {
    const mockResponse = { fileId: 'file123', status: 'processing', progress: 75 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEdiFileStatus')
      .mockReturnValueOnce('file123');

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.changehealthcare.com/apip/edi/v2/files/file123/status',
      headers: {
        'Authorization': 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should delete EDI file successfully', async () => {
    const mockResponse = { fileId: 'file123', deleted: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteEdiFile')
      .mockReturnValueOnce('file123');

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.changehealthcare.com/apip/edi/v2/files/file123',
      headers: {
        'Authorization': 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API error and continue on fail', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('submitEdiFile');

    const result = await executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when not continuing on fail', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('submitEdiFile');

    await expect(executeEdiTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('FhirPatients Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.changehealthcare.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create a patient successfully', async () => {
		const patientResource = {
			resourceType: 'Patient',
			name: [{ family: 'Doe', given: ['John'] }],
			gender: 'male',
			birthDate: '1990-01-01'
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createPatient')
			.mockReturnValueOnce(patientResource);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'patient-123', resourceType: 'Patient' });

		const result = await executeFhirPatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.changehealthcare.com/fhir/r4/Patient',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/fhir+json',
				'Accept': 'application/fhir+json',
			},
			body: patientResource,
			json: true,
		});

		expect(result).toEqual([{
			json: { id: 'patient-123', resourceType: 'Patient' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should get a patient successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPatient')
			.mockReturnValueOnce('patient-123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'patient-123', resourceType: 'Patient' });

		const result = await executeFhirPatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.changehealthcare.com/fhir/r4/Patient/patient-123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { id: 'patient-123', resourceType: 'Patient' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should search patients successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('searchPatients')
			.mockReturnValueOnce('John Doe')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('1990-01-01');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			resourceType: 'Bundle',
			entry: [{ resource: { id: 'patient-123', resourceType: 'Patient' } }]
		});

		const result = await executeFhirPatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.changehealthcare.com/fhir/r4/Patient?name=John%20Doe&birthdate=1990-01-01',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
			},
			json: true,
		});

		expect(result[0].json.resourceType).toBe('Bundle');
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPatient');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeFhirPatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 }
		}]);
	});
});

describe('FhirObservations Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.changehealthcare.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create observation successfully', async () => {
		const mockObservation = { resourceType: 'Observation', status: 'final' };
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'createObservation';
			if (param === 'observation_resource') return mockObservation;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockObservation);

		const result = await executeFhirObservationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.changehealthcare.com/fhir/r4/Observation',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/fhir+json',
			},
			json: true,
			body: mockObservation,
		});
		expect(result).toEqual([{ json: mockObservation, pairedItem: { item: 0 } }]);
	});

	it('should get observation successfully', async () => {
		const mockObservation = { id: 'obs123', resourceType: 'Observation' };
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getObservation';
			if (param === 'observationId') return 'obs123';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockObservation);

		const result = await executeFhirObservationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.changehealthcare.com/fhir/r4/Observation/obs123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockObservation, pairedItem: { item: 0 } }]);
	});

	it('should search observations successfully', async () => {
		const mockBundle = { resourceType: 'Bundle', total: 1 };
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'searchObservations';
			if (param === 'patient') return 'Patient/123';
			if (param === 'code') return 'vital-signs';
			if (param === 'date') return '2023-01-01';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBundle);

		const result = await executeFhirObservationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.changehealthcare.com/fhir/r4/Observation?patient=Patient%2F123&code=vital-signs&date=2023-01-01',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockBundle, pairedItem: { item: 0 } }]);
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('createObservation');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeFhirObservationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});
});
});
