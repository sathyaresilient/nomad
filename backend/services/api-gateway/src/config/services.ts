/**
 * Service Proxy Configuration
 * Routes requests to appropriate microservices
 */

export interface ServiceConfig {
    name: string;
    url: string;
    healthPath: string;
}

// Service URLs - use environment variables in production
const getServiceUrl = (name: string, defaultPort: number): string => {
    const envKey = `${name.toUpperCase().replace('-', '_')}_URL`;
    return process.env[envKey] || `http://localhost:${defaultPort}`;
};

export const services: Record<string, ServiceConfig> = {
    user: {
        name: 'user-service',
        url: getServiceUrl('USER_SERVICE', 3001),
        healthPath: '/health',
    },
    notification: {
        name: 'notification-service',
        url: getServiceUrl('NOTIFICATION_SERVICE', 3002),
        healthPath: '/health',
    },
    media: {
        name: 'media-service',
        url: getServiceUrl('MEDIA_SERVICE', 3003),
        healthPath: '/health',
    },
    travel: {
        name: 'travel-service',
        url: getServiceUrl('TRAVEL_SERVICE', 3004),
        healthPath: '/health',
    },
    social: {
        name: 'social-service',
        url: getServiceUrl('SOCIAL_SERVICE', 3005),
        healthPath: '/health',
    },
    messaging: {
        name: 'messaging-service',
        url: getServiceUrl('MESSAGING_SERVICE', 3006),
        healthPath: '/health',
    },
};

// Route prefix to service mapping
export const routeMapping: Record<string, string> = {
    '/api/v1/auth': 'user',
    '/api/v1/users': 'user',
    '/api/v1/notifications': 'notification',
    '/api/v1/media': 'media',
    '/api/v1/trips': 'travel',
    '/api/v1/groups': 'social',
    '/api/v1/connections': 'social',
    '/api/v1/posts': 'social',
    '/api/v1/conversations': 'messaging',
    '/api/v1/messages': 'messaging',
    '/api/v1/presence': 'messaging',
    '/api/v1/chat': 'messaging',
};

export function getServiceForRoute(path: string): ServiceConfig | null {
    for (const [prefix, serviceName] of Object.entries(routeMapping)) {
        if (path.startsWith(prefix)) {
            return services[serviceName] || null;
        }
    }
    return null;
}
