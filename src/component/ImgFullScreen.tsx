/**
 * Created by hieutm on Mon Jun 05 2023
 * Copyright (c) 2023 https://gitlab.com/h1eu_traN
 */

import React, { PureComponent } from 'react';
import { Dimensions, TouchableOpacity, View, Image, StyleSheet, Text } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { images } from '../assets';
import { ICard } from '../utils';

export class ImageFullScreen extends PureComponent {
    state = {
        showing: false,
        uri: "",
        listCard: [],
        callback: () => { }
    };

    _show = (uri: string, listCard: ICard[], callback: () => void) => {
        this.setState({
            showing: true,
            uri: uri,
            listCard: listCard,
            callback: callback
        });
    };
    _hide = () => {
        this.setState({
            showing: false,
            uri: false,
            listCard: [],
            callback: () => { }
        });
    };

    componentDidMount() {
        window.image = {
            show: this._show,
            hide: this._hide,
        };
    }

    getColor = (label: string) => {
        if (label.includes('C') || label.includes('S')) return 'black'
        else return 'red'
    }
    render() {
        const { showing, uri, listCard, callback } = this.state;
        return (
            <>
                {!showing ? (
                    <></>
                ) : (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            position: 'absolute'
                        }} onPress={this._hide}>
                        </TouchableOpacity>
                        <View style={styles.top_img}>
                            <TouchableOpacity style={styles.btnRepick} onPress={callback}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{"Chụp lại"}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', padding: 3, alignItems:'center' }}>
                                {
                                    listCard.map((item: ICard) => {
                                        return (
                                            <Text style={{ color: this.getColor(item.label), marginHorizontal: 3 }} key={item.label}>
                                                {item.txt}
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={{
                            position: 'absolute',
                            top: 150,
                            left: 15,
                            right: 15,
                            bottom: 150,
                            backgroundColor: 'orange',
                            borderRadius: 20
                        }}>
                            <ReactNativeZoomableView
                                maxZoom={10}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                style={{ borderRadius: 20}}
                            >
                                <Image source={uri ? { uri: uri } : images.no_picture} style={{
                                    width: windowWidth - 30,
                                    height: windowHeight - 300
                                }} resizeMode='contain' />
                            </ReactNativeZoomableView>
                        </View>
                    </View>
                )}
            </>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('screen').height;

const styles = StyleSheet.create({
    top_img: {
        position: 'absolute',
        top: 100, left: 15, right: 15, borderRadius: 30,
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
        height: 45
    },
    btnRepick: {
        width: 70, height: '100%',
        borderRadius: 30,
        backgroundColor: 'purple',
        justifyContent: 'center', alignItems: 'center'
    }
})