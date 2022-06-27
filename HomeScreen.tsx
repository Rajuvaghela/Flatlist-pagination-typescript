import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";

export interface Props {
    navigation: string;

}

interface State {
    arrayList: any;
    isMoreDataFound: boolean;
    fetching_from_server: boolean;
    isFetching: boolean;
}

export default class HomeScreen extends Component<Props, State> {
    pageCount: number = 0;
    totalPage: number = 10000;
    constructor(props: Props) {
        super(props);
        this.state = {
            arrayList: [],
            isMoreDataFound: false,
            fetching_from_server: false,
            isFetching: false,
        };
    }
    checkConnected = () => {
        return NetInfo.fetch().then((state) => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            return state.isConnected;
        });
    };
    //netInfo = useNetInfo();
    componentDidMount() {
        if (this.pageCount === 0) {
            this.getDataListFromApiAsync();
        }
        setInterval(
            () => {
                this.pageCount = this.pageCount + 1;
                console.log("page count", this.pageCount);
                //  this.getDataListFromApiAsync();
            },
            10000
        );

    };
    onRefresh() {
        this.setState({ isFetching: true, }, () => {
            this.pageCount = 0;
            this.getDataListFromApiAsync();
        });
    }
    emptyListMessage = (item: any) => {
        return (
            // Flat List Item
            <Text
                style={styles.emptyListStyle}
            >
                No Data Found
            </Text>
        );
    };
    loadMoreData = () => {
        this.pageCount = this.pageCount + 1;
        console.log("load more page count", this.pageCount);
        this.getDataListFromApiAsync();
    };

    getDataListFromApiAsync = async () => {

      
        this.setState({ fetching_from_server: true });
        try {
            const response = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + this.pageCount);
            const json = await response.json();
            const { hits, nbPages } = json;
            this.totalPage = nbPages;
            this.setState({
                arrayList: this.pageCount == 0 ? hits : [...this.state.arrayList, ...hits],
                fetching_from_server: false,
                isFetching: false
            });
            return json.movies;
        } catch (error) {
            console.error(error);
        }
    };
    onPressItem = (item: any) => {
        console.log("item:", item);
        this.props.navigation.navigate("DisplayJson", {
            item: item,
        });
    };
    renderItem = (item: any) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => { this.onPressItem(item) }}>
                <View style={styles.item}>
                    <Text style={[styles.title, styles.commonPadding]}>{item.title}</Text>
                    <Text style={styles.commonPadding}>{item.author}</Text>
                    <Text style={styles.commonPadding}>{item.url}</Text>
                    <Text style={styles.commonPadding}>{item.created_at}</Text>
                </View>
            </TouchableOpacity>


        )
    };
    ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };
    renderFooter() {
        if (!this.state.isMoreDataFound) {
            return (
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={this.loadMoreData}
                        style={styles.loadMoreBtn}>
                        <Text style={styles.btnText}>Loading</Text>
                        {this.state.fetching_from_server ? (
                            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                        ) : null}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (<View style={styles.headerStyle}>
                <Text style={styles.titleStyle}>No more record found</Text>
            </View>);
        }

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.state.arrayList}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={this.ItemSeparatorView}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}

                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        margin: 5
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    commonPadding: {
        paddingVertical: 5
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#800000',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    headerStyle: {
        flex: 1,
        height: 80,
        width: '100%',
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    titleStyle: {
        color: 'black',
    },
});