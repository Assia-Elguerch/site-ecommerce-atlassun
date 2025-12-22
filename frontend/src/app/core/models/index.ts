// ============================================
// Product Model
// ============================================

export interface Product {
    id: string;
    _id?: string; // MongoDB ID support
    nom: string;
    description: string;
    prix: number;
    prixPromo?: number;
    stock: number;
    categorie: string;
    images: string[];
    imagePrincipale: string;
    tailles?: string[];
    couleurs?: string[];
    nouveau: boolean;
    enPromotion: boolean;
    vedette: boolean;
    dateCreation: Date;
    dateModification: Date;
}

export interface ProductCreateRequest {
    nom: string;
    description: string;
    prix: number;
    prixPromo?: number;
    stock: number;
    categorie: string;
    images: string[];
    imagePrincipale: string;
    tailles?: string[];
    couleurs?: string[];
    nouveau?: boolean;
    enPromotion?: boolean;
    vedette?: boolean;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
    id: string;
}

// ============================================
// Category Model
// ============================================

export interface Category {
    id: number;
    nom: string;
    description: string;
    image?: string;
    ordre: number;
    active: boolean;
    dateCreation: Date;
}

export interface CategoryCreateRequest {
    nom: string;
    description: string;
    image?: string;
    ordre?: number;
    active?: boolean;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {
    id: number;
}

// ============================================
// User Model
// ============================================

export enum UserRole {
    CLIENT = 'client',
    VENDEUR = 'vendeur',
    ADMIN = 'admin'
}

export interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
    role: UserRole;
    actif: boolean;
    dateInscription: Date;
    avatar?: string;
}

export interface UserCreateRequest {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
    role?: UserRole;
}

export interface UserUpdateRequest {
    id: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
}

// ============================================
// Order Model
// ============================================

export enum OrderStatus {
    EN_ATTENTE = 'EN_ATTENTE',
    CONFIRMEE = 'CONFIRMEE',
    EN_PREPARATION = 'EN_PREPARATION',
    EXPEDIEE = 'EXPEDIEE',
    LIVREE = 'LIVREE',
    ANNULEE = 'ANNULEE'
}

export interface OrderItem {
    id: string;
    produitId: string;
    produit?: Product;
    quantite: number;
    prixUnitaire: number;
    total: number;
}

export interface Order {
    id: string;
    _id?: string; // MongoDB ID support
    numero: string;
    numeroCommande?: string; // Backend alias support
    clientId: string;
    client?: User;
    items: OrderItem[];
    sousTotal: number;
    fraisLivraison: number;
    totalGeneral: number;
    statut: OrderStatus;
    adresseLivraison: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
    notes?: string;
    dateCommande: Date;
    dateModification: Date;
}

export interface OrderCreateRequest {
    clientId?: number;
    items: {
        produitId: number;
        quantite: number;
        prixUnitaire: number;
    }[];
    adresseLivraison: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
    notes?: string;
}

export interface OrderUpdateStatusRequest {
    id: number;
    statut: OrderStatus;
    notes?: string;
}

// ============================================
// Cart Model
// ============================================

export interface CartItem {
    produit: Product;
    quantite: number;
    taille?: string;
    couleur?: string;
}

export interface Cart {
    items: CartItem[];
    sousTotal: number;
    fraisLivraison: number;
    total: number;
}

// ============================================
// Auth Model
// ============================================

export interface LoginRequest {
    email: string;
    motDePasse: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    requiresTwoFactor?: boolean;
    email?: string;
    qrCodeUrl?: string;
    secret?: string;
}

export interface RegisterRequest {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
}

// ============================================
// API Response Model
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

// ============================================
// Filter & Sort Models
// ============================================

export interface ProductFilter {
    categorieId?: number;
    categorie?: string;
    sousCategorie?: string;
    prixMin?: number;
    prixMax?: number;
    search?: string;
    nouveau?: boolean;
    enPromotion?: boolean;
    enStock?: boolean;
}

export interface SortOption {
    field: string;
    direction: 'asc' | 'desc';
}

export interface PageRequest {
    page: number;
    size: number;
    sort?: SortOption;
}
