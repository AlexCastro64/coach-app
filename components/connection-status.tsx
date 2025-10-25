import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HealthService, HealthCheckResult } from '@/services/health.service';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ConnectionStatusProps {
  autoCheck?: boolean; // Automatically check on mount
  compact?: boolean; // Compact display mode
  showTroubleshooting?: boolean; // Show troubleshooting steps
}

export function ConnectionStatus({
  autoCheck = false,
  compact = false,
  showTroubleshooting = true,
}: ConnectionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (autoCheck) {
      checkConnection();
    }
  }, [autoCheck]);

  const checkConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const healthResult = await HealthService.checkHealth();
      setResult(healthResult);
    } catch (error) {
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

  if (compact) {
    return (
      <ThemedView style={styles.compactContainer}>
        <TouchableOpacity
          style={[styles.compactButton, { borderColor: colors.tint }]}
          onPress={checkConnection}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : (
            <View style={styles.compactContent}>
              {result && (
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor() },
                  ]}
                />
              )}
              <ThemedText style={styles.compactText}>
                {result
                  ? result.status === 'success'
                    ? 'Connected'
                    : 'Disconnected'
                  : 'Check Connection'}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.tint },
          isLoading && styles.buttonDisabled,
        ]}
        onPress={checkConnection}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator color="#fff" style={styles.loader} />
            <ThemedText style={styles.buttonText}>Checking...</ThemedText>
          </View>
        ) : (
          <ThemedText style={styles.buttonText}>Check Backend Connection</ThemedText>
        )}
      </TouchableOpacity>

      {result && (
        <ThemedView style={styles.resultsContainer}>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <ThemedText style={styles.statusText}>
              {result.status === 'success' ? '✓ Connected' : '✗ Connection Failed'}
            </ThemedText>
          </View>

          <ThemedText style={styles.message}>{result.message}</ThemedText>

          {result.details.responseTime !== undefined && (
            <ThemedText style={styles.responseTime}>
              Response time: {result.details.responseTime}ms
            </ThemedText>
          )}

          {result.status === 'error' && result.details.errorType && (
            <ThemedView
              style={[
                styles.errorBox,
                { backgroundColor: colorScheme === 'dark' ? '#3a2020' : '#ffebee' },
              ]}
            >
              <ThemedText style={styles.errorType}>
                {result.details.errorType}
              </ThemedText>
              <ThemedText style={styles.errorDetails}>
                {result.details.errorDetails}
              </ThemedText>
            </ThemedView>
          )}

          {showTroubleshooting &&
            result.details.troubleshooting &&
            result.details.troubleshooting.length > 0 && (
              <ThemedView style={styles.troubleshooting}>
                <ThemedText type="defaultSemiBold" style={styles.troubleshootingTitle}>
                  Troubleshooting:
                </ThemedText>
                {result.details.troubleshooting.map((step, index) => (
                  <View key={index} style={styles.troubleshootingItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.troubleshootingText}>
                      {step}
                    </ThemedText>
                  </View>
                ))}
              </ThemedView>
            )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  compactContainer: {
    width: '100%',
  },
  compactButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 15,
    fontWeight: '600',
  },
  loader: {
    marginRight: 8,
  },
  resultsContainer: {
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  responseTime: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 12,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  errorType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorDetails: {
    fontSize: 13,
    opacity: 0.8,
  },
  troubleshooting: {
    marginTop: 12,
  },
  troubleshootingTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  troubleshootingItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    marginRight: 8,
    fontSize: 14,
  },
  troubleshootingText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
