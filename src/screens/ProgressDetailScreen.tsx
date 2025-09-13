import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ProgressDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProgressDetail'>;
type ProgressDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProgressDetail'>;

interface Props {
  route: ProgressDetailScreenRouteProp;
  navigation: ProgressDetailScreenNavigationProp;
}

const ProgressDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entryId } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.placeholderContainer}>
          <Icon name="trending-up" size={80} color="#4CAF50" />
          <Text style={styles.placeholderTitle}>Progress Details</Text>
          <Text style={styles.placeholderSubtitle}>
            Detailed progress tracking will be available soon!
          </Text>
          <Text style={styles.entryId}>Entry ID: {entryId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  entryId: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'monospace',
  },
});

export default ProgressDetailScreen;
