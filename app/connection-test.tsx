import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HealthService, HealthCheckResult } from '@/services/health.service';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ConnectionTestScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const runHealthCheck = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const healthResult = await HealthService.checkHealth();
      setResult(healthResult);
    } catch (error) {
      // This shouldn't happen as the service handles all errors
      setResult({
        status: 'error',
        message: 'Unexpected error occurred',
        details: {
          apiUrl: HealthService.getApiUrl(),
          errorType: 'Unexpected Error',
          errorDetails: String(error),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!result) return colors.text;
    return result.status === 'success' ? '#4CAF50' : '#F44336';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Backend Connection Test
        </ThemedText>

        <ThemedText style={styles.description}>
          Test your connection to the backend API and get troubleshooting help if needed.
        </ThemedText>

        {/* API URL Display */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Current API URL:
          </ThemedText>
          <ThemedView style={[styles.codeBlock, { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' }]}>
            <ThemedText style={[styles.codeText, { fontFamily: Fonts.mono }]}>
              {HealthService.getApiUrl()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Test Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.tint },
            isLoading && styles.buttonDisabled,
          ]}
          onPress={runHealthCheck}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#fff" style={styles.loader} />
              <ThemedText style={styles.buttonText}>Testing Connection...</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.buttonText}>Test Connection</ThemedText>
          )}
        </TouchableOpacity>

        {/* Results Section */}
        {result && (
          <ThemedView style={styles.resultsContainer}>
            <ThemedView style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() }
            ]}>
              <ThemedText style={styles.statusText}>
                {result.status === 'success' ? '✓ SUCCESS' : '✗ ERROR'}
              </ThemedText>
            </ThemedView>

            <ThemedText style={styles.resultMessage}>
              {result.message}
            </ThemedText>

            {/* Response Time */}
            {result.details.responseTime !== undefined && (
              <ThemedText style={styles.detailText}>
                Response time: {result.details.responseTime}ms
              </ThemedText>
            )}

            {/* Error Details */}
            {result.status === 'error' && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Error Details:
                </ThemedText>
                <ThemedView style={[styles.errorBlock, { backgroundColor: colorScheme === 'dark' ? '#3a2020' : '#ffebee' }]}>
                  <ThemedText style={styles.errorType}>
                    {result.details.errorType}
                  </ThemedText>
                  <ThemedText style={styles.errorDetails}>
                    {result.details.errorDetails}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}

            {/* Troubleshooting Steps */}
            {result.details.troubleshooting && result.details.troubleshooting.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Troubleshooting Steps:
                </ThemedText>
                {result.details.troubleshooting.map((step, index) => (
                  <ThemedView key={index} style={styles.troubleshootingItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.troubleshootingText}>
                      {step}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            )}
          </ThemedView>
        )}

        {/* Configuration Help */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Configuration Help:
          </ThemedText>
          {HealthService.getConfigurationHelp().map((line, index) => (
            <ThemedText
              key={index}
              style={[
                styles.helpText,
                line.startsWith(' ') && { fontFamily: Fonts.mono, fontSize: 12 },
              ]}
            >
              {line}
            </ThemedText>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 14,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginRight: 8,
  },
  resultsContainer: {
    marginTop: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  detailText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  errorBlock: {
    padding: 16,
    borderRadius: 8,
  },
  errorType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    opacity: 0.8,
  },
  troubleshootingItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
  },
  troubleshootingText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
