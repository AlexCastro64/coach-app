import { StyleSheet, View, Image, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.mainTitle}>
            Welcome to Coach
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Your personal AI-powered nutrition and fitness coach
          </ThemedText>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <FeatureCard
            icon="🍽️"
            title="Meal Analysis"
            description="Take a photo of your meal and get instant nutritional breakdown with calories, protein, carbs, and fat."
          />
          <FeatureCard
            icon="💪"
            title="Workout Tracking"
            description="Log your workouts and receive AI-powered feedback to optimize your fitness routine."
          />
          <FeatureCard
            icon="💬"
            title="24/7 Coach Support"
            description="Chat with your AI coach anytime for personalized advice and guidance on your health journey."
          />
          <FeatureCard
            icon="📊"
            title="Progress Insights"
            description="Track your progress over time with detailed analytics and personalized recommendations."
          />
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Link href="/(tabs)" asChild>
            <Pressable
              style={[styles.ctaButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.ctaButtonText}>
                Get Started
              </ThemedText>
            </Pressable>
          </Link>
          <ThemedText style={styles.ctaSubtext}>
            Start your health journey today
          </ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            No credit card required • Free to start
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <ThemedView style={styles.featureCard}>
      <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.featureDescription}>{description}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 26,
  },
  featuresSection: {
    marginBottom: 48,
    gap: 20,
  },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaSubtext: {
    marginTop: 16,
    fontSize: 14,
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  footerText: {
    fontSize: 13,
    opacity: 0.5,
  },
});
