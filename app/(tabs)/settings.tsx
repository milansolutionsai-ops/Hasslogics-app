import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RotateCcw, Info, Calendar } from 'lucide-react-native';
import { DominoSetupForm } from '@/components/DominoSetupForm';
import { useDominos } from '@/hooks/useDominos';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';

export default function SettingsScreen() {
  const { dominos, loading, updateDominos, refreshDominos } = useDominos();

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
    }, [])
  );

  const handleSave = async (newDominos: any[]) => {
    await updateDominos(newDominos);
  };

  const handleReset = async () => {
    const defaultDominos = StorageService.createDefaultDominos();
    await updateDominos(defaultDominos);
  };

  const handleResetWeek = () => {
    Alert.alert(
      'Reset This Week',
      'This will clear all completion data for the current week. Activities will remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Week',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentWeekKey = DateUtils.getCurrentWeekKey();
              const updatedDominos = dominos.map(domino => ({
                ...domino,
                completionStatus: {
                  ...domino.completionStatus,
                  [currentWeekKey]: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                  }
                }
              }));
              await updateDominos(updatedDominos);
              Alert.alert('Week Reset', 'This week\'s progress has been cleared.');
            } catch (error) {
              console.error('Error resetting week:', error);
              Alert.alert('Error', 'Failed to reset week data.');
            }
          },
        },
      ]
    );
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress and activities. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.setSetupCompleted(false);
              const defaultDominos = StorageService.createDefaultDominos();
              await updateDominos(defaultDominos);
              Alert.alert('Reset Complete', 'All data has been reset.');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DominoSetupForm
        dominos={dominos}
        onSave={handleSave}
        onReset={handleReset}
        onResetWeek={handleResetWeek}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbea',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});