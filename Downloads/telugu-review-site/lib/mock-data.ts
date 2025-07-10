// Mock data storage using localStorage for persistence
const PRODUCTS_KEY = "review_site_products"
const BLOG_POSTS_KEY = "review_site_blog_posts"

export interface Product {
  id: string
  name: string
  category: string
  platform?: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  images?: string[]
  affiliateUrl: string
  review: string
  pros: string[]
  cons: string[]
  specifications?: Record<string, string>
  videoId?: string
  createdAt?: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  author: string
  publishedAt: string
  readTime: string
  views?: number
  tags?: string[]
}

// Initialize with default data if localStorage is empty
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    platform: "Amazon",
    price: 134900,
    originalPrice: 159900,
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    affiliateUrl: "https://amazon.in/dp/B0CHX1W1XY",
    review:
      "<h2>Comprehensive iPhone 15 Pro Max Review</h2><p>The iPhone 15 Pro Max represents Apple's flagship smartphone for 2023, bringing significant improvements in design, performance, and camera capabilities. After extensive testing, here's our detailed review.</p><h3>Design and Build Quality</h3><p>The titanium construction feels premium and reduces weight compared to previous stainless steel models. The Action Button replaces the traditional mute switch, offering customizable functionality.</p><h3>Performance</h3><p>Powered by the A17 Pro chip, this device handles everything from intensive gaming to professional video editing with ease. The 8GB of RAM ensures smooth multitasking.</p><h3>Camera System</h3><p>The triple camera system with 48MP main sensor delivers exceptional photo and video quality. The new 5x telephoto lens provides incredible zoom capabilities.</p>",
    pros: [
      "Excellent camera system with 5x zoom",
      "Premium titanium build quality",
      "Outstanding performance with A17 Pro chip",
      "Long battery life",
      "USB-C connectivity",
    ],
    cons: [
      "Very expensive",
      "No significant design changes",
      "Limited customization options",
      "Heavy despite titanium construction",
    ],
    specifications: {
      Display: "6.7-inch Super Retina XDR",
      Processor: "A17 Pro chip",
      Storage: "256GB, 512GB, 1TB",
      Camera: "48MP + 12MP + 12MP",
      Battery: "Up to 29 hours video playback",
      OS: "iOS 17",
    },
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    platform: "Flipkart",
    price: 124999,
    originalPrice: 129999,
    rating: 4.4,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    affiliateUrl: "https://flipkart.com/samsung-galaxy-s24-ultra",
    review:
      "<h2>Samsung Galaxy S24 Ultra Review</h2><p>Samsung's latest flagship brings AI-powered features and improved camera capabilities to compete with the best smartphones in the market.</p><h3>AI Features</h3><p>The Galaxy AI integration provides intelligent photo editing, real-time translation, and smart suggestions throughout the interface.</p><h3>S Pen Integration</h3><p>The built-in S Pen offers precise control for note-taking, drawing, and navigation, making it ideal for productivity tasks.</p>",
    pros: [
      "Excellent S Pen integration",
      "AI-powered camera features",
      "Bright and vibrant display",
      "Versatile camera system",
      "Good battery life",
    ],
    cons: ["Expensive pricing", "Bulky design", "OneUI can feel overwhelming", "Charging speed could be faster"],
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      Storage: "256GB, 512GB, 1TB",
      Camera: "200MP + 50MP + 12MP + 10MP",
      Battery: "5000mAh",
      OS: "Android 14 with One UI 6.1",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    category: "Electronics",
    platform: "Amazon",
    price: 24990,
    originalPrice: 29990,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=300",
    affiliateUrl: "https://amazon.in/dp/B09XS7JWHH",
    review:
      "<h2>Sony WH-1000XM5 Headphones Review</h2><p>Sony's flagship noise-canceling headphones deliver exceptional audio quality and industry-leading noise cancellation.</p><h3>Audio Quality</h3><p>The 30mm drivers provide rich, detailed sound with excellent bass response and clear highs.</p><h3>Noise Cancellation</h3><p>The advanced noise cancellation technology effectively blocks out ambient noise, making them perfect for travel and work.</p>",
    pros: [
      "Excellent noise cancellation",
      "Superior audio quality",
      "Comfortable for long wear",
      "Great battery life (30 hours)",
      "Quick charge feature",
    ],
    cons: ["Not foldable design", "Touch controls can be sensitive", "Premium price point", "Limited color options"],
    specifications: {
      Driver: "30mm",
      "Frequency Response": "4Hz-40kHz",
      "Battery Life": "30 hours",
      Charging: "USB-C, Quick charge",
      Weight: "250g",
      Connectivity: "Bluetooth 5.2, NFC",
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

const defaultBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Best Smartphones Under ₹50,000 in 2024",
    excerpt:
      "Discover the top smartphone picks that offer flagship features without breaking the bank. Our comprehensive guide covers performance, camera quality, and value for money.",
    content:
      "<h2>Introduction</h2><p>The smartphone market in 2024 offers incredible value in the mid-premium segment. Here are our top picks for the best smartphones under ₹50,000.</p><h3>1. OnePlus 12R</h3><p>The OnePlus 12R brings flagship performance at a competitive price point...</p><h3>2. iPhone 13</h3><p>Apple's iPhone 13 continues to offer excellent value with its proven A15 Bionic chip...</p><h3>3. Samsung Galaxy S23 FE</h3><p>Samsung's Fan Edition model provides premium features at a more accessible price...</p>",
    category: "Buying Guides",
    image: "/placeholder.svg?height=400&width=600",
    author: "Tech Reviewer",
    publishedAt: new Date().toISOString(),
    readTime: "8 min read",
    views: 1250,
    tags: ["smartphones", "budget", "buying guide", "2024"],
  },
  {
    id: "2",
    title: "iPhone 15 vs Samsung Galaxy S24: Ultimate Comparison",
    excerpt:
      "A detailed comparison between Apple's iPhone 15 and Samsung's Galaxy S24, covering design, performance, camera, and overall value proposition.",
    content:
      "<h2>Design and Build</h2><p>Both phones feature premium construction, but with different approaches...</p><h3>Performance Comparison</h3><p>The A17 Pro chip in iPhone 15 vs Snapdragon 8 Gen 3 in Galaxy S24...</p><h3>Camera Battle</h3><p>Comparing the camera systems and real-world photo quality...</p>",
    category: "Comparisons",
    image: "/placeholder.svg?height=400&width=600",
    author: "Mobile Expert",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    readTime: "12 min read",
    views: 2100,
    tags: ["iPhone", "Samsung", "comparison", "flagship"],
  },
  {
    id: "3",
    title: "How to Choose the Perfect Headphones for Your Needs",
    excerpt:
      "From wireless earbuds to over-ear headphones, learn how to select the right audio gear based on your lifestyle, budget, and preferences.",
    content:
      "<h2>Understanding Your Needs</h2><p>Before diving into specific models, it's important to understand what you'll primarily use your headphones for...</p><h3>Types of Headphones</h3><p>Over-ear, on-ear, and in-ear options each have their advantages...</p><h3>Key Features to Consider</h3><p>Noise cancellation, battery life, sound quality, and comfort are crucial factors...</p>",
    category: "Buying Guides",
    image: "/placeholder.svg?height=400&width=600",
    author: "Audio Specialist",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    readTime: "6 min read",
    views: 890,
    tags: ["headphones", "audio", "buying guide", "wireless"],
  },
]

