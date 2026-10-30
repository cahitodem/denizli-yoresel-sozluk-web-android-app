import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '../../constants/theme';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        title="Kültür & Hakkında"
        subtitle="Denizli ağzının zengin mirası ve uygulama künyesi"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="library" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Denizli Yöresel Ağız Mirası</Text>
          <Text style={styles.heroDescription}>
            Batı Anadolu ağız grubuna dahil olan Denizli ağzı; Yörük-Türkmen kültürünün,
            Ege samimiyetinin ve yüzyıllık bereketli ova yaşantısının dilimizdeki en canlı
            yansımalarındandır.
          </Text>
        </View>

        {/* Dialect Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Ağız ve Şive Özellikleri</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureHeaderRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureTitle}>Ek Yığılması ve Hızlı Söyleyiş</Text>
            </View>
            <Text style={styles.featureText}>
              Denizli konuşmasında tezlik fiilleri ve şahıs ekleri sıklıkla kaynaşır.
              "Yapıver" yerine "yapıve", "gidiver" yerine "gidive" şeklinde yumuşamalar görülür.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeaderRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureTitle}>K-G ve T-D Ötümlüleşmesi</Text>
            </View>
            <Text style={styles.featureText}>
              Kelime başındaki ve ortasındaki 'k' sesleri sıklıkla 'g'ye dönüşür:
              "Patates" yerine "gumpir", "korkmak" yerine "gorkmak" kullanımı yaygındır.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeaderRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureTitle}>Üretim ve Doğayla İç İçe Terimler</Text>
            </View>
            <Text style={styles.featureText}>
              Dokumacılık (Buldan, Babadağ, Kızılcabölük), bağcılık (Çal, Bekilli) ve
              tarım yaşamı dil hazinesinde çok derin ve özgün benzetmeler bırakmıştır.
            </Text>
          </View>
        </View>

        {/* Purpose & Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Uygulama Misyonu</Text>
          <View style={styles.infoCard}>
            <Ionicons name="globe-outline" size={22} color={Colors.accent} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Bu uygulama; Denizli'nin unutulmaya yüz tutmuş yerel sözlerini, samimi deyimlerini
              ve kültürel belleğini dijital çağda korumak ve genç kuşaklara aktarmak amacıyla
              tasarlanmıştır.
            </Text>
          </View>
        </View>

        {/* References and Metadata Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Kaynaklar ve Künye</Text>
          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Uygulama Adı</Text>
              <Text style={styles.metaValue}>Denizli Yöresel Sözlük</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Sürüm</Text>
              <Text style={styles.metaValue}>1.0.0 (Expo Router)</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Temel Kaynak</Text>
              <Text style={styles.metaValue}>TDK Derleme Sözlüğü & Sözlü Tarih</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Dil Desteği</Text>
              <Text style={styles.metaValue}>Türkçe (Denizli Ağzı)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.soft,
    marginBottom: Spacing.xl,
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  featureCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.sm,
    ...Shadows.soft,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  featureTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  featureText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingLeft: Spacing.md + 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  infoIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 21,
  },
  metaCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  metaLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  metaValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  metaDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.xs,
  },
});
