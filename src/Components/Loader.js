import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ActivityIndicator, Dimensions } from "react-native";

export default Loader = () => {
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => { }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ActivityIndicator large />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});