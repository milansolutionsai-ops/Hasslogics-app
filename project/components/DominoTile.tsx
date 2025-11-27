import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

export function DominoTile({ title, activity, completed, onToggle, index }: DominoTileProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (completed) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [completed]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });
  const dominoDots = Array.from({ length: 8 }, (_, i) => (
    <View
      key={i}
      style={[
        styles.dot,
        { backgroundColor: '#000000' },
      ]}
    />
  ));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tile,
          { backgroundColor: completed ? '#fedd14' : '#fffbea' },
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: completed ? '#000000' : '#000000' }]}>
            {title}
          </Text>
          {completed && (
            <View style={styles.checkIcon}>
              <Check size={20} color="#000000" strokeWidth={3} />
            </View>
          )}
        </View>
        
        <View style={styles.dotsContainer}>
          {dominoDots}
        </View>
        
        <Text style={[styles.activity, { color: completed ? '#000000' : '#666666' }]} numberOfLines={2}>
          {activity || 'No activity set'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tile: {
    backgroundColor: '#fffbea',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000000',
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  checkIcon: {
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    margin: 1.5,
  },
  activity: {
    fontSize: 18,
    lineHeight: 20,
    color: '#000000',
  },
});