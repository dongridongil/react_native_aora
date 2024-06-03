import { router } from 'expo-router';
import { View, Text, Image } from 'react-native';

import GuestButton from './GuestButton';
import { useEffect } from 'react';
import { account } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
const Guestmode = ({ title, subtitle }) => {
    // const { setUser, setIsLogged } = useGlobalContext();
    const handleGuestLogin = async () => {
        try {
            await account.deleteSession('current');
            const session = await account.createEmailPasswordSession('guest@123.com', '12341234');

            return session;
        } catch (error) {
            console.error('Guest login failed:', error);
        }
    };

    useEffect(() => {
        handleGuestLogin();
    }, []);
    return (
        <View className="flex justify-center items-center px-4 mt-20">
            <GuestButton title="Guest Mode" handlePress={() => router.push('/home')} containerStyles="w-full my-5" />
            <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
        </View>
    );
};

export default Guestmode;
