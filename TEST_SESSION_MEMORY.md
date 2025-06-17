# Session Memory Testing Guide

## Test the Session Memory Feature

### Test 1: Basic Session Memory

1. Start a new session with 2 participants
2. Swipe through several movies (note which ones you see)
3. Complete the session (either match or no match)
4. Start a new session with the same participants
5. Verify that previously shown movies are NOT shown again

### Test 2: 10-Session Memory Limit

1. Complete 11 sessions in sequence
2. On the 12th session, verify that movies from the 1st session start appearing again
3. Movies from sessions 2-11 should still be filtered out

### Test 3: Button Visibility Fix

1. Start a session
2. Verify the "Done Swiping" button is NOT visible while swiping cards
3. Swipe through all cards for a participant
4. Verify the "Done Swiping" button IS visible when cards are finished
5. Tap the button and pass to next participant
6. Verify the button is hidden again for the new participant

### Test 4: Card Positioning Fix

1. Check that movie cards are properly centered vertically
2. Verify cards are not pushed down or overflowing
3. Ensure proper spacing between TurnIndicator and cards
4. Test on different screen sizes if possible

## Expected Behavior

### Session Memory

- App should remember ALL media shown to ANY participant in a session
- Memory should persist for exactly 10 sessions
- Session history is stored locally using Zustand persist
- New sessions filter out previously shown media from TMDB API and mock data

### UI Fixes

- "Done Swiping" button only appears when participant has finished all cards
- Cards are properly centered without overflow
- TurnIndicator takes minimal vertical space
- Responsive design works across screen sizes

## Debug Information

- Check console logs for "session memory" related messages
- Session history is persisted in local storage
- TMDB API calls include previouslyShownIds parameter
- Mock data fallback also respects session memory
