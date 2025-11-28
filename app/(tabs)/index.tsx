import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DominoTile } from '@/components/DominoTile';
import { DayNavigator } from '@/components/DayNavigator';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';

export default function DailyScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { dominos, loading, toggleCompletion, refreshDominos } = useDominos();

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
    }, [])
  );

  const getCurrentDayActivity = (domino: any) => {
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    return domino.activities[dayOfWeek] || '';
  };

  const getDominoCompletion = (domino: any) => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    return domino.completionStatus[weekKey]?.[dayOfWeek] || false;
  };

  const handleToggleCompletion = async (dominoId: string) => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    const domino = dominos.find(d => d.id === dominoId);
    const currentStatus = getDominoCompletion(domino);
    
    await toggleCompletion(dominoId, weekKey, dayOfWeek, !currentStatus);
  };

  const calculateDailyScore = () => {
    return dominos.reduce((score, domino) => {
      return score + (getDominoCompletion(domino) ? 1 : 0);
    }, 0);
  };

  const calculateWeeklyScore = () => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    return dominos.reduce((score, domino) => {
      const weekCompletion = domino.completionStatus[weekKey];
      if (!weekCompletion) return score;
      
      return score + Object.values(weekCompletion).filter(Boolean).length;
    }, 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          {/* Loading placeholder */}
        </View>
      </SafeAreaView>
    );
  }

  const dailyScore = calculateDailyScore();
  const weeklyScore = calculateWeeklyScore();

  return (
    <SafeAreaView style={styles.container}>
      <DayNavigator 
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
      
      <ScoreDisplay
        dailyScore={dailyScore}
        totalDaily={8}
        weeklyScore={weeklyScore}
        totalWeekly={56}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dominos.map((domino, index) => (
          <DominoTile
            key={domino.id}
            title={domino.title}
            activity={getCurrentDayActivity(domino)}
            completed={getDominoCompletion(domino)}
            onToggle={() => handleToggleCompletion(domino.id)}
            index={index}
          />
        ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});