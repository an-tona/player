import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { localStorageReducer, jwtDecode } from '../additional functions/additional_functions';

const infiniteSrollSlice = createSlice({
    name: 'scroll',
    initialState: {tracksArr: []},
    reducers: {
        loadMoreTracks(state, action){
            const {tracks} = action.payload;
            state.tracksArr.push(tracks);
        }
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState: {token: null, payload: null, userInfo: null},
    reducers: {
        login(state, {payload:token}){
            const payload = jwtDecode(token);
            if (payload){
                state.payload = payload;
                state.token   = token;
            }
        },
        logout(state){
            state.payload = null;
            state.token   = null;
        },
        aboutMe(state, {payload}){
            state.userInfo = payload;
        },
        setAvatar(state, action){
            //
        },
        setNickName(state, action){
            const {nick} = action.payload;
            state.payload.nick = nick;
        }
    }
});


const audio = new Audio();
const address = 'http://player.node.ed.asmer.org.ua/';

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        isPlaying: false,
        currentTrackIndex: 0,
        currentTime: 0,
        volume: 0,

        track: {
            _id: '',
            duration: 0,
            url: '',
            id3: {
                title: '',
                artist: '',
            }
        },

        playlist: {
            _id: '',
            tracks: [],
        },
    },
    reducers: {
        play(state, action) {
            const { url, index } = action.payload;
            console.log('action.payload', action.payload)
            audio.src = address + url;
            audio.currentTime = state.currentTime;
            audio.play();
            state.isPlaying = true;
            state.track.url = url;
            state.currentTrackIndex = index;
        },
        pause(state) {
            state.isPlaying = false;
            audio.pause();
        },
        setPlaylist(state, action) {
            const { _id, tracks } = action.payload;
            state.playlist._id = _id;
            state.playlist.tracks = tracks;
        },
        setTrack(state, action) {
            const { url, _id, id3 } = action.payload;
            state.track.url = url;
            state.track._id = _id;
            state.track.id3.title = id3.title;
            state.track.id3.artist = id3.artist;
        },
        setVolume(state, action) {
            const volume = action.payload;
            audio.volume = volume;
            state.volume = volume;
        },
        setDuration(state, action) {
            const { duration } = action.payload;
            state.track.duration = duration;
        },
        setCurrentTime(state, action) {
            const newCurrentTime = action.payload;
            if (newCurrentTime !== audio.currentTime) {
                audio.currentTime = newCurrentTime;
            }
            state.currentTime = parseFloat(audio.currentTime.toFixed(2));
        },
        nextTrack(state) {
            if (state.playlist.tracks.length > 0) {
                state.currentTrackIndex = (state.currentTrackIndex === state.playlist.tracks.length - 1) ? 0 : (state.currentTrackIndex + 1);
                const nextTrack = state.playlist.tracks[state.currentTrackIndex];
                if (nextTrack.url) {
                    console.log('nextTrack.url', nextTrack.url)
                    audio.src = address + nextTrack.url;
                    state.track = nextTrack;
                    audio.play();
                    state.isPlaying = true;
                } else {
                    alert('File is broken :/')
                }
            }
        },
        prevTrack(state) {
            if (state.playlist.tracks.length > 0) {
                state.currentTrackIndex = (state.currentTrackIndex === 0) ? state.playlist.tracks.length - 1 : state.currentTrackIndex - 1;
                const prevTrack = state.playlist.tracks[state.currentTrackIndex];
                if (prevTrack.url) {
                    audio.src = address + prevTrack.url;
                    state.track = prevTrack;
                    audio.play();
                } else {
                    alert('File is broken :/')
                }
            }
        }
    },
});


audio.ontimeupdate = () => {
    if (audio.readyState === 4) {
        store.dispatch(playerSlice.actions.setCurrentTime(audio.currentTime));
        // document.getElementById('track_isLoading_img').style.display = 'none';
    // } else {
    //     document.getElementById('track_isLoading_img').style.display = 'block';
    }
}
audio.onloadedmetadata = () => store.dispatch(playerSlice.actions.setDuration({duration: audio.duration}))
audio.onended = () => (store.dispatch(playerSlice.actions.setCurrentTime(0)) ,store.dispatch(playerSlice.actions.nextTrack()))



