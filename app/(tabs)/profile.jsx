import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, FlatList, TouchableOpacity, Text } from 'react-native';

import { icons, images } from '../../constants';
import useAppwrite from '../../lib/useAppwrite';
import { getUserPosts, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import InfoBox from '../../components/InfoBox';

const Profile = () => {
    const { user, setUser, setIsLogged, handleLogout } = useGlobalContext();
    const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
    // console.log(user, '프로필');
    const logout = async () => {
        await signOut();
        handleLogout();
        setUser(null);
        setIsLogged(false);

        router.replace('/sign-in');
    };
    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item.creator.username}
                        avatar={item.creator.avatar}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity className="w-full items-end mt-10" onPress={logout}>
                            <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
                        </TouchableOpacity>

                        <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                            <Image
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                                source={{ uri: user?.avatar }}
                            />
                        </View>
                        <InfoBox title={user?.username} titleStyles="text-lg" containerStyles="mt-5" />
                        <View className="mt-6 flex flex-row ml-2">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                titleStyles="text-xl"
                                containerStyles="mr-12"
                            />
                            <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState title="생성하신 영상이 없습니다" subtitle="아무 영상이 없습니다" />
                )}
            />
        </SafeAreaView>
    );
};

export default Profile;
