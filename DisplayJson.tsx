import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export interface Props {
    navigation: string;

}

interface State {
    item: any;

}
export default class DisplayJson extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            item: props.route ? props.route.params.item : {},

        };
    }
    componentDidMount() {
        console.log("json,", this.state.item);


    }
    render() {
        return (
            <View>
                <Text style={{ fontWeight: "bold" }}>Below are single item data from previous screen:</Text>
                <Text>{JSON.stringify(this.state.item)}</Text>
            </View>
        );
    }
}  