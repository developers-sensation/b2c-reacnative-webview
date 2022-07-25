import React, { useState, useEffect } from 'react'
import WebView from 'react-native-webview';
import { getAccessToken } from '../Services/Login';
import DeviceInfo from 'react-native-device-info';
import { View, ActivityIndicator, Alert, Modal } from 'react-native';
import 'react-native-url-polyfill/auto';
import { configuration } from '../config';
import Loader from './Loader';

const B2CLoginPage = ({ navigation }) => {
    const [state, setState] = useState({
        showLoading: false,
    });
    const [AuthCode, setAuthCode] = useState(null);
    const { OATH_CLIENT_ID, OATH_URL, OAUTH_POLICY, RESET_POLICY, NONCE, AUTHORIZE_ENDPOINT, RESPONSE_TYPE, returnUrl } = configuration;
    let webRef;

    const SCOPE = encodeURI(configuration.SCOPE);
    var authUrl = `${OATH_URL}${AUTHORIZE_ENDPOINT}?p=${OAUTH_POLICY}&client_id=${OATH_CLIENT_ID}&nonce=${NONCE}&redirect_uri=${returnUrl}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&prompt=login`;
    var authUrlForgot = `${OATH_URL}${AUTHORIZE_ENDPOINT}?p=${RESET_POLICY}&client_id=${OATH_CLIENT_ID}&nonce=${NONCE}&redirect_uri=${returnUrl}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&prompt=login`;

    const [forgotPolicy, setforgotPolicy] = useState({ item: 0 });

    const [webViewUrl, setWebViewUrl] = useState(
        {
            url: authUrl
        }
    )

    let UserAgents = DeviceInfo.getUserAgent() + 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36;Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15'
    if (DeviceInfo.getDeviceId().toLowerCase().includes("iphone")) {
        UserAgents = DeviceInfo.getUserAgent() + " - Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1";
    }
    if (DeviceInfo.getDeviceId().toLowerCase().includes("ipad")) {
        UserAgents = DeviceInfo.getUserAgent() + " - Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10";
    }

    const onNavigationStateChange = (navigationState) => {
        if (navigationState.url.includes('AADB2C90118')) {
            setWebViewUrl(prevState => ({
                url: authUrlForgot
            }));
        }
        else if (navigationState.url.includes('AADB2C90091') || navigationState.url.includes('AADB2C90273')) {
            setWebViewUrl(prevState => ({
                url: authUrl
            }));
        }
        else {
            const url = navigationState.url;
            if (url.includes(returnUrl)) {
                forgotPolicy.item = 0
                const url1 = new URL(url);
                let sessonCode = url1.searchParams.get('code')
                console.log(sessonCode)
                if (sessonCode) {
                    setState({ ...state, showLoading: true });
                    setAuthCode(sessonCode);
                }
            }
        }
    }


    const onShouldStartLoadWithRequest = (request) => {
        // short circuit these
        if (!request.url ||
            request.url.startsWith('http') ||
            request.url.startsWith("/") ||
            request.url.startsWith("#") ||
            request.url.startsWith("javascript") ||
            request.url.startsWith("about:blank")
        ) {
            return true;
        }

        // blocked blobs
        if (request.url.startsWith("blob")) {
            Alert.alert("Link cannot be opened.");
            return false;
        }

        // list of schemas we will allow the webview
        // to open natively
        if (request.url.startsWith("tel:") ||
            request.url.startsWith("mailto:") ||
            request.url.startsWith("maps:") ||
            request.url.startsWith("geo:") ||
            request.url.startsWith("sms:")
        ) {

            Linking.openURL(request.url).catch(er => {
                Alert.alert("Failed to open Link: " + er.message);
            });
            return false;
        }

        // let everything else to the webview
        return true;
    };

    const handleAccessToken = async (code) => {
        const tokens = await getAccessToken(AuthCode);
        navigation.navigate("Home", {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpiry: tokens.accessTokenExpiry,
            refreshTokenExpiry: tokens.refreshTokenExpiry,
        })
    }


    useEffect(() => {
        if (AuthCode != null) {
            handleAccessToken(AuthCode);
        }
    }, [AuthCode]);

    return (
        <>
            {state && state.showLoading ? <Loader /> : null }
            <WebView
                source={
                    {
                        uri: webViewUrl.url
                    }
                }
                incognito={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['https://*', 'http://*']}
                useSharedProcessPool={false}
                onLoadStart={() => {
                    setState({ ...state, showLoading: true });
                    console.log('load start >> ');
                }}
                onLoad={
                    e => {
                        setState({ ...state, showLoading: false });
                        webViewUrl.url = e.nativeEvent.url;
                    }
                }
                onLoadEnd={() => {
                    setState({ ...state, showLoading: false });
                    console.log('load ended >> ');
                }}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                onError={(e) => {
                    setState({ ...state, showLoading: false });
                    console.log('error 1>> ' + JSON.stringify(e.nativeEvent));
                }}
                onHttpError={(e) => {
                    setState({ ...state, showLoading: false });
                    console.log('http error >> ' + e);
                }}

                onMessage={(e) => {
                    setState({ ...state, showLoading: false });
                    console.log('message >> ' + JSON.stringify(e));
                }}
                onResponderStart={() => {
                    console.log('responder >> ');
                }}
                userAgent={UserAgents}
                onLoadingFinish={(event) => {
                    setState({ ...state, showLoading: false });
                    console.log('finsihed >> ' + JSON.stringify(event))
                }}
                onLoadingError={(event) => {
                    setState({ ...state, showLoading: false });
                    console.log('load error >> ' + JSON.stringify(event))
                }}
                messagingEnabled={true}
                javaScriptCanOpenWindowsAutomatically
                keyboardDisplayRequiresUserAction
                hideKeyboardAccessoryView
                onNavigationStateChange={onNavigationStateChange}
                mixedContentMode={'always'}
                ref={webRef}
            />
        </>
    )
}

export default B2CLoginPage