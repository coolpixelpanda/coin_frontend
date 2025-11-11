import axios from 'axios'

const API_BASE_URL = 'http://localhost:3006/api' // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  // POST /api/register - Same structure as login
  register: async (userData) => {
    const payload = {
      Username: userData.username,
      Email: userData.email,
      Password: userData.password
    }
    
    console.log('API - Register Request:')
    console.log('URL:', `${API_BASE_URL}/register`)
    console.log('Method: POST')
    console.log('Payload:', payload)
    
    try {
      const response = await api.post('/register', payload)
      console.log('API - Register Response:', response.data)
      return response.data
    } catch (error) {
      console.error('API - Register Error:', error.response?.data || error.message)
      throw error.response?.data || error.message
    }
  },

  // POST /api/login - Same structure as register
  login: async (credentials) => {
    const payload = {
      Username: credentials.username,
      Email: credentials.email,
      Password: credentials.password
    }
    
    console.log('API - Login Request:')
    console.log('URL:', `${API_BASE_URL}/login`)
    console.log('Method: POST')
    console.log('Payload:', payload)
    
    try {
      const response = await api.post('/login', payload)
      console.log('API - Login Response:', response.data)
      return response.data
    } catch (error) {
      console.error('API - Login Error:', error.response?.data || error.message)
      throw error.response?.data || error.message
    }
  },
}

export const cryptoAPI = {
  // GET /api/crypto-price
  getCryptoPrice: async () => {
    try {
      const response = await api.get('/crypto-price')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // GET current prices and percent changes from CoinPaprika
  // Returns keyed object by coin id with price and 1h/24h/7d changes
  getCoinPaprikaTickers: async () => {
    try {
      const url = `https://api.coinpaprika.com/v1/tickers?quotes=USD`
      const response = await axios.get(url, { headers: { 'Accept': 'application/json' } })
      const data = response.data || []

      // Map our app ids to CoinPaprika ids
      const idMap = {
        'bitcoin': 'btc-bitcoin',
        'ethereum': 'eth-ethereum',
        'tether': 'usdt-tether',
        'ripple': 'xrp-xrp',
        'binancecoin': 'bnb-binance-coin',
        'solana': 'sol-solana'
      }

      const result = {}
      const paprikaById = {}
      // Index by id for fast lookup
      for (const item of data) {
        paprikaById[item.id] = item
      }

      Object.keys(idMap).forEach(appId => {
        const paprikaId = idMap[appId]
        const item = paprikaById[paprikaId]
        if (item && item.quotes && item.quotes.USD) {
          const q = item.quotes.USD
          result[appId] = {
            price: q.price,
            change_1h: q.percent_change_1h,
            change_24h: q.percent_change_24h,
            change_7d: q.percent_change_7d,
            market_cap: q.market_cap,
            volume: q.volume_24h
          }
        }
      })

      return result
    } catch (error) {
      console.error('CoinPaprika API error:', error.response?.data || error.message)
      throw error.response?.data || error.message
    }
  },

  // GET prices directly from CoinGecko (client-side, no backend needed)
  // Returns keyed object by coin id with price, changes, market cap, and volume
  getCoinGeckoPrices: async () => {
    try {
      const ids = [
        'bitcoin',
        'ethereum',
        'tether',
        'ripple',
        'binancecoin',
        'solana'
      ].join(',')

      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=1h,24h,7d`

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json'
        }
      })

      const data = response.data || []
      const result = {}

      data.forEach((item) => {
        result[item.id] = {
          price: item.current_price,
          change_1h: item.price_change_percentage_1h_in_currency,
          change_24h: item.price_change_percentage_24h_in_currency ?? item.price_change_percentage_24h,
          change_7d: item.price_change_percentage_7d_in_currency,
          market_cap: item.market_cap,
          volume: item.total_volume
        }
      })

      return result
    } catch (error) {
      console.error('CoinGecko API error:', error.response?.data || error.message)
      throw error.response?.data || error.message
    }
  },

  // GET historical price data from CoinGecko
  // coinId: 'bitcoin', 'ethereum', etc.
  // days: 1, 7, 30, 365, or 'max'
  getCoinGeckoHistory: async (coinId, days = 1) => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json'
        }
      })

      // Response format: { prices: [[timestamp, price], ...] }
      const prices = response.data?.prices || []
      
      return prices.map(([timestamp, price]) => ({
        timestamp,
        price
      }))
    } catch (error) {
      console.error('CoinGecko History API error:', error.response?.data || error.message)
      throw error.response?.data || error.message
    }
  },

  // POST /api/exchange
  exchangeCrypto: async (exchangeData) => {
    try {
      const payload = {
        User_id: exchangeData.user_id,
        Category: exchangeData.category,
        Amount: exchangeData.amount
      }
      const response = await api.post('/exchange', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

export default api
