import React, { useCallback, useEffect, useImperativeHandle, useState } from "react"
import {
    Alert, TouchableOpacity,
    Image, StyleSheet, Dimensions, 
    View, ActivityIndicator, Platform,
} from "react-native"
import ImagePicker from 'react-native-image-crop-picker';

import { images } from "../assets"
import { ICard, getCardFromBox, randomCard } from "../utils"
import axios from "axios"

interface ImgBoxProps {
    onChangeCard: (data: ICard[]) => void
}

const Wiget = React.forwardRef(({ onChangeCard }: ImgBoxProps, ref) => {

    useImperativeHandle(ref, () => ({
        refresh: onRefresh
    }));

    const [loading, setLoading] = useState(false)

    const [img, setImg] = useState<any>(null)
    const [listCard, setListCard] = useState<ICard[]>([])

    const onPressImgBox = useCallback(() => {
        if (loading) return 0
        if (img) {
            window.image.show(img.uri, listCard, openCamera)
            return 0
        }

        openCamera()
    }, [img, listCard, loading])

    const openCamera = useCallback(async () => {
        const res = await ImagePicker.openCamera({
            width: 640,
            height: 640,
            cropping: true,
            mediaType: 'photo',
        });

        const image = {
            uri: res.path,
            type: res.mime,
            fileName: 'lmaolmao.jpg'
        }
        window.image.hide()
        if (image) {
            setImg(image)
            setLoading(true)
            let bodyFormData = new FormData();
            bodyFormData.append('file', {
                uri: image.uri,
                type: image.type,
                name: image.fileName,
            })
            await axios({
                method: "post",
                url: "https://thanhnv2323-detection.hf.space/img_object_detection_to_json",
                // url: 'http://172.16.6.112:7860/img_object_detection_to_json',
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    //handle success
                    console.log(response);
                    const tmp = getCardFromBox(response.data.boxes)
                    setListCard(tmp)
                    onChangeCard(tmp)
                })
                .catch(function (response) {
                    //handle error
                    console.log(response)
                    Alert.alert("Có lỗi xảy ra", "Vui lòng chụp lại ảnh!")
                });
            setLoading(false)
        }

        else {
            Alert.alert("Có lỗi xảy ra", "Vui lòng chụp lại ảnh!")
        }
    }, [])

    const onRefresh = useCallback(() => {
        setImg(false)
        setListCard([])
        onChangeCard([])
        setLoading(false)
    }, [])

    return (
        <TouchableOpacity style={styles.boxImg} onPress={onPressImgBox}>
            {
                img ?
                    <Image source={{ uri: img.uri }} style={{ flex: 1 }} resizeMode='contain' />
                    : <Image source={images.no_picture} style={styles.no_pic} resizeMode='contain' />
            }
            {
                loading &&
                <View style={styles.loading_pic}>
                    <ActivityIndicator size={"large"} color={'#34eb34'} />
                </View>
            }
        </TouchableOpacity>

    )
})

export const ImgBox = React.memo(Wiget)

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    boxImg: {
        width: (windowWidth - 54) / 3,
        height: 150,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center'
    },
    no_pic: { width: 80, height: 80, alignSelf: 'center' },
    loading_pic: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center'
    }
})