import axios, {AxiosRequestConfig} from 'axios'


interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, string>;
}

const buildOptions = (
  headers: Record<string, string> = {},
  params: Record<string, string> = {}
): RequestOptions => {
  const options: RequestOptions = { headers: {} };

  const token = localStorage.getItem('accessToken');

  if (token) {
    options.headers = { ...headers, Authorization: `Bearer ${token}` };
  } else {
    options.headers = headers;
  }

  if (Object.keys(params).length > 0) {
    options.params = params;
  }
  return options;
};

const proxyService = {
  get: async (
    url: string,
    params: Record<string, string> = {},
    headers: Record<string, string> = {}
  ) => {
    const options = buildOptions(headers, params);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`;
    return await axios.get(fullUrl, options);
  },

  post: async (
    url: string,
    data?: any,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    if (!(data instanceof FormData)) {
      headers = { ...headers, 'Content-Type': 'application/json' };
      data = JSON.stringify(data);
    }

    const options = buildOptions(headers, params);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`;
    return await axios.post(fullUrl, data, options);
  },

  put: async (
    url: string,
    data: any,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    if (!(data instanceof FormData)) {
      headers = { ...headers, 'Content-Type': 'application/json' };
      data = JSON.stringify(data);
    }
    const options = buildOptions(headers, params);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`;
    return await axios.put(fullUrl, data, options);
    
  },

  delete: async (
    url: string,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    const options = buildOptions(headers, params);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`;
    return await axios.delete(fullUrl, options);
  },
};

export default proxyService;
