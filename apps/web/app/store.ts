import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

type Role = "tenant" | "lawyer" | "admin";

type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string;
};

type SessionState = {
    status: "loading" | "authenticated" | "unauthenticated" | "guest";
    user: User | null;
};

type ReviewHistoryItem = {
    id: string;
    title: string;
    createdAt: string;
    status: "success" | "error";
};

type AIHistoryState = {
    items: ReviewHistoryItem[];
};

const initialSessionState: SessionState = {
    status: "loading",
    user: null,
};

const initialAIHistoryState: AIHistoryState = {
    items: [
        {
            id: "review-1",
            title: "Back Bay sublease addendum",
            createdAt: "2024-11-02T10:00:00Z",
            status: "success",
        },
        {
            id: "review-2",
            title: "Security deposit dispute draft",
            createdAt: "2024-10-30T16:30:00Z",
            status: "success",
        },
    ],
};

const sessionSlice = createSlice({
    name: "session",
    initialState: initialSessionState,
    reducers: {
        setSession(state, action: PayloadAction<any>) {
            state.status = "authenticated";
            state.user = {
                id: action.payload._id || action.payload.id,
                name: action.payload.username || action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                avatar: "/images/NEU.png",
            };
        },
        signOut(state) {
            state.status = "unauthenticated";
            state.user = null;
        },
        signInAsDemo(state, action: PayloadAction<{name: string; email: string; role?: Role}>) {
            state.status = "authenticated";
            state.user = {
                id: `demo-${Date.now()}`,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role || "tenant",
                avatar: "/images/NEU.png",
            };
        },
        setGuestSession(state) {
            state.status = "guest";
            state.user = {
                id: "guest",
                name: "Guest",
                email: "guest@leaseqa.com",
                role: "tenant",
                avatar: "/images/NEU.png",
            };
        },
    },
});

const aiHistorySlice = createSlice({
    name: "aiHistory",
    initialState: initialAIHistoryState,
    reducers: {
        addReview(state, action: PayloadAction<Omit<ReviewHistoryItem, "id">>) {
            const newEntry: ReviewHistoryItem = {
                id: `review-${Date.now()}`,
                ...action.payload,
            };
            state.items = [newEntry, ...state.items].slice(0, 25);
        },
    },
});

const store = configureStore({
    reducer: {
        session: sessionSlice.reducer,
        aiHistory: aiHistorySlice.reducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const {setSession, signOut, signInAsDemo, setGuestSession} = sessionSlice.actions;
export const {addReview} = aiHistorySlice.actions;

export default store;