// Helper functions for localStorage operations
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage:`, error)
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage:`, error)
  }
}

// Product functions
export const getProducts = (): Product[] => {
  return getFromStorage(PRODUCTS_KEY, defaultProducts)
}

export const getProductById = (id: string): Product | undefined => {
  const products: Product[] = getProducts()
  return products.find(product => product.id === id)
}

export const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products: Product[] = getProducts()
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  const updatedProducts: Product[] = [newProduct, ...products]
  saveToStorage(PRODUCTS_KEY, updatedProducts)
  return newProduct
}

export const updateProduct = (id: string, productData: Partial<Product>): Product | null => {
  const products: Product[] = getProducts()
  const index: number = products.findIndex(product => product.id === id)
  
  if (index === -1) return null
  
  const updatedProduct: Product = { ...products[index], ...productData }
  products[index] = updatedProduct
  saveToStorage(PRODUCTS_KEY, products)
  return updatedProduct
}

export const deleteProduct = (id: string): boolean => {
  const products: Product[] = getProducts()
  const filteredProducts: Product[] = products.filter(product => product.id !== id)
  
  if (filteredProducts.length === products.length) return false
  
  saveToStorage(PRODUCTS_KEY, filteredProducts)
  return true
}

// Blog post functions
export const getBlogPosts = (): BlogPost[] => {
  return getFromStorage(BLOG_POSTS_KEY, defaultBlogPosts)
}

export const getBlogPostById = (id: string): BlogPost | undefined => {
  const posts: BlogPost[] = getBlogPosts()
  return posts.find(post => post.id === id)
}

export const addBlogPost = (postData: Omit<BlogPost, 'id'>): BlogPost => {
  const posts: BlogPost[] = getBlogPosts()
  const newPost: BlogPost = {
    ...postData,
    id: Date.now().toString()
  }
  
  const updatedPosts: BlogPost[] = [newPost, ...posts]
  saveToStorage(BLOG_POSTS_KEY, updatedPosts)
  return newPost
}

export const updateBlogPost = (id: string, postData: Partial<BlogPost>): BlogPost | null => {
  const posts: BlogPost[] = getBlogPosts()
  const index: number = posts.findIndex(post => post.id === id)
  
  if (index === -1) return null
  
  const updatedPost: BlogPost = { ...posts[index], ...postData }
  posts[index] = updatedPost
  saveToStorage(BLOG_POSTS_KEY, posts)
  return updatedPost
}

export const deleteBlogPost = (id: string): boolean => {
  const posts: BlogPost[] = getBlogPosts()
  const filteredPosts: BlogPost[] = posts.filter(post => post.id !== id)
  
  if (filteredPosts.length === posts.length) return false
  
  saveToStorage(BLOG_POSTS_KEY, filteredPosts)
  return true
}

// Utility functions
export const getProductsByCategory = (category: string): Product[] => {
  const products: Product[] = getProducts()
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  )
}

export const searchProducts = (query: string): Product[] => {
  const products: Product[] = getProducts()
  const lowercaseQuery: string = query.toLowerCase()
  
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.review.toLowerCase().includes(lowercaseQuery)
  )
}

export const getTrendingProducts = (limit: number = 6): Product[] => {
  const products: Product[] = getProducts()
  // Sort by rating and return top products
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  const products: Product[] = getProducts()
  // Return most recent products
  return products
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, limit)
}

// Export mockCategories for use in navbar and other components
export const mockCategories = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Buying Guides', slug: 'buying-guides' },
  { id: '3', name: 'Comparisons', slug: 'comparisons' },
  { id: '4', name: 'Product Reviews', slug: 'product-reviews' },
  { id: '5', name: 'Tech News', slug: 'tech-news' },
  { id: '6', name: 'Tips & Tricks', slug: 'tips-tricks' },
  { id: '7', name: 'Deals & Offers', slug: 'deals-offers' },
  { id: '8', name: 'Audio', slug: 'audio' },
  // Add more as needed
]

export const mockProducts = defaultProducts;
export const mockBlogPosts = defaultBlogPosts;
