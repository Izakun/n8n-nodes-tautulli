import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TautulliApi implements ICredentialType {
	name = 'tautulliApi';

	displayName = 'Tautulli API';

	icon = 'file:tautulliApi.svg' as const;

	documentationUrl = 'https://github.com/Tautulli/Tautulli/wiki/Tautulli-API-Reference';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://tautulli:8181',
			required: true,
			description:
				'Base URL of the Tautulli instance (e.g. http://tautulli:8181). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Tautulli API key (Settings → Web Interface → API Key)',
		},
	];

	// Tautulli expects the key as the "apikey" query parameter.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v2',
			qs: {
				cmd: 'get_server_info',
			},
		},
	};
}
