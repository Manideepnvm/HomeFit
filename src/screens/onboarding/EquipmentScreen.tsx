import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, Equipment } from '../../types';

type EquipmentScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Equipment'>;

interface Props {
  navigation: EquipmentScreenNavigationProp;
}

const EquipmentScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const equipmentOptions = [
    {
      id: 'none' as Equipment,
      title: 'No Equipment',
      description: 'Bodyweight exercises only',
      icon: 'person',
      color: '#9E9E9E',
    },
    {
      id: 'dumbbells' as Equipment,
      title: 'Dumbbells / Kettlebells',
      description: 'Free weights for strength training',
      icon: 'fitness-center',
      color: '#FF9800',
    },
    {
      id: 'resistance_bands' as Equipment,
      title: 'Resistance Bands',
      description: 'Portable resistance training',
      icon: 'extension',
      color: '#E91E63',
    },
    {
      id: 'yoga_mat' as Equipment,
      title: 'Yoga Mat',
      description: 'For floor exercises and stretching',
      icon: 'self-improvement',
      color: '#4CAF50',
    },
    {
      id: 'pull_up_bar' as Equipment,
      title: 'Pull-up Bar',
      description: 'Upper body strength training',
      icon: 'sports-gymnastics',
      color: '#2196F3',
    },
    {
      id: 'chair_bench' as Equipment,
      title: 'Chair / Bench',
      description: 'For elevated exercises',
      icon: 'chair',
      color: '#795548',
    },
    {
      id: 'full_gym' as Equipment,
      title: 'Full Home Gym',
      description: 'Complete gym setup',
      icon: 'home',
      color: '#9C27B0',
    },
  ];

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipment)) {
        return prev.filter(item => item !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };

  const handleContinue = () => {
    if (selectedEquipment.length > 0) {
      // TODO: Store selected equipment in context or async storage
      navigation.navigate('PersonalInfo');
    }
  };

  return (
    <LinearGradient
      colors={['#4CAF50', '#45a049']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 6</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What equipment do you have?</Text>
        <Text style={styles.subtitle}>
          Select all the equipment you have available at home
        </Text>

        <ScrollView style={styles.equipmentContainer} showsVerticalScrollIndicator={false}>
          {equipmentOptions.map((equipment) => (
            <TouchableOpacity
              key={equipment.id}
              style={[
                styles.equipmentCard,
                selectedEquipment.includes(equipment.id) && styles.selectedEquipmentCard,
              ]}
              onPress={() => toggleEquipment(equipment.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: equipment.color }]}>
                <Icon name={equipment.icon} size={24} color="#ffffff" />
              </View>
              <View style={styles.equipmentContent}>
                <Text style={styles.equipmentTitle}>{equipment.title}</Text>
                <Text style={styles.equipmentDescription}>{equipment.description}</Text>
              </View>
              {selectedEquipment.includes(equipment.id) && (
                <Icon name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedEquipment.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedEquipment.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  equipmentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  equipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEquipmentCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  equipmentContent: {
    flex: 1,
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#666',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default EquipmentScreen;
