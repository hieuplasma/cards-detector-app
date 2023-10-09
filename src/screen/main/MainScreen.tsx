import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, PermissionsAndroid } from 'react-native'
import { ImgBox } from "../../component/ImgBox";
import { ICard, randomCard } from "../../utils";
import { AutoDragSortableView } from 'react-native-drag-sort'

const CARD_MARGIN = 2

const invisibleCard1: ICard = {
    label: 'I1',
    txt: 'I1',
    img: undefined
}
const invisibleCard2: ICard = {
    label: 'I2',
    txt: 'I2',
    img: undefined
}
export const MainScreen = React.memo(() => {

    const refBox1 = useRef<any>(null)
    const refBox2 = useRef<any>(null)
    const refBox3 = useRef<any>(null)

    useEffect(() => {
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    }, [])

    const [card1, setCard1] = useState<ICard[]>([])
    const [card2, setCard2] = useState<ICard[]>([])
    const [card3, setCard3] = useState<ICard[]>([])

    const [result, setResult] = useState<ICard[]>([])

    const refresh = useCallback(() => {
        Alert.alert('Bắt đầu ván mới', 'Bạn có muốn xoá ván bài cũ và bắt đầu ván mới?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    refBox1.current?.refresh()
                    refBox2.current?.refresh()
                    refBox3.current?.refresh()
                    setResult([])
                }
            },
        ]);

    }, [])

    useEffect(() => {

        async function random() {
            // Alert.alert("Vui lòng chờ kết quả trong giây lát!")
            const tmp = await randomCard(card1, card2, card3)
            tmp.splice(3, 0, invisibleCard1, invisibleCard2)
            setResult(tmp)
        }
        if (card1.length > 0 && card2.length > 0 && card3.length > 0) random()
    }, [card1, card2, card3])

    const renderItem = (item: ICard, index: number) => {
        return (
            <View style={[styles.item]}>
                {item.img ?
                    <Image style={{ width: childrenWidth, height: childrenHeight }} source={item.img} resizeMode="contain" />
                    : <></>}
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>
                {"Cards Detector ♠ ♥ ♦ ♣"}
            </Text>

            <View style={styles.body}>
                <TouchableOpacity style={styles.refresh} onPress={refresh} activeOpacity={0.6}>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>{"Ván bài mới"}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    <ImgBox ref={refBox1} onChangeCard={(data) => setCard1(data)} />
                    <ImgBox ref={refBox2} onChangeCard={(data) => setCard2(data)} />
                    <ImgBox ref={refBox3} onChangeCard={(data) => setCard3(data)} />
                </View>

                <View style={styles.boxResult}>
                    <AutoDragSortableView
                        dataSource={result}
                        delayLongPress={50}
                        parentWidth={parentWidth}
                        childrenWidth={childrenWidth}
                        marginChildrenBottom={CARD_MARGIN}
                        marginChildrenRight={CARD_MARGIN}
                        marginChildrenLeft={CARD_MARGIN}
                        marginChildrenTop={CARD_MARGIN}
                        childrenHeight={childrenHeight}
                        fixedItems={[3, 4]}
                        onDataChange={(data) => {
                            data = data.filter((it: ICard) => it.label != invisibleCard1.label && it.label != invisibleCard2.label)
                            data.splice(3, 0, invisibleCard1, invisibleCard2)
                            setResult(data)
                        }}
                        keyExtractor={(item, index) => item.txt}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        </View>
    )
})


const windowWidth = Dimensions.get('window').width
const parentWidth = windowWidth - 54
const childrenWidth = parentWidth / 5 - 5
const childrenHeight = (340 / 242) * childrenWidth

const styles = StyleSheet.create({
    title: {
        fontSize: 16, fontWeight: 'bold',
        color: 'purple',
        margin: 16,
        textAlign: 'center'
    },
    refresh: {
        width: 100, height: 40, borderRadius: 100,
        backgroundColor: '#34eb34',
        justifyContent: 'center', alignItems: 'center'
    },
    body: {
        flex: 1,
        padding: 16, paddingTop: 0
    },
    boxImg: {
        width: (windowWidth - 54) / 3,
        height: 150,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center'
    },
    boxResult: {
        flex: 1,
        marginTop: 16,
        borderWidth: 1, borderColor: '#cccccc',
        borderRadius: 10, padding: 10, paddingRight: 0
    },
    no_pic: { width: 80, height: 80, alignSelf: 'center' },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
})