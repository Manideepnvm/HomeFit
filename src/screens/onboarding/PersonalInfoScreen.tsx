import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';

type PersonalInfoScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PersonalInfo'>;

interface Props {
  navigation: PersonalInfoScreenNavigationProp;
}

const PersonalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const [biologicalSex, setBiologicalSex] = useState<'male' | 'female' | 'prefer_not_to_say'>('prefer_not_to_say');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const handleContinue = () => {
    if (!age || !height || !weight) {
      return;
    }
    // TODO: Store personal info in context or async storage
    navigation.navigate('WorkoutFrequency');
  };

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
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
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 6</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            This information helps us create your personalized fitness plan
          </Text>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Units Toggle */}
            <View style={styles.unitsContainer}>
              <Text style={styles.unitsLabel}>Units:</Text>
              <TouchableOpacity style={styles.unitsToggle} onPress={toggleUnits}>
                <View style={[styles.toggleOption, units === 'metric' && styles.activeToggle]}>
                  <Text style={[styles.toggleText, units === 'metric' && styles.activeToggleText]}>
                    Metric
                  </Text>
                </View>
                <View style={[styles.toggleOption, units === 'imperial' && styles.activeToggle]}>
                  <Text style={[styles.toggleText, units === 'imperial' && styles.activeToggleText]}>
                    Imperial
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Biological Sex */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Biological Sex</Text>
              <View style={styles.sexOptions}>
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sexOption,
                      biologicalSex === option.value && styles.selectedSexOption,
                    ]}
                    onPress={() => setBiologicalSex(option.value as any)}
                  >
                    <Text style={[
                      styles.sexOptionText,
                      biologicalSex === option.value && styles.selectedSexOptionText,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Age</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.inputSuffix}>years</Text>
              </View>
            </View>

            {/* Height */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Height</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={units === 'metric' ? '170' : '5\'8"'}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
                <Text style={styles.inputSuffix}>
                  {units === 'metric' ? 'cm' : 'ft/in'}
                </Text>
              </View>
            </View>

            {/* Current Weight */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Current Weight</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={units === 'metric' ? '70' : '154'}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
                <Text style={styles.inputSuffix}>
                  {units === 'metric' ? 'kg' : 'lbs'}
                </Text>
              </View>
            </View>

            {/* Target Weight */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Target Weight (Optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={units === 'metric' ? '65' : '143'}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="numeric"
                />
                <Text style={styles.inputSuffix}>
                  {units === 'metric' ? 'kg' : 'lbs'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!age || !height || !weight) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!age || !height || !weight}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  unitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  unitsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unitsToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  activeToggleText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sexOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedSexOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  sexOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSexOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputSuffix: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
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

export default PersonalInfoScreen;
