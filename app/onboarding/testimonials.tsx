import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function OnboardingTestimonials() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const handleContinue = () => {
    router.push('/onboarding/questions');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Real Results from Real People
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            See how accountability transformed their lives
          </ThemedText>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <TestimonialCard
            name="Sarah M."
            result="Lost 35 lbs in 4 months"
            quote="I tried every diet and app out there. Nothing worked until I had my Coach checking in on me daily. The accountability changed everything."
            rating={5}
          />
          <TestimonialCard
            name="James R."
            result="Completed first marathon"
            quote="I kept saying 'someday I'll run a marathon.' My Coach kept me on track with my training plan. Crossed the finish line after just 6 months!"
            rating={5}
          />
          <TestimonialCard
            name="Lisa T."
            result="Gained 15 lbs muscle"
            quote="As a busy mom, I always put myself last. Having my Coach check in daily made me prioritize my health. Best decision ever."
            rating={5}
          />
          <TestimonialCard
            name="Michael P."
            result="Down 50+ lbs, off medication"
            quote="My doctor was amazed. In 8 months, I lost the weight and my blood pressure normalized. All because someone was actually holding me accountable."
            rating={5}
          />
        </View>

        {/* Common Thread */}
        <ThemedView style={styles.insightCard}>
          <ThemedText style={styles.insightTitle}>Notice a pattern?</ThemedText>
          <ThemedText style={styles.insightText}>
            They all tried before. They all knew what to do. But they only succeeded when they had consistent accountability.
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
          <Pressable onPress={handleBack}>
            <ThemedText style={styles.backButton}>Go Back</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

interface TestimonialCardProps {
  name: string;
  result: string;
  quote: string;
  rating: number;
}

function TestimonialCard({ name, result, quote, rating }: TestimonialCardProps) {
  return (
    <ThemedView style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View>
          <ThemedText style={styles.testimonialName}>{name}</ThemedText>
          <ThemedText style={styles.testimonialResult}>{result}</ThemedText>
        </View>
        <View style={styles.starsContainer}>
          {[...Array(rating)].map((_, i) => (
            <ThemedText key={i} style={styles.star}>⭐</ThemedText>
          ))}
        </View>
      </View>
      <ThemedText style={styles.testimonialQuote}>"{quote}"</ThemedText>
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
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  testimonialsSection: {
    marginBottom: 32,
  },
  testimonialCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  testimonialResult: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
  },
  testimonialQuote: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
    fontStyle: 'italic',
  },
  insightCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
    marginBottom: 32,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF9500',
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
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    opacity: 0.7,
  },
});
