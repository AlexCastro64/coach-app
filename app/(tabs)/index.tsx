import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/user.service';
import { UserSettings } from '@/types/settings';
import { Subscription, SubscriptionPlan } from '@/types/subscription';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // User profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [timezone, setTimezone] = useState(user?.timezone || '');
  const [country, setCountry] = useState(user?.country || '');

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    dark_mode: 'auto',
    language: 'en',
  });

  // Subscription state
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showPlans, setShowPlans] = useState(false);

  // Theme colors
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTimezone(user.timezone);
      setCountry(user.country);
    }
  }, [user]);

  useEffect(() => {
    loadSettings();
    loadSubscription();
    loadPlans();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await UserService.getSettings();
      setSettings(userSettings);
    } catch (error: any) {
      // Use default settings if API call fails
      console.log('Using default settings:', error.message);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const userSubscription = await UserService.getSubscription();
      setSubscription(userSubscription);
    } catch (error: any) {
      // User might not have a subscription yet
      console.log('No subscription found:', error.message);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const loadPlans = async () => {
    try {
      const availablePlans = await UserService.getSubscriptionPlans();
      setPlans(availablePlans);
    } catch (error: any) {
      console.log('Failed to load plans:', error.message);
      // Set default plans for demonstration
      setPlans([
        {
          tier: 'free',
          name: 'Free',
          price: 0,
          billing_period: 'monthly',
          features: ['Basic coaching', 'Limited messages', 'Community access'],
        },
        {
          tier: 'basic',
          name: 'Basic',
          price: 29,
          billing_period: 'monthly',
          features: ['Personal coach', 'Unlimited messages', 'Meal tracking', 'Workout plans'],
        },
        {
          tier: 'premium',
          name: 'Premium',
          price: 79,
          billing_period: 'monthly',
          features: [
            'Dedicated coach',
            'Priority support',
            'Advanced analytics',
            'Custom meal plans',
            'Video consultations',
          ],
          isPopular: true,
        },
      ]);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await UserService.updateProfile({
        name,
        email,
        timezone,
        country,
      });
      await refreshUser();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setTimezone(user?.timezone || '');
    setCountry(user?.country || '');
    setIsEditing(false);
  };

  const handleUpdateSettings = async (key: keyof UserSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await UserService.updateSettings({ [key]: value });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update settings');
      // Revert on error
      setSettings(settings);
    }
  };

  const handleSubscriptionChange = async (tier: string) => {
    Alert.alert(
      'Confirm Subscription Change',
      `Are you sure you want to switch to the ${tier} plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const updatedSubscription = await UserService.updateSubscription(tier);
              setSubscription(updatedSubscription);
              setShowPlans(false);
              Alert.alert('Success', 'Subscription updated successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update subscription');
            }
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.cancelSubscription();
              await loadSubscription();
              Alert.alert('Success', 'Subscription cancelled successfully.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel subscription');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      {/* User Information Section */}
      <ThemedView style={[styles.section, { borderBottomColor: borderColor }]}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Personal Information</ThemedText>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <ThemedText style={{ color: tintColor }}>Edit</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Name</ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={borderColor}
            />
          ) : (
            <ThemedText style={styles.value}>{user?.name}</ThemedText>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={borderColor}
            />
          ) : (
            <ThemedText style={styles.value}>{user?.email}</ThemedText>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Role</ThemedText>
          <ThemedText style={styles.value}>{user?.role}</ThemedText>
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Timezone</ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={timezone}
              onChangeText={setTimezone}
              placeholder="e.g., America/New_York"
              placeholderTextColor={borderColor}
            />
          ) : (
            <ThemedText style={styles.value}>{user?.timezone || 'Not set'}</ThemedText>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Country</ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={country}
              onChangeText={setCountry}
              placeholder="Enter your country"
              placeholderTextColor={borderColor}
            />
          ) : (
            <ThemedText style={styles.value}>{user?.country || 'Not set'}</ThemedText>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Member Since</ThemedText>
          <ThemedText style={styles.value}>
            {user?.created_at ? formatDate(user.created_at) : 'N/A'}
          </ThemedText>
        </View>

        {isEditing && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleCancelEdit}
              style={[styles.button, styles.cancelButton]}
              disabled={isSaving}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveProfile}
              style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>

      {/* Settings Section */}
      <ThemedView style={[styles.section, { borderBottomColor: borderColor }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>

        {isLoadingSettings ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Email Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive updates via email
                </ThemedText>
              </View>
              <Switch
                value={settings.email_notifications}
                onValueChange={(value) => handleUpdateSettings('email_notifications', value)}
                trackColor={{ false: borderColor, true: tintColor }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Push Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive push notifications
                </ThemedText>
              </View>
              <Switch
                value={settings.push_notifications}
                onValueChange={(value) => handleUpdateSettings('push_notifications', value)}
                trackColor={{ false: borderColor, true: tintColor }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>All Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Enable or disable all notifications
                </ThemedText>
              </View>
              <Switch
                value={settings.notifications_enabled}
                onValueChange={(value) => handleUpdateSettings('notifications_enabled', value)}
                trackColor={{ false: borderColor, true: tintColor }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}
      </ThemedView>

      {/* Subscription Section */}
      <ThemedView style={[styles.section, { borderBottomColor: borderColor }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Subscription
        </ThemedText>

        {isLoadingSubscription ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <>
            {subscription ? (
              <View style={styles.subscriptionInfo}>
                <View style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Current Plan</ThemedText>
                  <ThemedText style={[styles.value, { color: tintColor, fontWeight: '600' }]}>
                    {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                  </ThemedText>
                </View>

                <View style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Status</ThemedText>
                  <ThemedText
                    style={[
                      styles.value,
                      {
                        color:
                          subscription.status === 'active'
                            ? '#10B981'
                            : subscription.status === 'cancelled'
                              ? '#EF4444'
                              : '#F59E0B',
                      },
                    ]}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </ThemedText>
                </View>

                <View style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Billing Period</ThemedText>
                  <ThemedText style={styles.value}>
                    {formatDate(subscription.current_period_start)} -{' '}
                    {formatDate(subscription.current_period_end)}
                  </ThemedText>
                </View>

                {subscription.cancel_at_period_end && (
                  <View style={styles.warningBox}>
                    <ThemedText style={styles.warningText}>
                      Your subscription will be cancelled at the end of the current billing period.
                    </ThemedText>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setShowPlans(!showPlans)}
                  style={[styles.button, styles.changeButton, { borderColor: tintColor }]}>
                  <ThemedText style={[styles.changeButtonText, { color: tintColor }]}>
                    {showPlans ? 'Hide Plans' : 'Change Plan'}
                  </ThemedText>
                </TouchableOpacity>

                {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                  <TouchableOpacity
                    onPress={handleCancelSubscription}
                    style={[styles.button, styles.cancelSubscriptionButton]}>
                    <ThemedText style={styles.cancelSubscriptionButtonText}>
                      Cancel Subscription
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                <ThemedText style={styles.noSubscriptionText}>
                  You don't have an active subscription yet.
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setShowPlans(!showPlans)}
                  style={[styles.button, styles.subscribeButton, { backgroundColor: tintColor }]}>
                  <ThemedText style={styles.subscribeButtonText}>View Plans</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Subscription Plans */}
            {showPlans && (
              <View style={styles.plansContainer}>
                <ThemedText style={styles.plansTitle}>Available Plans</ThemedText>
                {plans.map((plan) => (
                  <View
                    key={plan.tier}
                    style={[
                      styles.planCard,
                      { borderColor: plan.isPopular ? tintColor : borderColor },
                      plan.isPopular && { borderWidth: 2 },
                    ]}>
                    {plan.isPopular && (
                      <View style={[styles.popularBadge, { backgroundColor: tintColor }]}>
                        <ThemedText style={styles.popularBadgeText}>Most Popular</ThemedText>
                      </View>
                    )}
                    <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                    <View style={styles.planPricing}>
                      <ThemedText style={styles.planPrice}>${plan.price}</ThemedText>
                      <ThemedText style={styles.planPeriod}>/{plan.billing_period}</ThemedText>
                    </View>
                    <View style={styles.planFeatures}>
                      {plan.features.map((feature, index) => (
                        <ThemedText key={index} style={styles.planFeature}>
                          • {feature}
                        </ThemedText>
                      ))}
                    </View>
                    {subscription?.tier !== plan.tier && (
                      <TouchableOpacity
                        onPress={() => handleSubscriptionChange(plan.tier)}
                        style={[
                          styles.button,
                          styles.selectPlanButton,
                          plan.isPopular && { backgroundColor: tintColor },
                          !plan.isPopular && { borderColor: tintColor, borderWidth: 1 },
                        ]}>
                        <ThemedText
                          style={[
                            styles.selectPlanButtonText,
                            plan.isPopular && { color: '#fff' },
                            !plan.isPopular && { color: tintColor },
                          ]}>
                          Select Plan
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                    {subscription?.tier === plan.tier && (
                      <View style={styles.currentPlanBadge}>
                        <ThemedText style={styles.currentPlanText}>Current Plan</ThemedText>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ThemedView>

      {/* Logout Button */}
      <ThemedView style={styles.section}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  saveButton: {
    minHeight: 50,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  loader: {
    marginVertical: 20,
  },
  subscriptionInfo: {
    marginTop: 8,
  },
  changeButton: {
    marginTop: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  changeButtonText: {
    fontWeight: '600',
  },
  cancelSubscriptionButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelSubscriptionButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  noSubscriptionText: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  subscribeButton: {
    marginTop: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
  },
  plansContainer: {
    marginTop: 24,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 16,
    opacity: 0.6,
  },
  planFeatures: {
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  selectPlanButton: {
    marginTop: 8,
  },
  selectPlanButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  currentPlanBadge: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  currentPlanText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
