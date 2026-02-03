import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const brainProtectionTips = [
  {
    title: "اقرأ كتاب",
    description: "30 دقيقة قراية كتاب حقيقي – مش ريلز ولا شورتس – بتبني تركيز وذاكرة. جرب قبل النوم بدل الموبايل.",
    icon: "📚"
  },
  {
    title: "امشي شوية",
    description: "مش محتاج جيم. حتى لو تمشيت للبقالة أو حوالين البيت – الحركة بتوصّل أوكسجين للدماغ وبتخلص التوتر.",
    icon: "🏃"
  },
  {
    title: "اتعلم حاجة غريبة عنك",
    description: "عزف، رسم، طبخ حاجة جديدة… أي حاجة تخلي دماغك يشتغل بطرق مختلفة. مش شرط تكون مبدع من أول مرة.",
    icon: "🎯"
  },
  {
    title: "السوشيال مش حياتك",
    description: "حدد ساعة في اليوم للإنستغرام والتيك توك. صدقني الـ scroll اللانهائي بياكل من تركيزك بدون ما تحس.",
    icon: "📱"
  },
  {
    title: "قابل حد فعلاً",
    description: "الكلام وجه لوجه – حتى لو قهوة مع صاحبك – مش زي الشات. العلاقات الحقيقية بتحمي صحتك النفسية أكتر مما تتخيل.",
    icon: "👥"
  },
  {
    title: "نام براحتك",
    description: "7-8 ساعات مش رفاهية. المخ بيعمل صيانة ليلاً ويغسل السموم. لو بتنام متقطع، ده أول حاجة تغيّرها.",
    icon: "😴"
  },
  {
    title: "وقف 10 دقائق",
    description: "تنفس، اقفل عينيك، خليك حاضر. مش لازم تسميها تأمل – بس استراحة حقيقية من الضجيج بتاع جواك.",
    icon: "🧘"
  },
  {
    title: "اكل يغذي مخك",
    description: "مش لازم دايت صارم. بس خضار، فواكه، مكسرات، سمك – مخك محتاج ده عشان يشتغل كويس.",
    icon: "🥗"
  },
  {
    title: "اكتب أي حاجة",
    description: "حتى لو مذكرات عشوائية. الكتابة بتنضف راسك وتساعدك تفهم نفسك. جرب قبل ما تنام.",
    icon: "✍️"
  },

  {
    title: "اشرب مية",
    description: "مخك 75% مية. لو مش شارب كويس، التركيز والذاكرة أول حاجة تتأثر. زجاجة جنبك طول اليوم.",
    icon: "💧"
  },
  {
    title: "اطلع برة",
    description: "شمس، هواء، شجرة حتى لو وحيدة. 15 دقيقة برة البيت بتفرق في المزاج والوضوح العقلي.",
    icon: "🌳"
  },
  {
    title: "العب حاجة تفتكر بيها",
    description: "سودوكو، شطرنج، حتى كلمات متقاطعة. 10 دقايق في اليوم بتحافظ على المخ زي الرياضة للجسم.",
    icon: "🧩"
  },
  {
    title: "قلل السكر",
    description: "السكر بيعملك طاقة وهمية وبعدين هبوط. استبدل الحلويات بالفواكه – مخك هيشكرك.",
    icon: "🍎"
  },
  {
    title: "استراحة من الشاشة",
    description: "كل 20 دقيقة: ارفع عينيك وشوف حاجة بعيدة 20 ثانية. عينيك ومخك محتاجين الراحة دي.",
    icon: "⏸️"
  },
  {
    title: "نام واستيقظ في ميعاد",
    description: "الميعاد الثابت – حتى في الإجازة – بيخلي نومك أعمق ودماغك أصفى. جرب أسبوع واحد وشوف.",
    icon: "🕐"
  }
];

// أمثلة للأكل الصحي
const healthyFoodExamples = ['أفوكادو', 'توت', 'سمك', 'مكسرات', 'بروكلي'];

