interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

const buildOptions = (
  headers: Record<string, string> = {},
  params: Record<string, string> = {}
): RequestOptions => {
  const options: RequestOptions = { headers: {} }

  const token = localStorage.getItem("accessToken")

  if (token) {
    options.headers = { ...headers, Authorization: `Bearer ${token}` }
  } else {
    options.headers = headers
  }

  if (Object.keys(params).length > 0) {
    options.params = params
  }
  return options
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.text()
    console.error("HTTP error", response.status, errorBody)
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

const proxyService = {
  get: async (
    url: string,
    params: Record<string, string> = {},
    headers: Record<string, string> = {}
  ) => {
    const options = buildOptions(headers, params)
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}${
      queryString ? `?${queryString}` : ""
    }`
    console.log(options)
    const response = await fetch(fullUrl, options)
    return response
  },

  post: async (
    url: string,
    data: any,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    if (!(data instanceof FormData)) {
      headers = { ...headers, "Content-Type": "application/json" }
      data = JSON.stringify(data)
    }

    const options = buildOptions(headers, params)
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`

    const response = await fetch(fullUrl, {
      method: "POST",
      body: data,
      ...options,
    })
    return response
  },

  put: async (
    url: string,
    data: any,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    if (!(data instanceof FormData)) {
      headers = { ...headers, "Content-Type": "application/json" }
      data = JSON.stringify(data)
    }

    const options = buildOptions(headers, params)
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`

    const response = await fetch(fullUrl, {
      method: "PUT",
      body: data,
      ...options,
    })
    return response
  },

  delete: async (
    url: string,
    headers: Record<string, string> = {},
    params: Record<string, string> = {}
  ) => {
    const options = buildOptions(headers, params)
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`

    const response = await fetch(fullUrl, {
      method: "DELETE",
      ...options,
    })
    return response
  },
}

export default proxyService
