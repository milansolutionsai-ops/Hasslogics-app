import React, { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { StorageService } from '@/utils/storage';
import { Redirect } from 'expo-router';

export default function Index() {
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const completed = await StorageService.getSetupCompleted();
      setSetupCompleted(completed);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupCompleted(false);
    }
  };

  const handleSetupComplete = () => {
    setSetupCompleted(true);
  };

  if (setupCompleted === null) {
    return null; // Loading state
  }

  if (setupCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <OnboardingScreen onComplete={handleSetupComplete} />
  );
}