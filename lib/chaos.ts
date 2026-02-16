/**
 * Système de chaos contrôlé et reproductible
 * Utilise un seed pour garantir la reproductibilité des comportements
 */

export interface ChaosConfig {
  seed: string;
  enabled: boolean;
  networkLatency: {
    min: number;
    max: number;
    jitter: number;
  };
  errorRate: number;
  popupOverlay: boolean;
  modalDelay: number;
  toastDelay: number;
  skeletonDelay: number;
}

// État global du chaos (côté serveur et client)
let chaosState: ChaosConfig = {
  seed: 'default',
  enabled: false,
  networkLatency: { min: 0, max: 0, jitter: 0 },
  errorRate: 0,
  popupOverlay: false,
  modalDelay: 0,
  toastDelay: 0,
  skeletonDelay: 0,
};

/**
 * Génère un nombre pseudo-aléatoire basé sur un seed
 * Utilise un générateur linéaire congruentiel simple
 */
export function seededRandom(seed: string, index: number = 0): number {
  let hash = 0;
  const seedStr = `${seed}-${index}`;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Normaliser entre 0 et 1
  return Math.abs(Math.sin(hash)) % 1;
}

/**
 * Génère un nombre aléatoire entre min et max basé sur le seed
 */
export function seededRandomRange(
  seed: string,
  min: number,
  max: number,
  index: number = 0
): number {
  const random = seededRandom(seed, index);
  return min + random * (max - min);
}

/**
 * Détermine si une erreur doit être générée basée sur le taux d'erreur
 */
export function shouldTriggerError(seed: string, errorRate: number, index: number = 0): boolean {
  if (errorRate === 0) return false;
  return seededRandom(seed, index) < errorRate;
}

/**
 * Calcule une latence réseau avec jitter basée sur le seed
 */
export function calculateNetworkLatency(
  seed: string,
  config: ChaosConfig['networkLatency'],
  index: number = 0
): number {
  const baseLatency = seededRandomRange(seed, config.min, config.max, index);
  const jitter = seededRandomRange(seed, -config.jitter, config.jitter, index * 2);
  return Math.max(0, baseLatency + jitter);
}

/**
 * Simule un délai réseau avec chaos
 */
export async function simulateNetworkDelay(
  seed: string,
  config: ChaosConfig,
  index: number = 0
): Promise<void> {
  if (!config.enabled || config.networkLatency.max === 0) {
    return;
  }
  
  const delay = calculateNetworkLatency(seed, config.networkLatency, index);
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Initialise la configuration du chaos depuis les query params et headers
 */
export function initChaosFromRequest(
  searchParams: URLSearchParams,
  headers: Headers | Record<string, string> = {}
): ChaosConfig {
  const chaosParam = searchParams.get('chaos');
  const seedParam = searchParams.get('seed');
  const chaosHeader = 'x-chaos-seed' in headers 
    ? (headers as Record<string, string>)['x-chaos-seed']
    : null;

  const enabled = chaosParam === '1' || chaosParam === 'true';
  const seed = seedParam || chaosHeader || 'default';

  return {
    seed,
    enabled,
    networkLatency: {
      min: enabled ? 100 : 0,
      max: enabled ? 2000 : 0,
      jitter: enabled ? 200 : 0,
    },
    errorRate: enabled ? 0.1 : 0, // 10% d'erreurs en mode chaos
    popupOverlay: enabled && seededRandom(seed, 1) > 0.5,
    modalDelay: enabled ? seededRandomRange(seed, 100, 500, 2) : 0,
    toastDelay: enabled ? seededRandomRange(seed, 200, 800, 3) : 0,
    skeletonDelay: enabled ? seededRandomRange(seed, 300, 1200, 4) : 0,
  };
}

/**
 * Met à jour l'état global du chaos
 */
export function setChaosState(config: ChaosConfig): void {
  chaosState = config;
}

/**
 * Récupère l'état actuel du chaos
 */
export function getChaosState(): ChaosConfig {
  return chaosState;
}

/**
 * Réinitialise l'état du chaos
 */
export function resetChaosState(): void {
  chaosState = {
    seed: 'default',
    enabled: false,
    networkLatency: { min: 0, max: 0, jitter: 0 },
    errorRate: 0,
    popupOverlay: false,
    modalDelay: 0,
    toastDelay: 0,
    skeletonDelay: 0,
  };
}
