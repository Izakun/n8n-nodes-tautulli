import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';

// operation -> Tautulli API command
const COMMAND_BY_OPERATION: Record<string, string> = {
	getActivity: 'get_activity',
	getHistory: 'get_history',
	getHomeStats: 'get_home_stats',
	getLibraries: 'get_libraries',
	getServerInfo: 'get_server_info',
	getUsers: 'get_users',
};

export class Tautulli implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tautulli',
		name: 'tautulli',
		icon: { light: 'file:tautulli.svg', dark: 'file:tautulli.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Query your Tautulli Plex monitoring server through its v2 API',
		defaults: {
			name: 'Tautulli',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'tautulliApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Activity', value: 'getActivity', action: 'Get current activity' },
					{ name: 'Get History', value: 'getHistory', action: 'Get the watch history' },
					{ name: 'Get Home Stats', value: 'getHomeStats', action: 'Get the homepage statistics' },
					{ name: 'Get Libraries', value: 'getLibraries', action: 'Get the libraries' },
					{ name: 'Get Server Info', value: 'getServerInfo', action: 'Get the server info' },
					{ name: 'Get Users', value: 'getUsers', action: 'Get the users' },
				],
				default: 'getActivity',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('tautulliApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;

				const options: IHttpRequestOptions = {
					method: 'GET' as IHttpRequestMethods,
					baseURL,
					url: '/api/v2',
					qs: { cmd: COMMAND_BY_OPERATION[operation] },
					json: true,
				};

				const raw = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'tautulliApi',
					options,
				)) as IDataObject;

				// Tautulli wraps everything in { response: { result, message, data } }
				const payload = (raw?.response as IDataObject) ?? raw;
				const data = (payload?.data as unknown) ?? payload;

				if (Array.isArray(data)) {
					for (const element of data) {
						returnData.push({ json: element as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: (data ?? {}) as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
