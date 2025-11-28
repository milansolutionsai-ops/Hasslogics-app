import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Save, RotateCcw, Settings, Calendar } from 'lucide-react-native';
import { Domino, DayOfWeek, DAYS_OF_WEEK, DAY_NAMES } from '@/types/domino';

interface DominoSetupFormProps {
  dominos: Domino[];
  onSave: (dominos: Domino[]) => void;
  onReset: () => void;
  onResetWeek?: () => void;
}

export function DominoSetupForm({ dominos, onSave, onReset, onResetWeek }: DominoSetupFormProps) {
  const [editedDominos, setEditedDominos] = useState<Domino[]>(dominos);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [hasChanges, setHasChanges] = useState(false);

  const updateDominoActivity = (dominoId: string, day: DayOfWeek, activity: string) => {
    const updated = editedDominos.map(domino => 
      domino.id === dominoId
        ? { ...domino, activities: { ...domino.activities, [day]: activity } }
        : domino
    );
    setEditedDominos(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editedDominos);
    setHasChanges(false);
    Alert.alert('Success', 'Your domino activities have been saved!');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Activities',
      'Are you sure you want to reset all domino activities? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            onReset();
            setHasChanges(false);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={20} color="#000000" />
          <Text style={styles.headerTitle}>Edit Your Dominos</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Save size={14} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dayTabs}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {DAYS_OF_WEEK.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                selectedDay === day && styles.activeDayTab,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayTabText,
                selectedDay === day && styles.activeDayTabText,
              ]}>
                {DAY_NAMES[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {editedDominos.map((domino, index) => (
          <View key={domino.id} style={styles.dominoForm}>
            <View style={styles.dominoHeader}>
              <View style={styles.dominoNumber}>
                <Text style={styles.dominoNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.dominoTitle}>{domino.title}</Text>
            </View>
            
            <TextInput
              style={styles.activityInput}
              placeholder={`Enter ${domino.title.toLowerCase()} activity for ${DAY_NAMES[DAYS_OF_WEEK.indexOf(selectedDay)]}`}
              value={domino.activities[selectedDay]}
              onChangeText={(text) => updateDominoActivity(domino.id, selectedDay, text)}
              multiline
              numberOfLines={2}
              placeholderTextColor="#999"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fedd14',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbea',
    borderRadius: 6,
    padding: 8,
    width: 32,
    height: 32,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#000000',
  },
  saveButton: {
    backgroundColor: '#fedd14',
  },
  saveButtonDisabled: {
    backgroundColor: '#fffbea',
    opacity: 0.5,
  },
  dayTabs: {
    backgroundColor: '#fffbea',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#fffbea',
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  activeDayTab: {
    backgroundColor: '#fedd14',
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  activeDayTabText: {
    color: '#000000',
  },
  formContainer: {
    flex: 1,
    paddingTop: 4,
  },
  dominoForm: {
    backgroundColor: '#fffbea',
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dominoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dominoNumber: {
    backgroundColor: '#fedd14',
    borderRadius: 12,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dominoNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  dominoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  activityInput: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#fffbea',
    minHeight: 32,
    textAlignVertical: 'top',
  },
});