// رسائل حسب التقدم – طبيعية ومتنوعة
const getMotivationalMessage = (progress, remaining) => {
  if (remaining > 0 && remaining <= 3) return `فاضلك ${remaining} بس`;
  if (progress >= 80) return 'قربت تكمل';
  if (progress >= 50) return 'في النص تقريباً';
  if (progress >= 30) return 'كويس، كمل';
  const msgs = ['يلا نكمل', 'خطوة خطوة', 'عامل كويس'];
  return msgs[Math.floor(progress / 40) % 3];
};

// نص زر التالي
const getNextButtonText = (currentIndex, total) => {
  const remaining = total - currentIndex - 1;
  if (remaining === 0) return 'كملت';
  if (remaining === 1) return 'التانية أخيرة';
  if (remaining === 2) return 'آخر اثنين';
  if (remaining <= 4) return 'التالي';
  return 'أنا جاهز';
};

// لون شريط التقدم (أصفر → أخضر)
const getProgressBarColor = (progress) => {
  if (progress >= 70) return '#00C851'; // أخضر
  if (progress >= 40) return '#8BC34A'; // أخضر فاتح
  return '#FFC107'; // أصفر
};

export default function App() {
  const { width, height } = useWindowDimensions();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [completedTips, setCompletedTips] = useState(0);
  const [brainHealth, setBrainHealth] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [footerAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isCompleted, setIsCompleted] = useState(false);

  const currentTip = brainProtectionTips[currentTipIndex];
  const progress = (completedTips / brainProtectionTips.length) * 100;
  const remainingTips = brainProtectionTips.length - currentTipIndex - 1;
  const isHealthyFoodTip = currentTip.title === 'اكل يغذي مخك';

  const isWeb = Platform.OS === 'web';
  const maxContentWidth = isWeb ? Math.min(480, width * 0.95) : width;
  const responsiveStyles = createStyles(width, height, maxContentWidth);

  // Animation for footer
  useEffect(() => {
    // Simple fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);


  const nextTip = () => {
    if (currentTipIndex < brainProtectionTips.length - 1) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Slide animation
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentTipIndex(prev => prev + 1);
      setCompletedTips(prev => prev + 1);
      setBrainHealth(prev => Math.min(prev + 10, 100));
    } else {
      setIsCompleted(true);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const prevTip = () => {
    if (currentTipIndex <= 0) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: width, duration: 250, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -width, duration: 0, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    setCurrentTipIndex(prev => prev - 1);
    setCompletedTips(prev => Math.max(0, prev - 1));
    setBrainHealth(prev => Math.max(0, prev - 10));
  };

  const resetApp = () => {
    setCurrentTipIndex(0);
    setCompletedTips(0);
    setBrainHealth(0);
    setIsCompleted(false);
    slideAnim.setValue(0);
  };

  if (isCompleted) {
    return (
      <LinearGradient
        colors={['#00C851', '#007E33', '#00C851']}
        style={responsiveStyles.container}
      >
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={responsiveStyles.completedContainer}>
          <Text style={responsiveStyles.completedIcon}>✓</Text>
          <Text style={responsiveStyles.completedTitle}>خلصت</Text>
          <Text style={responsiveStyles.completedSubtitle}>
            عرفت النصائح كلها
          </Text>
          <Text style={responsiveStyles.completedDescription}>
            دلوقتي جرب تطبقهم شوية شوية. مش شرط كل حاجة مرة واحدة – ابدأ بحاجة وحدة واستمر عليها.
          </Text>
          <View style={responsiveStyles.summaryBox}>
            <Text style={responsiveStyles.summaryTitle}>فكّر فيها:</Text>
            <Text style={responsiveStyles.summaryItem}>• نوم + أكل كويس</Text>
            <Text style={responsiveStyles.summaryItem}>• أقل سوشيال، أكتر حركة</Text>
            <Text style={responsiveStyles.summaryItem}>• وقت للراحة والطبيعة</Text>
          </View>
          <TouchableOpacity style={responsiveStyles.challengeButton} onPress={resetApp}>
            <Text style={responsiveStyles.challengeButtonText}>شوف النصائح تاني�</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#2d5a5a', '#1a3d3d', '#2d5a5a']}
      style={responsiveStyles.container}
    >
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={responsiveStyles.scrollContainer}>
        <View style={responsiveStyles.contentWrapper}>
          <View style={responsiveStyles.header}>
          <Text style={responsiveStyles.title}>دماغك أهم من السكروال</Text>
          <Text style={responsiveStyles.subtitle}>نصائح بسيطة تخليها تشتغل كويس</Text>
        </View>

        <View style={responsiveStyles.progressContainer}>
          <Text style={responsiveStyles.progressText}>
            {completedTips} من {brainProtectionTips.length}
          </Text>
          <View style={responsiveStyles.progressBar}>
            <View style={[responsiveStyles.progressFill, { width: `${progress}%`, backgroundColor: getProgressBarColor(progress) }]} />
          </View>
          <Text style={responsiveStyles.progressTooltip}>
            {getMotivationalMessage(progress, remainingTips)}
          </Text>
          <Text style={responsiveStyles.healthText}>{brainHealth}%</Text>
        </View>

        <Animated.View style={[responsiveStyles.tipContainer, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={responsiveStyles.tipIcon}>{currentTip.icon}</Text>
          <Text style={responsiveStyles.tipTitle}>{currentTip.title}</Text>
          <Text style={responsiveStyles.tipDescription}>{currentTip.description}</Text>
          {isHealthyFoodTip && (
            <View style={responsiveStyles.foodExamplesContainer}>
              <Text style={responsiveStyles.foodExamplesTitle}>زي مثلاً:</Text>
              <View style={responsiveStyles.foodExamplesRow}>
                {healthyFoodExamples.map((food, i) => (
                  <Text key={i} style={responsiveStyles.foodExample}>{food}</Text>
                ))}
              </View>
            </View>
          )}
        </Animated.View>

        <View style={responsiveStyles.navRow}>
          <TouchableOpacity
            style={[responsiveStyles.arrowButton, currentTipIndex === 0 && responsiveStyles.arrowDisabled]}
            onPress={prevTip}
            disabled={currentTipIndex === 0}
            activeOpacity={0.7}
          >
            <Text style={responsiveStyles.arrowText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity style={responsiveStyles.nextButton} onPress={nextTip} activeOpacity={0.8}>
            <Text style={responsiveStyles.nextButtonText}>
              {getNextButtonText(currentTipIndex, brainProtectionTips.length)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={responsiveStyles.arrowButton}
            onPress={nextTip}
            activeOpacity={0.7}
          >
            <Text style={responsiveStyles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={responsiveStyles.tipCounter}>
          <Text style={responsiveStyles.counterText}>
            {currentTipIndex + 1} من {brainProtectionTips.length}
          </Text>
        </View>

        </View>
      </ScrollView>
      
      <Animated.View style={[
        responsiveStyles.footer,
        {
          opacity: fadeAnim,
        },
      ]}>
        <Text style={responsiveStyles.footerText}>@Nour | Judy Mohammed</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const createStyles = (w, h, maxW) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Math.min(20, w * 0.05),
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: maxW,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Math.min(30, h * 0.03),
  },
  title: {
    fontSize: Math.min(w * 0.08, 32),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: Math.min(w * 0.05, 22),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressTooltip: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C851',
    borderRadius: 10,
  },
  healthText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: Math.min(25, w * 0.06),
    borderRadius: 24,
    marginBottom: Math.min(30, h * 0.03),
    width: '100%',
    minHeight: Math.max(h * 0.3, 220),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  tipIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  tipDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  foodExamplesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  foodExamplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  foodExamplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  foodExample: {
    fontSize: 15,
    color: '#555',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.4,
  },
  arrowText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#007E33',
    paddingVertical: 16,
    paddingHorizontal: Math.min(40, w * 0.1),
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipCounter: {
    alignItems: 'center',
  },
  counterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Zapfino' : Platform.OS === 'android' ? 'cursive' : 'cursive',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
    transform: [{ skewX: '-5deg' }],
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedIcon: {
    fontSize: 64,
    marginBottom: 20,
    color: 'white',
    fontWeight: '300',
  },
  completedTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  completedSubtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  completedDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  summaryBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    width: '100%',
    alignItems: 'flex-start',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    width: '100%',
  },
  summaryItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 6,
    lineHeight: 24,
  },
  challengeButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  challengeButtonText: {
    color: '#007E33',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});