/**
 * Données de démonstration pour le catalogue
 */

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  inStock: boolean
  rating: number
  image?: string
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro 15"',
    description: 'Ordinateur portable haute performance avec écran Retina',
    price: 1299.99,
    category: 'Electronics',
    brand: 'TechBrand',
    inStock: true,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Smartphone Ultra',
    description: 'Smartphone dernier cri avec caméra 108MP',
    price: 899.99,
    category: 'Electronics',
    brand: 'TechBrand',
    inStock: true,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Écouteurs Sans Fil',
    description: 'Écouteurs Bluetooth avec réduction de bruit active',
    price: 199.99,
    category: 'Electronics',
    brand: 'AudioPro',
    inStock: true,
    rating: 4.3,
  },
  {
    id: '4',
    name: 'Montre Connectée',
    description: 'Montre intelligente avec suivi de la santé',
    price: 299.99,
    category: 'Electronics',
    brand: 'WearTech',
    inStock: false,
    rating: 4.2,
  },
  {
    id: '5',
    name: 'Tablette 10"',
    description: 'Tablette Android avec stylet inclus',
    price: 499.99,
    category: 'Electronics',
    brand: 'TechBrand',
    inStock: true,
    rating: 4.0,
  },
  {
    id: '6',
    name: 'Clavier Mécanique',
    description: 'Clavier gaming avec switches RGB',
    price: 149.99,
    category: 'Accessories',
    brand: 'GamingGear',
    inStock: true,
    rating: 4.6,
  },
  {
    id: '7',
    name: 'Souris Gaming',
    description: 'Souris optique haute précision 16000 DPI',
    price: 79.99,
    category: 'Accessories',
    brand: 'GamingGear',
    inStock: true,
    rating: 4.7,
  },
  {
    id: '8',
    name: 'Casque Gaming',
    description: 'Casque surround 7.1 avec micro détachable',
    price: 129.99,
    category: 'Accessories',
    brand: 'GamingGear',
    inStock: true,
    rating: 4.4,
  },
  {
    id: '9',
    name: 'Webcam HD',
    description: 'Webcam 1080p avec micro intégré',
    price: 89.99,
    category: 'Accessories',
    brand: 'TechBrand',
    inStock: false,
    rating: 4.1,
  },
  {
    id: '10',
    name: 'Disque Dur Externe',
    description: 'Disque dur externe 2TB USB-C',
    price: 119.99,
    category: 'Storage',
    brand: 'DataStore',
    inStock: true,
    rating: 4.5,
  },
  {
    id: '11',
    name: 'SSD 1TB',
    description: 'SSD NVMe M.2 haute vitesse',
    price: 149.99,
    category: 'Storage',
    brand: 'DataStore',
    inStock: true,
    rating: 4.8,
  },
  {
    id: '12',
    name: 'Câble USB-C',
    description: 'Câble USB-C vers USB-C 2m',
    price: 19.99,
    category: 'Accessories',
    brand: 'TechBrand',
    inStock: true,
    rating: 3.9,
  },
]

export const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Storage']
export const BRANDS = ['All', 'TechBrand', 'AudioPro', 'WearTech', 'GamingGear', 'DataStore']

export type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating'
