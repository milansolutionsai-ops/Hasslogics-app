import AsyncStorage from '@react-native-async-storage/async-storage';
import { Domino, DAYS_OF_WEEK } from '@/types/domino';

const DOMINOS_KEY = '@dominos_data';
const ONBOARDING_KEY = '@onboarding_completed';

export class StorageService {
  static async getDominos(): Promise<Domino[]> {
    try {
      const data = await AsyncStorage.getItem(DOMINOS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultDominos();
    } catch (error) {
      console.error('Error loading dominos:', error);
      return this.getDefaultDominos();
    }
  }

  static async saveDominos(dominos: Domino[]): Promise<void> {
    try {
      await AsyncStorage.setItem(DOMINOS_KEY, JSON.stringify(dominos));
    } catch (error) {
      console.error('Error saving dominos:', error);
      throw error;
    }
  }

  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding:', error);
      throw error;
    }
  }

  static async getSetupCompleted(): Promise<boolean> {
    return this.isOnboardingCompleted();
  }

  static async setSetupCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting setup completed:', error);
      throw error;
    }
  }

  static createDefaultDominos(): Domino[] {
    return this.getDefaultDominos();
  }

  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([DOMINOS_KEY, ONBOARDING_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  static getDefaultDominos(): Domino[] {
    const emptyActivities = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = '';
      return acc;
    }, {} as Record<string, string>);

    return [
      { id: '1', title: 'Body', activities: emptyActivities, completionStatus: {} },
      { id: '2', title: 'Health', activities: emptyActivities, completionStatus: {} },
      { id: '3', title: 'Happiness', activities: emptyActivities, completionStatus: {} },
      { id: '4', title: 'Love', activities: emptyActivities, completionStatus: {} },
      { id: '5', title: 'Work', activities: emptyActivities, completionStatus: {} },
      { id: '6', title: 'Wealth', activities: emptyActivities, completionStatus: {} },
      { id: '7', title: 'Spirituality', activities: emptyActivities, completionStatus: {} },
      { id: '8', title: 'Soul', activities: emptyActivities, completionStatus: {} },
    ];
  }
}
