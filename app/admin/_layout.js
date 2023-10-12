import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
    } from "react-native-google-mobile-ads";
import { Snackbar } from 'react-native-paper';
import { View } from 'react-native';

export default function Layout() {

    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5448171275225637/7712155558';



    return (
        <>
        <Stack screenOptions={{
            headerShown: false
        }}>

        </Stack>

        <View style={{alignItems: 'center', alignContent: 'center', marginBottom: 10}}>

        <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />

         </View>
        </>
    );
}