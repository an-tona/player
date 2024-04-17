// import { authSlice, loginThunk, getUserByIdThunk, registrationThunk } from "../reducers/slices"

function localStorageReducer(originalReducer, localStorageKey){
    function wrapper(state, action) {
        if (state === undefined) {
          try {
            return JSON.parse(localStorage[localStorageKey])
        } 
        catch {}
        }

        const newState = originalReducer(state, action);
        localStorage[localStorageKey] = JSON.stringify(newState)

        return newState;
    }
    
    return wrapper;
}

function jwtDecode(token) { 
    try {
        const tokenSplit = token.split('.');
        const encodedPayload = tokenSplit[1];
        const decodedPayload = atob(encodedPayload);
        const decodedData = JSON.parse(decodedPayload);
        return decodedData;
    }
    catch(e) { 
        return undefined;
    }
}

export { localStorageReducer, jwtDecode }