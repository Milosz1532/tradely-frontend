import { SET_SCREEN_SIZE } from './actionTypes'

export const setScreenSize = isTabletOrMobile => ({
	type: SET_SCREEN_SIZE,
	payload: isTabletOrMobile,
})
