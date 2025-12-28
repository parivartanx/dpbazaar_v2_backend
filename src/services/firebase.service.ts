import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

export class FirebaseService {
  private static instance: FirebaseService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
      
      if (!firebaseConfig.project_id) {
        throw new Error('Firebase configuration is missing project_id');
      }

      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });

      this.initialized = true;
      logger.info('Firebase Admin SDK initialized successfully');
    } catch (error) {
      logger.error(`Firebase initialization error: ${error}`);
      throw new Error('Failed to initialize Firebase Admin SDK');
    }
  }

  public getAuth(): admin.auth.Auth {
    if (!this.initialized) {
      throw new Error('Firebase service not initialized. Call initialize() first.');
    }
    return admin.auth();
  }

  public async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    await this.initialize();
    return this.getAuth().verifyIdToken(idToken);
  }

  public async getUser(uid: string): Promise<admin.auth.UserRecord> {
    await this.initialize();
    return this.getAuth().getUser(uid);
  }

  public async createUser(properties: admin.auth.CreateRequest): Promise<admin.auth.UserRecord> {
    await this.initialize();
    return this.getAuth().createUser(properties);
  }

  public async updateUser(uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
    await this.initialize();
    return this.getAuth().updateUser(uid, properties);
  }

  public async deleteUser(uid: string): Promise<void> {
    await this.initialize();
    await this.getAuth().deleteUser(uid);
  }

  public async setCustomUserClaims(uid: string, customClaims: {[key: string]: any}): Promise<void> {
    await this.initialize();
    await this.getAuth().setCustomUserClaims(uid, customClaims);
  }
}