const api = createApi({
    baseQuery: graphqlRequestBaseQuery({
        url: address + "graphql",
        prepareHeaders(headers, {getState}){
            const { token } = getState().auth 
            if (token){ 
                headers.set('Authorization', "Bearer " + token) 
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
                login: builder.mutation({
                    query: ({login, password}) => ({
                        document: `
                            query login($login: String!, $password: String!) {
                                login(login: $login, password: $password) 
                            }
                            `,
                        variables: {login, password}})
                }),
                userRegistration: builder.mutation({
                    query:({login, password}) => ({
                        document: `
                            mutation register($login:String!, $password: String!){
                                createUser(login:$login, password: $password){
                                    login
                                }
                            }`, variables: {login,password}
                    })
                }),
                getUserById: builder.query({
                    query: ({_id}) => ({ 
                        document: `query oneUser($query: String){
                            UserFindOne(query: $query){
                                _id login nick avatar{ url }
                            }
                        }`,
                        variables: {query: JSON.stringify([{_id}])}
                    }),
                    providesTags: (result, error, {_id}) => {  
                        return ([{ type: 'User', id: _id}])
                    }
                }),
                setUserNick: builder.mutation({
                    query: ({_id, nick}) => ({
                        document: `
                            mutation setNick($_id:String, $nick:String) {
                                UserUpsert(user: {_id: $_id, nick: $nick}){
                                    _id nick 
                                }
                            }`,
                        variables: {_id, nick}
                    }),
                    invalidatesTags: (result, error, arg) => ([{type: 'User', id: arg._id}])
                }),
                setUserAvatar: builder.mutation({
                    query:({id, avatarId}) => ({
                            document: `mutation setAvatar($id: String, $avatarId:ID){
                                UserUpsert(user:{_id: $id, avatar: {_id: $avatarId}}){
                                    _id, avatar{
                                        _id 
                                    }
                                }
                            }`, variables: {id, avatarId}
                    })
                }),
                findUserPlaylists: builder.query({
                    query:({_id}) => ({
                        document: `query findPlaylist($query: String){
                            PlaylistFind(query:$query){
                              _id
                              owner{login}
                              name
                              tracks{_id url id3 {title, artist}}
                        }
                    }`, variables:{query: JSON.stringify([{owner: _id}])}
                    })
                }),
                createPlaylist: builder.mutation({
                    query:({name, description, tracks}) => ({
                        document:`mutation addPlaylist($name: String, $description: String, $tracks:[TrackInput]){
                            PlaylistUpsert(playlist:{name:$name, description:$description, tracks:$tracks}){
                                _id owner{login} name description tracks{_id, id3{title, artist, album, year, genre}}
                            }
                        }`, variables:{name, description, tracks}
                    })
                }), 
                findPLaylistByName: builder.query({
                    query: ({playlistName}) => ({
                        document: `
                        query findPlaylistByName($playlist:String!) {
                            PlaylistFind(query:$playlist) {
                                owner { login nick }
                                _id  name
                                tracks {
                                        _id 
                                        url 
                                        id3 { artist title year }
                                }
                            }
                        }`,
                        variables: { playlist: JSON.stringify([{name:`/${playlistName}/`}]) }
                    })
                }),
                findTrack: builder.query({
                    query: ({ track }) => ({
                        document: `
                        query findTrack($query: String!) {
                            TrackFind(query: $query) {
                                _id
                                url
                                id3 {
                                    artist
                                    title
                                    year
                                }
                            }
                        }`,
                        variables: { query: JSON.stringify([{ $or: [{ ['id3.artist']: `/${track}/` }, { ['id3.title']: `/${track}/` }] }]) }
                    })
                }),
                findPlaylistById: builder.query({
                    query: ({ _id }) => ({
                        document: `
                        query findPlaylistByID($playlistId:String!) {
                            PlaylistFindOne(query:$playlistId) {
                            owner { login nick avatar { url } }   
                            _id name description 
                          tracks {
                                  _id 
                                  url 
                                  id3 { artist title album year }
                            }
                            }
                        }`,
                        variables: { playlistId: JSON.stringify([{_id}]) }
                    })
                }),
    })
})

const loginThunk = api.endpoints.login.initiate;
const getUserByIdThunk = api.endpoints.getUserById.initiate;
const registrationThunk = api.endpoints.userRegistration.initiate;
const { useLoginMutation, useUserRegistrationMutation, useFindPLaylistByNameQuery, useFindTrackQuery,
        useFindPlaylistByIdQuery, useFindUserPlaylistsQuery, useCreatePlaylistMutation } = api;

const reducers = {
    [api.reducerPath] : api.reducer,
    [authSlice.name]: localStorageReducer(authSlice.reducer, 'authToken'),
    [playerSlice.name] : localStorageReducer(playerSlice.reducer, 'player')
}

const store = configureStore({reducer: reducers, 
    middleware: (getDefaultMiddleware) => 
                 getDefaultMiddleware().concat(api.middleware)})

store.subscribe(() => console.log(store.getState()))

export {
    audio,
    authSlice,
    playerSlice,
    address,
    loginThunk,
    getUserByIdThunk,
    registrationThunk,
    useLoginMutation,
    useUserRegistrationMutation,
    useFindPLaylistByNameQuery,
    useFindTrackQuery,
    useFindPlaylistByIdQuery,
    useFindUserPlaylistsQuery,
    useCreatePlaylistMutation,
}

export default store
