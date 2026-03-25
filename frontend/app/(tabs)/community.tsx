import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LEADERBOARD_DATA = [
  { id: '1', rank: 1, name: 'Alice Z.', stats: '42.5 km' },
  { id: '2', rank: 2, name: 'Bob M.', stats: '38.2 km' },
  { id: '3', rank: 3, name: 'Charlie T.', stats: '31.0 km' },
];

const FEED_DATA = [
  { id: '101', name: 'Alice Z.', activity: 'Run', distance: '10.5 km', time: '52:10', caption: 'Morning crisp air.' },
  { id: '102', name: 'Dan K.', activity: 'Cycle', distance: '24.0 km', time: '1:10:05', caption: '' },
  { id: '103', name: 'Elena R.', activity: 'Hike', distance: '8.2 km', time: '2:40:15', caption: 'Steep incline today!' },
];

export default function CommunityScreen() {
  const renderLeaderboardItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.lbRank}>{item.rank}</Text>
      <Text style={styles.lbName}>{item.name}</Text>
      <Text style={styles.lbStats}>{item.stats}</Text>
    </View>
  );

  const renderFeedItem = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postName}>{item.name}</Text>
        <Text style={styles.postActivity}>{item.activity}</Text>
      </View>
      <View style={styles.postStats}>
        <Text style={styles.postStatText}>{item.distance}</Text>
        <Text style={styles.postStatText}>{item.time}</Text>
      </View>
      {item.caption ? <Text style={styles.postCaption}>{item.caption}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={FEED_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>CITY LEADERBOARD</Text>
            <View style={styles.leaderboardContainer}>
              {LEADERBOARD_DATA.map((item) => (
                <View key={item.id}>
                  {renderLeaderboardItem({ item })}
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>RECENT ACTIVITY</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // accommodate tab bar
  },
  headerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 15,
  },
  leaderboardContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  lbRank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  lbName: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  lbStats: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  postCard: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postActivity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  postStats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  postStatText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#000',
  },
  postCaption: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
