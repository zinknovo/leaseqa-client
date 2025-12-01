import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Role = "tenant" | "lawyer" | "admin";

type SessionState = {
  status: "authenticated" | "unauthenticated";
  user:
    | {
        id: string;
        name: string;
        email: string;
        role: Role;
        avatar: string;
      }
    | null;
};

type ReviewHistoryItem = {
  id: string;
  title: string;
  createdAt: string;
  status: "success" | "error";
};

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    status: "authenticated",
    user: {
      id: "demo-user",
      name: "Casey Tenant",
      email: "casey.tenant@leaseqa.test",
      role: "tenant" as Role,
      avatar: "/images/NEU.png",
    },
  } as SessionState,
  reducers: {
    signOut(state) {
      state.status = "unauthenticated";
      state.user = null;
    },
    signInAsDemo(
      state,
      action: PayloadAction<{ name: string; email: string; role?: Role }>
    ) {
      state.status = "authenticated";
      state.user = {
        id: `demo-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role || "tenant",
        avatar: "/images/NEU.png",
      };
    },
  },
});

const aiHistorySlice = createSlice({
  name: "aiHistory",
  initialState: {
    items: [
      {
        id: "review-1",
        title: "Back Bay sublease addendum",
        createdAt: "2024-11-02T10:00:00Z",
        status: "success" as const,
      },
      {
        id: "review-2",
        title: "Security deposit dispute draft",
        createdAt: "2024-10-30T16:30:00Z",
        status: "success" as const,
      },
    ],
  } as { items: ReviewHistoryItem[] },
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

export const { signOut, signInAsDemo } = sessionSlice.actions;
export const { addReview } = aiHistorySlice.actions;

export default store;
