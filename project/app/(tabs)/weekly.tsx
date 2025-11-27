import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';
import { DAY_NAMES } from '@/types/domino';

export default function WeeklyScreen() {
  const { dominos, loading, refreshDominos } = useDominos();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    return startOfWeek;
  });

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
    }, [])
  );

  const calculateWeeklyScore = () => {
    const weekKey = DateUtils.getWeekKeyForDate(new Date());
    return dominos.reduce((score, domino) => {
      const weekCompletion = domino.completionStatus[weekKey];
      if (!weekCompletion) return score;
      
      return score + Object.values(weekCompletion).filter(Boolean).length;
    }, 0);
  };

  const calculateDailyScore = (dayIndex: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const date = DateUtils.addDays(startOfWeek, dayIndex);
    const weekKey = DateUtils.getWeekKeyForDate(date);
    const dayOfWeek = DateUtils.getDayOfWeek(date);
    
    return dominos.reduce((score, domino) => {
      const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
      return score + (completed ? 1 : 0);
    }, 0);
  };

  const calculateTodayScore = () => {
    const today = new Date();
    const weekKey = DateUtils.getWeekKeyForDate(today);
    const dayOfWeek = DateUtils.getDayOfWeek(today);
    
    return dominos.reduce((score, domino) => {
      const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
      return score + (completed ? 1 : 0);
    }, 0);
  };

  const weeklyScore = calculateWeeklyScore();
  const todayScore = calculateTodayScore();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          {/* Loading placeholder */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weekly Overview</Text>
      </View>

      <ScoreDisplay
        dailyScore={todayScore}
        totalDaily={8}
        weeklyScore={weeklyScore}
        totalWeekly={56}
        showWeekly={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.weekGrid}>
          {DAY_NAMES.map((dayName, index) => {
            const dayScore = calculateDailyScore(index);
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1);
            const date = DateUtils.addDays(startOfWeek, index);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <View 
                key={dayName} 
                style={[
                  styles.dayCard,
                  isToday && styles.todayCard,
                ]}
              >
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {dayName}
                </Text>
                <Text style={styles.dayDate}>
                  {date.getDate()}
                </Text>
                <View style={styles.dayScore}>
                  <Text style={[styles.scoreText, isToday && styles.todayText]}>
                    {dayScore}/8
                  </Text>
                </View>
                <View style={styles.dotsGrid}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniDot,
                        i < dayScore && styles.completedDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.dominosList}>
          <Text style={styles.dominosTitle}>Your Dominos</Text>
          {dominos.map((domino, index) => (
            <View key={domino.id} style={styles.dominoRow}>
              <Text style={styles.dominoNumber}>{index + 1}</Text>
              <Text style={styles.dominoTitle}>{domino.title}</Text>
              <View style={styles.dominoProgress}>
                {DAY_NAMES.map((_, dayIndex) => {
                  const date = DateUtils.addDays(currentWeekStart, dayIndex);
                  const weekKey = DateUtils.getWeekKeyForDate(date);
                  const dayOfWeek = DateUtils.getDayOfWeek(date);
                  const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
                  
                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.progressDot,
                        completed && styles.progressDotCompleted,
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  dayCard: {
    width: '13%',
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  todayCard: {
    backgroundColor: '#fedd14',
    borderColor: '#000000',
    borderWidth: 1,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  todayText: {
    color: '#000000',
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  dayScore: {
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fffbea',
    margin: 1,
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  completedDot: {
    backgroundColor: '#000000',
  },
  dominosList: {
    paddingHorizontal: 16,
  },
  dominosTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  dominoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  dominoNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    backgroundColor: '#fedd14',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  dominoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  dominoProgress: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fffbea',
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  progressDotCompleted: {
    backgroundColor: '#fedd14',
  },
});