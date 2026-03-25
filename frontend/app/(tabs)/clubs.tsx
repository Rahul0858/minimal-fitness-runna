import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_CLUBS_DATA = [
  { id: '1', name: 'Downtown Runners', members: 120, joined: true, desc: 'Daily runs at 6AM.' },
  { id: '2', name: 'Weekend Hikers', members: 45, joined: false, desc: 'Casual hikes in the hills.' },
  { id: '3', name: 'City Cyclists', members: 310, joined: false, desc: 'Urban cycling enthusiasts.' },
];

const CHALLENGES_DATA = [
  { id: '101', title: 'Run 50 km this week', progress: 0.6, daysLeft: 3 },
  { id: '102', title: 'Cycle 100 km', progress: 0.2, daysLeft: 5 },
  { id: '103', title: 'Hike 2 mountains', progress: 0.5, daysLeft: 12 },
];

export default function ClubsScreen() {
  const [activeTab, setActiveTab] = useState<'CLUBS' | 'CHALLENGES'>('CLUBS');
  const [clubs, setClubs] = useState(INITIAL_CLUBS_DATA);
  
  // Modal State for Creating Club
  const [modalVisible, setModalVisible] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');

  const handleJoinToggle = (clubId: string) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        const isJoining = !club.joined;
        return {
          ...club,
          joined: isJoining,
          members: isJoining ? club.members + 1 : club.members - 1
        };
      }
      return club;
    }));
  };

  const handleCreateClub = () => {
    if (!newClubName.trim()) {
      setModalVisible(false);
      return;
    }
    const newClub = {
      id: Date.now().toString(),
      name: newClubName,
      desc: newClubDesc || 'A new community club.',
      members: 1,
      joined: true,
    };
    setClubs((prev) => [newClub, ...prev]);
    setModalVisible(false);
    setNewClubName('');
    setNewClubDesc('');
  };

  const renderClubs = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ALL CLUBS</Text>
        <TouchableOpacity style={styles.createButtonOutline} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonOutlineText}>+ NEW CLUB</Text>
        </TouchableOpacity>
      </View>
      
      {clubs.map((club) => (
        <View key={club.id} style={styles.clubItem}>
          <View style={styles.clubInfo}>
            <Text style={styles.clubName}>{club.name}</Text>
            {club.desc ? <Text style={styles.clubDesc}>{club.desc}</Text> : null}
            <Text style={styles.clubMembers}>{club.members} members</Text>
          </View>
          <TouchableOpacity 
            style={[styles.joinButton, club.joined && styles.joinedButton]}
            onPress={() => handleJoinToggle(club.id)}
          >
            <Text style={[styles.joinButtonText, club.joined && styles.joinedButtonText]}>
              {club.joined ? 'JOINED' : 'JOIN'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROVIDED CHALLENGES</Text>
      {CHALLENGES_DATA.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDays}>{challenge.daysLeft}d left</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${challenge.progress * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Segmented Control */}
      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'CLUBS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('CLUBS')}
        >
          <Text style={[styles.tabText, activeTab === 'CLUBS' && styles.tabTextActive]}>CLUBS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'CHALLENGES' && styles.tabButtonActive]}
          onPress={() => setActiveTab('CHALLENGES')}
        >
          <Text style={[styles.tabText, activeTab === 'CHALLENGES' && styles.tabTextActive]}>CHALLENGES</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'CLUBS' ? renderClubs() : renderChallenges()}
      </ScrollView>

      {/* Create Club Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>CREATE A CLUB</Text>
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Club Name" 
              placeholderTextColor="#999" 
              value={newClubName} 
              onChangeText={setNewClubName} 
            />
            
            <TextInput 
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Description (optional)" 
              placeholderTextColor="#999" 
              value={newClubDesc} 
              onChangeText={setNewClubDesc} 
              multiline
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCreateClub}>
                <Text style={styles.modalSaveText}>CREATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  tabButtonActive: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  createButtonOutline: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  createButtonOutlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  challengeCard: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  challengeDays: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E5E5',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  clubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  clubInfo: {
    flex: 1,
    marginRight: 15,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  clubDesc: {
    fontSize: 12,
    color: '#333',
    marginBottom: 6,
    lineHeight: 16,
  },
  clubMembers: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  joinButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#000',
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  joinedButtonText: {
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    color: '#000',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
