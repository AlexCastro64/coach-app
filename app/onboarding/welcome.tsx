import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function OnboardingWelcome() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const handleContinue = () => {
    router.push('/onboarding/testimonials');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <ThemedText style={styles.emoji}>🎯</ThemedText>
          <ThemedText type="title" style={styles.title}>
            The Secret to Success
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Research shows that accountability is the #1 predictor of goal achievement
          </ThemedText>
        </View>

        {/* Main Stat */}
        <ThemedView style={styles.mainStatCard}>
          <ThemedText style={styles.statNumber}>95%</ThemedText>
          <ThemedText style={styles.statLabel}>
            People who have regular accountability appointments achieve their goals
          </ThemedText>
          <ThemedText style={styles.statSource}>
            vs. only 5% who try alone
          </ThemedText>
        </ThemedView>

        {/* Additional Stats */}
        <View style={styles.additionalStats}>
          <StatItem
            number="76%"
            label="Success rate when sharing weekly progress with an accountability partner"
          />
          <StatItem
            number="65%"
            label="Success rate just from publicly committing your goals"
          />
          <StatItem
            number="43%"
            label="Success rate when trying alone without accountability"
          />
        </View>

        {/* Key Insight */}
        <ThemedView style={styles.insightCard}>
          <ThemedText style={styles.insightTitle}>The Truth?</ThemedText>
          <ThemedText style={styles.insightText}>
            It's not about motivation. It's not about willpower. It's about having someone who checks in on you, tracks your progress, and keeps you accountable.
          </ThemedText>
        </ThemedView>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable
            style={styles.ctaButton}
            onPress={handleContinue}
          >
            <ThemedText style={styles.ctaButtonText}>
              Continue
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.ctaSubtext}>
            See what others have achieved
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

interface StatItemProps {
  number: string;
  label: string;
}

function StatItem({ number, label }: StatItemProps) {
  return (
    <ThemedView style={styles.statItem}>
      <ThemedText style={styles.statItemNumber}>{number}</ThemedText>
      <ThemedText style={styles.statItemLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  mainStatCard: {
    padding: 40,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#34C759',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
  },
  statNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 26,
  },
  statSource: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  additionalStats: {
    marginBottom: 32,
  },
  statItem: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  statItemNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  statItemLabel: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  insightCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    marginBottom: 40,
  },
  insightTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  ctaSubtext: {
    marginTop: 16,
    fontSize: 14,
    opacity: 0.6,
  },
});
