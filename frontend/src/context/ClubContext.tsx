import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, addDoc, doc, updateDoc, onSnapshot, query, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Activity } from './ActivityContext';
import { Alert } from 'react-native';

export interface ClubMember {
  id: string;
  name: string;
  isOwner?: boolean;
}

export interface Club {
  id: string;
  name: string;
  desc: string;
  category: string;
  isPublic: boolean;
  location: string;
  members: ClubMember[];
  joined: boolean; // Computed from current user
  activities: Activity[];
}

interface ClubContextProps {
  clubs: Club[];
  createClub: (club: Omit<Club, 'id' | 'members' | 'joined' | 'activities'>, ownerName: string, ownerId: string) => Promise<void>;
  joinClub: (clubId: string, member: ClubMember) => void;
  leaveClub: (clubId: string, memberId: string) => void;
  addClubActivity: (clubId: string, activity: Activity) => void;
  loading: boolean;
}

const ClubContext = createContext<ClubContextProps | undefined>(undefined);

export const ClubProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to all clubs in Firestore
  useEffect(() => {
    const clubsRef = collection(db, 'clubs');
    const q = query(clubsRef);

    console.log('[ClubContext] Starting Firestore listener...');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('[ClubContext] Received snapshot, size:', snapshot.size);
      const fetchedClubs: Club[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const members: ClubMember[] = data.members || [];
        const isJoined = user ? members.some(m => m.id === user.uid) : false;

        return {
          id: docSnap.id,
          name: data.name || 'Unnamed Club',
          desc: data.desc || '',
          category: data.category || 'Run',
          isPublic: data.isPublic !== false,
          location: data.location || 'Global',
          members,
          joined: isJoined,
          activities: data.activities || [],
        };
      });
      setClubs(fetchedClubs);
      setLoading(false);
    }, (error) => {
      console.error('Firestore clubs listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createClub = async (clubData: Omit<Club, 'id' | 'members' | 'joined' | 'activities'>, ownerName: string, ownerId: string) => {
    const clubsRef = collection(db, 'clubs');
    console.log('[ClubContext] ATTEMPTING CREATE CLUB for owner:', ownerId);
    
    const payload = {
      ...clubData,
      members: [{ id: ownerId, name: ownerName, isOwner: true }],
      activities: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(clubsRef, payload);
      console.log('[ClubContext] ✅ Firestore Create Successful with ID:', docRef.id);
    } catch (err: any) {
      console.error('[ClubContext] ❌ Firestore Create Failed:', err.code, err.message);
      setTimeout(() => Alert.alert('Club Error', `Write failed: ${err.message}`), 300);
    }
  };

  const joinClub = (clubId: string, member: ClubMember) => {
    const clubRef = doc(db, 'clubs', clubId);
    updateDoc(clubRef, {
      members: arrayUnion(member),
    }).catch(err => console.error('Failed to join club:', err));
  };

  const leaveClub = (clubId: string, memberId: string) => {
    // arrayRemove needs exact object match, so find the member first
    const club = clubs.find(c => c.id === clubId);
    const memberObj = club?.members.find(m => m.id === memberId);
    if (memberObj) {
      const clubRef = doc(db, 'clubs', clubId);
      updateDoc(clubRef, {
        members: arrayRemove(memberObj),
      }).catch(err => console.error('Failed to leave club:', err));
    }
  };

  const addClubActivity = (clubId: string, activity: Activity) => {
    const clubRef = doc(db, 'clubs', clubId);
    // Store activity without heavy data (no speedData/elevationData to keep club doc lightweight)
    const lightActivity = {
      id: activity.id,
      date: activity.date,
      activityType: activity.activityType,
      distance: activity.distance,
      time: activity.time,
      pace: activity.pace,
    };
    updateDoc(clubRef, {
      activities: arrayUnion(lightActivity),
    }).catch(err => console.error('Failed to add club activity:', err));
  };

  return (
    <ClubContext.Provider value={{ clubs, createClub, joinClub, leaveClub, addClubActivity, loading }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) throw new Error('useClub must be used within a ClubProvider');
  return context;
};
