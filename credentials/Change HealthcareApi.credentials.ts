import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ChangeHealthcareApi implements ICredentialType {
	name = 'changeHealthcareApi';
	displayName = 'Change Healthcare API';
	documentationUrl = 'https://developers.changehealthcare.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'OAuth 2.0 Client ID for Change Healthcare API',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'OAuth 2.0 Client Secret for Change Healthcare API',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.changehealthcare.com',
			description: 'Base URL for Change Healthcare API',
		},
		{
			displayName: 'Token Endpoint',
			name: 'tokenEndpoint',
			type: 'string',
			required: true,
			default: 'https://api.changehealthcare.com/apip/auth/v2/token',
			description: 'OAuth 2.0 token endpoint for authentication',
		},
	];
}