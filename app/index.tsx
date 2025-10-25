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

  // Flatten styles to prevent nested arrays
  const scrollViewStyle = StyleSheet.flatten([styles.container, { backgroundColor }]);
  // Use a consistent blue color for the button that works in both light and dark modes
  const ctaButtonStyle = StyleSheet.flatten([styles.ctaButton, { backgroundColor: '#007AFF' }]);

  return (
    <ScrollView style={scrollViewStyle}>
      <ThemedView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.mainTitle}>
            Why do 95% of people fail to reach their goals?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            They try to do it alone.
          </ThemedText>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>95%</ThemedText>
            <ThemedText style={styles.statLabel}>
              Success rate with regular accountability check-ins
            </ThemedText>
            <ThemedText style={styles.statSource}>
              Source: American Society of Training & Development
            </ThemedText>
          </ThemedView>
        </View>

        {/* Problem Section */}
        <View style={styles.problemSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Sound familiar?
          </ThemedText>
          <ProblemItem
            text="You set ambitious goals but lose motivation after a few weeks"
          />
          <ProblemItem
            text="You've tried fitness apps, but no one holds you accountable"
          />
          <ProblemItem
            text="You know what to do, but struggle to stay consistent"
          />
        </View>

        {/* Solution Section */}
        <View style={styles.solutionSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Meet your accountability partner
          </ThemedText>
          <ThemedText style={styles.solutionDescription}>
            Coach is more than just an app. It's your personal accountability partner that checks in on you daily, tracks your progress, and keeps you on track to achieve your goals.
          </ThemedText>

          <FeatureCard
            icon="💬"
            title="Daily Check-ins"
            description="Your coach messages you every day to ensure you're staying on track with your nutrition and fitness goals."
          />
          <FeatureCard
            icon="📸"
            title="Real-time Feedback"
            description="Snap a photo of your meal or workout and get instant analysis and guidance."
          />
          <FeatureCard
            icon="📊"
            title="Progress Tracking"
            description="See your consistency improve as your coach helps you build lasting habits."
          />
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <ThemedText style={styles.ctaHeadline}>
            Ready to join the 95%?
          </ThemedText>
          <Link href="/register" asChild>
            <Pressable
              style={ctaButtonStyle}
            >
              <ThemedText style={styles.ctaButtonText}>
                Create Your Account
              </ThemedText>
            </Pressable>
          </Link>
          <ThemedText style={styles.ctaSubtext}>
            Start your journey to lasting change
          </ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Link href="/login" asChild>
            <Pressable>
              <ThemedText style={styles.footerText}>
                Already have an account? <ThemedText style={styles.footerLink}>Sign in</ThemedText>
              </ThemedText>
            </Pressable>
          </Link>
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

interface ProblemItemProps {
  text: string;
}

function ProblemItem({ text }: ProblemItemProps) {
  return (
    <View style={styles.problemItem}>
      <ThemedText style={styles.problemBullet}>✗</ThemedText>
      <ThemedText style={styles.problemText}>{text}</ThemedText>
    </View>
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
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 32,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  statCard: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  statNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
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
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  problemSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  problemItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 8,
  },
  problemBullet: {
    fontSize: 20,
    color: '#FF3B30',
    marginRight: 12,
    marginTop: 2,
  },
  problemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  solutionSection: {
    marginBottom: 40,
  },
  solutionDescription: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 24,
  },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  ctaHeadline: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  ctaButton: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 250,
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
    fontSize: 15,
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
