import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingPayment() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const { refreshUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);

    try {
      // TODO: Integrate with Stripe
      // For now, we'll simulate a successful payment
      // In production, this would:
      // 1. Create a Stripe Checkout Session
      // 2. Open the Stripe payment page
      // 3. Handle the callback after successful payment
      // 4. Update the user's onboarding status

      Alert.alert(
        'Stripe Integration Needed',
        'This will integrate with Stripe to process the payment. For now, we\'ll skip to the inbox.',
        [
          {
            text: 'Continue to App',
            onPress: async () => {
              // Refresh user data to get updated onboarding status
              // In production, the backend would mark onboarding_completed=true after payment
              await refreshUser();
              router.replace('/(tabs)/inbox');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
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
            The Gap Between Knowing and Doing
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            You know what to do. The missing piece is accountability.
          </ThemedText>
        </View>

        {/* Value Proposition */}
        <ThemedView style={styles.valueCard}>
          <ThemedText style={styles.valueTitle}>
            Here's what you get:
          </ThemedText>

          <ValueItem
            icon="💬"
            title="Daily Accountability Check-ins"
            description="Your coach messages you every single day to keep you on track"
          />
          <ValueItem
            icon="📸"
            title="Real-time Meal & Workout Analysis"
            description="Snap photos and get instant feedback on your nutrition and training"
          />
          <ValueItem
            icon="📊"
            title="Progress Tracking & Insights"
            description="See your consistency improve and celebrate your wins"
          />
          <ValueItem
            icon="🎯"
            title="Personalized Goal Planning"
            description="Your coach helps you create and stick to a realistic plan"
          />
          <ValueItem
            icon="🔒"
            title="Never Miss a Day"
            description="We check in on you, so you can't fall off track like before"
          />
        </ThemedView>

        {/* Pricing */}
        <ThemedView style={styles.pricingCard}>
          <ThemedText style={styles.pricingTitle}>Investment in Your Success</ThemedText>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceAmount}>$89</ThemedText>
            <ThemedText style={styles.pricePeriod}>/month</ThemedText>
          </View>
          <ThemedText style={styles.pricingSubtext}>
            Cancel anytime • No long-term commitment
          </ThemedText>

          <ThemedView style={styles.comparisonCard}>
            <ThemedText style={styles.comparisonTitle}>Compare:</ThemedText>
            <ComparisonItem item="Personal trainer" price="$200-400/month" />
            <ComparisonItem item="Nutritionist" price="$150-300/month" />
            <ComparisonItem item="Gym membership you don't use" price="$50-100/month" />
            <View style={styles.divider} />
            <ThemedText style={styles.comparisonTotal}>
              Total if separate: <ThemedText style={styles.comparisonTotalPrice}>$400-800/month</ThemedText>
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Social Proof */}
        <ThemedView style={styles.proofCard}>
          <ThemedText style={styles.proofStat}>95%</ThemedText>
          <ThemedText style={styles.proofText}>
            Success rate with accountability vs. 5% trying alone
          </ThemedText>
        </ThemedView>

        {/* Risk Reversal */}
        <View style={styles.guaranteeSection}>
          <ThemedText style={styles.guaranteeTitle}>
            30-Day Money-Back Guarantee
          </ThemedText>
          <ThemedText style={styles.guaranteeText}>
            If you're not satisfied within the first 30 days, we'll refund you completely. No questions asked.
          </ThemedText>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable
            style={[styles.ctaButton, isProcessing && styles.ctaButtonDisabled]}
            onPress={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.ctaButtonText}>
                Start Your Transformation
              </ThemedText>
            )}
          </Pressable>
          <ThemedText style={styles.ctaSubtext}>
            Join hundreds of successful members
          </ThemedText>

          <Pressable onPress={handleBack} style={styles.backButtonContainer}>
            <ThemedText style={styles.backButton}>
              Go Back
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

interface ValueItemProps {
  icon: string;
  title: string;
  description: string;
}

function ValueItem({ icon, title, description }: ValueItemProps) {
  return (
    <View style={styles.valueItem}>
      <ThemedText style={styles.valueIcon}>{icon}</ThemedText>
      <View style={styles.valueContent}>
        <ThemedText style={styles.valueItemTitle}>{title}</ThemedText>
        <ThemedText style={styles.valueItemDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

interface ComparisonItemProps {
  item: string;
  price: string;
}

function ComparisonItem({ item, price }: ComparisonItemProps) {
  return (
    <View style={styles.comparisonItem}>
      <ThemedText style={styles.comparisonItemText}>{item}</ThemedText>
      <ThemedText style={styles.comparisonItemPrice}>{price}</ThemedText>
    </View>
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
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 26,
  },
  valueCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 24,
  },
  valueTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  valueItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  valueIcon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 2,
  },
  valueContent: {
    flex: 1,
  },
  valueItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueItemDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  pricingCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 24,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pricePeriod: {
    fontSize: 24,
    opacity: 0.7,
    marginLeft: 4,
  },
  pricingSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  comparisonCard: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonItemText: {
    fontSize: 14,
    opacity: 0.7,
  },
  comparisonItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 12,
  },
  comparisonTotal: {
    fontSize: 15,
    fontWeight: '600',
  },
  comparisonTotalPrice: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  proofCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderWidth: 2,
    borderColor: '#34C759',
    marginBottom: 24,
    alignItems: 'center',
  },
  proofStat: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  proofText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  guaranteeSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  guaranteeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#34C759',
  },
  guaranteeText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 12,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  ctaSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  backButtonContainer: {
    marginTop: 8,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    opacity: 0.7,
  },
});
