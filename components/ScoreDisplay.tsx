import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  dailyScore: number;
  totalDaily: number;
  weeklyScore: number;
  totalWeekly: number;
  showWeekly?: boolean;
}

export function ScoreDisplay({ 
  dailyScore, 
  totalDaily, 
  weeklyScore, 
  totalWeekly, 
  showWeekly = false 
}: ScoreDisplayProps) {
  const dailyPercentage = (dailyScore / totalDaily) * 100;
  const weeklyPercentage = showWeekly ? (weeklyScore / totalWeekly) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Today</Text>
        <Text style={styles.scoreValue}>
          {dailyScore}/{totalDaily}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${dailyPercentage}%` },
            ]} 
          />
        </View>
      </View>
      
      {showWeekly && (
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>This Week</Text>
          <Text style={styles.scoreValue}>
            {weeklyScore}/{totalWeekly}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${weeklyPercentage}%` },
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fedd14',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  scoreItem: {
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#fffbea',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000000',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 3,
  },
});