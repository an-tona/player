import { authSlice, infiniteSrollSlice, loginThunk, getUserByIdThunk, registrationThunk, useFindAllTracksQuery } from "./slices";


const actionFullLogin = (login, password) =>
    async dispatch => {
        const token = await dispatch(loginThunk({login, password})) 
        if (token?.data?.login){
            dispatch(authSlice.actions.login(token.data.login))
            await dispatch(actionAboutMe()) 
        }
    }
const actionFullRegister = (login, password) =>
    async dispatch => {
        const registerInfo = await dispatch(registrationThunk({login, password}))
        const token = await dispatch(loginThunk({login, password}))
        if (registerInfo && token?.data?.login) {
            dispatch(actionFullLogin(login, password))
        }
    }

const actionAboutMe = () => 
    async (dispatch, getState) => {
        const {auth} = getState()
        if (auth.payload){
            const {id} = auth.payload.sub
            const user = await dispatch(getUserByIdThunk({_id: id}))
            dispatch(authSlice.actions.aboutMe(user.data.UserFindOne));
        }
    }
const actionLogout = () => 
    async (dispatch) => {
        dispatch(authSlice.actions.logout())
    }

// const actionLoadMoreTracks = () => {
//     async (dispatch, getState) => {
//         const {infiniteScroll} = getState();
//         const skip = infiniteScroll.tracksArr.length;
//         const {isLoading, data} = useFindAllTracksQuery({skip: skip})
//         if (!isLoading){
//             await dispatch(infiniteSrollSlice.actions.loadMoreTracks({data}))
//         }
//     }
// }
const actionLoadMoreTracks = () => 
    async (dispatch, getState) => {
        const { scroll } = getState();
        const skip = scroll.tracksArr.length;
    
        const { isLoading, data } = useFindAllTracksQuery(skip);
    
        if (!isLoading) {
        dispatch(infiniteSrollSlice.actions.loadMoreTracks({ data }));
        }
    };
export { actionFullLogin, actionFullRegister, actionAboutMe, actionLogout, actionLoadMoreTracks }