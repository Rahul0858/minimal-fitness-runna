import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Activity = {
  id: string;
  date: string;
  distance: string;
  time: string;
  pace: string;
  activityType: string;
  snapshotUri?: string;
  caption?: string;
};

interface ActivityContextProps {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  streak: number;
}

const ActivityContext = createContext<ActivityContextProps | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Calculate streak based on past activities. (Simplified for this prototype)
  const calculateStreak = () => {
    if (activities.length === 0) return 0;
    // Just mock it: 1 point for every unique day in activities (simplified)
    const uniqueDays = new Set(activities.map(a => a.date.split('T')[0]));
    return uniqueDays.size;
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, streak: calculateStreak() }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within an ActivityProvider');
  return context;
};
