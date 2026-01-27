import admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

export const initFirebase = () => {
    if (firebaseApp) return firebaseApp;

    try {
        const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

        if (!serviceAccountVar) {
            console.warn('FIREBASE_SERVICE_ACCOUNT not set. Firebase Auth will not work.');
            return null;
        }

        // Handle Base64 encoded JSON
        let serviceAccount: admin.ServiceAccount;
        if (serviceAccountVar.trim().startsWith('{')) {
            serviceAccount = JSON.parse(serviceAccountVar);
        } else {
            const buffer = Buffer.from(serviceAccountVar, 'base64');
            serviceAccount = JSON.parse(buffer.toString('utf-8'));
        }

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('🔥 Firebase Admin initialized');
        return firebaseApp;
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        return null; // Don't crash, just log. Setup might be incomplete.
    }
};

export const getFirebase = () => firebaseApp;
export const verifyIdToken = async (token: string) => {
    const app = initFirebase();
    if (!app) throw new Error('Firebase not initialized');
    return app.auth().verifyIdToken(token);
};
