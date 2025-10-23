import { StyleSheet, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Message, MealAnalysis } from '@/types/message';

interface MessageBubbleProps {
  message: Message;
  onImagePress?: (url: string) => void;
}

export function MessageBubble({ message, onImagePress }: MessageBubbleProps) {
  const isUser = message.sender_type === 'user';
  const isSystem = message.sender_type === 'system';

  const userBubbleColor = useThemeColor({}, 'tint');
  const coachBubbleColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  const systemBubbleColor = useThemeColor({ light: '#fff3cd', dark: '#3a3020' }, 'background');

  const getBubbleColor = () => {
    if (isSystem) return systemBubbleColor;
    if (isUser) return userBubbleColor;
    return coachBubbleColor;
  };

  const getTextColor = () => {
    if (isUser) return '#fff';
    return useThemeColor({}, 'text');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderMealAnalysis = (analysis: MealAnalysis) => (
    <View style={styles.analysisContainer}>
      <ThemedText style={[styles.analysisTitle, { color: getTextColor() }]}>
        Meal Analysis
      </ThemedText>
      <ThemedText style={[styles.analysisText, { color: getTextColor() }]}>
        {analysis.description}
      </ThemedText>
      <View style={styles.macrosContainer}>
        <ThemedText style={[styles.macroText, { color: getTextColor() }]}>
          {analysis.estimated_calories} cal
        </ThemedText>
        <ThemedText style={[styles.macroText, { color: getTextColor() }]}>
          P: {analysis.estimated_protein_g}g
        </ThemedText>
        <ThemedText style={[styles.macroText, { color: getTextColor() }]}>
          C: {analysis.estimated_carbs_g}g
        </ThemedText>
        <ThemedText style={[styles.macroText, { color: getTextColor() }]}>
          F: {analysis.estimated_fat_g}g
        </ThemedText>
      </View>
      <View style={styles.qualityContainer}>
        <ThemedText style={[styles.qualityLabel, { color: getTextColor() }]}>
          Quality Score:
        </ThemedText>
        <ThemedText style={[styles.qualityScore, { color: getQualityColor(analysis.quality_score) }]}>
          {analysis.quality_score}/10
        </ThemedText>
      </View>
    </View>
  );

  const getQualityColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 5) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={[styles.bubble, { backgroundColor: getBubbleColor() }]}>
        {!isUser && !isSystem && (
          <ThemedText style={[styles.senderName, { color: getTextColor() }]}>
            Coach
          </ThemedText>
        )}

        {message.attachment_url && (
          <Pressable onPress={() => onImagePress?.(message.attachment_url!)}>
            <Image
              source={{ uri: message.attachment_url }}
              style={styles.attachmentImage}
              contentFit="cover"
            />
          </Pressable>
        )}

        {message.content && (
          <ThemedText style={[styles.messageText, { color: getTextColor() }]}>
            {message.content}
          </ThemedText>
        )}

        {message.ai_analysis && 'food_items' in message.ai_analysis && (
          renderMealAnalysis(message.ai_analysis as MealAnalysis)
        )}

        <ThemedText style={[styles.timestamp, { color: isUser ? '#fff9' : '#999' }]}>
          {formatTime(message.created_at)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 12,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  analysisContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ffffff33',
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisText: {
    fontSize: 13,
    marginBottom: 6,
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '500',
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  qualityLabel: {
    fontSize: 12,
  },
  qualityScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
