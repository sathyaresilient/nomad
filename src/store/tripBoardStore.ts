import { create } from 'zustand';

export interface BoardPlace {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    rating: number;
    votes: number;
    addedBy: string; // userId
}

export interface BoardNote {
    id: string;
    title: string;
    content: string;
    color: 'yellow' | 'blue' | 'green' | 'pink';
    authorValues: {
        name: string;
        avatarUrl?: string;
    };
    timeAgo: string;
}

export interface Collaborator {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface TripBoardState {
    boardId: string | null;
    places: BoardPlace[];
    notes: BoardNote[];
    collaborators: Collaborator[];

    // Actions
    initializeBoard: (boardId: string) => void;
    addPlace: (place: Omit<BoardPlace, 'id' | 'votes'>) => void;
    votePlace: (placeId: string) => void;
    addNote: (note: Omit<BoardNote, 'id'>) => void;
    removeNote: (noteId: string) => void;
}

// Mock initial data
const INITIAL_PLACES: BoardPlace[] = [
    {
        id: '1',
        name: 'Time Out Market',
        category: 'Food Hall • Cais do Sodré',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        votes: 3,
        addedBy: 'user1',
    },
    {
        id: '2',
        name: 'Alfama District',
        category: 'Historic Neighborhood',
        imageUrl: 'https://images.unsplash.com/photo-1533512930430-671216973e6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        votes: 5,
        addedBy: 'user2',
    },
    {
        id: '3',
        name: 'Belém Tower',
        category: 'Landmark • Belém',
        imageUrl: 'https://images.unsplash.com/photo-1582234586676-e4176c66a870?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        votes: 2,
        addedBy: 'user1',
    }
];

const INITIAL_NOTES: BoardNote[] = [
    {
        id: '1',
        title: 'Flight Options',
        content: 'TAP Portugal implies a layover, maybe look at Ryanair for direct flights?',
        color: 'yellow',
        authorValues: { name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
        timeAgo: '2h ago',
    },
    {
        id: '2',
        title: 'Budget Goal',
        content: 'Aiming for $50/day excluding accommodation.',
        color: 'green',
        authorValues: { name: 'Mike', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
        timeAgo: '4h ago',
    }
];

const INITIAL_COLLABORATORS: Collaborator[] = [
    { id: '1', name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '2', name: 'Mike', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
    { id: '3', name: 'Elena', avatarUrl: 'https://i.pravatar.cc/150?u=elena' },
];

export const useTripBoardStore = create<TripBoardState>((set) => ({
    boardId: null,
    places: [],
    notes: [],
    collaborators: [],

    initializeBoard: (boardId) => {
        // In a real app, fetch from backend using boardId
        set({
            boardId,
            places: INITIAL_PLACES,
            notes: INITIAL_NOTES,
            collaborators: INITIAL_COLLABORATORS
        });
    },

    addPlace: (place) => {
        set((state) => ({
            places: [...state.places, { ...place, id: Date.now().toString(), votes: 0 }],
        }));
    },

    votePlace: (placeId) => {
        set((state) => ({
            places: state.places.map((p) =>
                p.id === placeId ? { ...p, votes: p.votes + 1 } : p
            ),
        }));
    },

    addNote: (note) => {
        set((state) => ({
            notes: [...state.notes, { ...note, id: Date.now().toString() }]
        }));
    },

    removeNote: (noteId) => {
        set((state) => ({
            notes: state.notes.filter(n => n.id !== noteId)
        }));
    }
}));
