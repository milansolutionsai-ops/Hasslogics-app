import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { DominoSetupForm } from './DominoSetupForm';
import { Domino } from '@/types/domino';
import { StorageService } from '@/utils/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dominos, setDominos] = useState<Domino[]>(StorageService.createDefaultDominos());

  const steps = [
    {
      title: 'Welcome to 8 Dominos',
      subtitle: 'Track 8 key habits every day',
      content: (
        <View style={styles.welcomeContent}>
          <View style={styles.dominoVisual}>
            {Array.from({ length: 8 }, (_, i) => (
              <View key={i} style={[styles.miniDomino, { opacity: 1 - (i * 0.1) }]}>
                <View style={styles.miniDot} />
                <View style={styles.miniDot} />
              </View>
            ))}
          </View>
          <Text style={styles.welcomeDescription}>
            Build momentum in 8 key areas of life: Body, Health, Happiness, Love, Work, Wealth, Spirituality, and Soul.
          </Text>
          <Text style={styles.welcomeSubtext}>
            Complete each domino daily to create a powerful chain reaction of positive habits.
          </Text>
        </View>
      ),
    },
    {
      title: 'Set Up Your Dominos',
      subtitle: 'Define activities for each day of the week',
      content: (
        <DominoSetupForm
          dominos={dominos}
          onSave={setDominos}
          onReset={() => setDominos(StorageService.createDefaultDominos())}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await StorageService.saveDominos(dominos);
      await StorageService.setSetupCompleted(true);
      onComplete();
    } catch (error) {
      console.error('Error completing setup:', error);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
      </View>

      <View style={styles.content}>
        {currentStepData.content}
      </View>

      <View style={styles.footer}>
        {currentStep === 0 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Get Started</Text>
            <ArrowRight size={20} color="#030001" />
          </TouchableOpacity>
        )}
        
        {isLastStep && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbea',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fedd14',
  },
  stepIndicator: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dominoVisual: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  miniDomino: {
    backgroundColor: '#fedd14',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#000000',
    transform: [{ rotate: '15deg' }],
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
    marginBottom: 2,
  },
  welcomeDescription: {
    fontSize: 18,
    lineHeight: 26,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  welcomeSubtext: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fffbea',
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fedd14',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  completeButton: {
    backgroundColor: '#fedd14',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});