import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';

interface DayNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function DayNavigator({ currentDate, onDateChange }: DayNavigatorProps) {
  const goToPreviousDay = () => {
    onDateChange(DateUtils.addDays(currentDate, -1));
  };

  const goToNextDay = () => {
    onDateChange(DateUtils.addDays(currentDate, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navButton} onPress={goToPreviousDay}>
        <ChevronLeft size={24} color="#000000" />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {DateUtils.formatDate(currentDate)}
        </Text>
        {isToday(currentDate) && (
          <Text style={styles.todayLabel}>Today</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.navButton} onPress={goToNextDay}>
        <ChevronRight size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fffbea',
  },
  navButton: {
    backgroundColor: '#fedd14',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  todayLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    backgroundColor: '#fedd14',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
});