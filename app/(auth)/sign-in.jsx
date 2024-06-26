import { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import Guestmode from '../../components/Guestmode';

const SignIn = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const submit = async () => {
        if (form.email === '' || form.password === '') {
            Alert.alert('Error', '필드를 채워주세요');
        }

        setSubmitting(true);

        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();

            setUser(result);
            setIsLogged(true);

            Alert.alert('Success', '로그인 하셨습니다.');
            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center h-full px-4 my-6"
                    style={{
                        minHeight: Dimensions.get('window').height - 100,
                    }}
                >
                    <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[34px]" />

                    <Text className="text-2xl font-semibold text-white mt-10 mb-8 font-psemibold">
                        지금 바로 로그인 하세요!
                    </Text>

                    <FormField
                        cla
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherstyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherstyles="mt-7"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">계정이 없으신가요?</Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
                            회원가입
                        </Link>
                    </View>
                    {/* <Guestmode containerStyles="mt-7" /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
