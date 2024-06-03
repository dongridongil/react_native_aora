import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [isSubmitting, setisSubmitting] = useState(false);
    const submit = async () => {
        if (form.username === '' || form.email === '' || form.password === '') {
            Alert.alert('Error', 'Please fill in all fields');
        }
        setisSubmitting(true);
        try {
            const result = await createUser(form.email, form.password, form.username);
            setUser(result);
            setIsLogged(true);

            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setisSubmitting(false);
        }
    };
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center  min-h-[75vh] px-4 my-6">
                    <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[34px]" />
                    <Text className="text-2xl font-semibold text-white mt-10 mb-5 font-psemibold">회원 가입</Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-10"
                    />
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-10"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <CustomButton title="회원가입" handlePress={submit} containerStyles="mt-7" />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">이미 계정이 있으신가요?</Text>
                        <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
                            로그인
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
