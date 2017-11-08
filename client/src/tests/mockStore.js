import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

export const testState = {
    filters: {
        category: "All",
        sortByPost: "score",
        sortByComment: "score",
        isCreatingPost: false,
        isCreatingComment: false
    },
    categories: [
        { name: "All", path: "" },
        { name: "react", path: "react" },
        { name: "redux", path: "redux" },
        { name: "udacity", path: "udacity" },
    ],
    posts: {
        "8xf0y6ziyjabvozdd253nd": {
            id: "8xf0y6ziyjabvozdd253nd",
            timestamp: 1467166872634,
            title: "Udacity is the best place to learn React",
            body: "Everyone says so after all.",
            author: "thingtwo",
            category: "react",
            voteScore: 6,
            deleted: false
        },
        "6ni6ok3ym7mf1p33lnez": {
            id: "6ni6ok3ym7mf1p33lnez",
            timestamp: 1468479767190,
            title: "Learn Redux in 10 minutes!",
            body: "Just kidding. It takes more than 10 minutes to learn technology.",
            author: "thingone",
            category: "redux",
            voteScore: -5,
            deleted: false
        }
    }, 
    comments: {
        "8xf0y6ziyjabvozdd253nd": [
            {
                id: "894tuq4ut84ut8v4t8wun89g",
                parentId: "8xf0y6ziyjabvozdd253nd",
                timestamp: 1468166872634,
                body: "Hi there! I am a COMMENT.",
                author: "thingtwo",
                voteScore: 6,
                deleted: false,
                parentDeleted: false,
            },
            {
                id: "8tu4bsun805n8un48ve89",
                parentId: "8xf0y6ziyjabvozdd253nd",
                timestamp: 1469479767190,
                body: "Comments. Are. Cool.",
                author: "thingone",
                voteScore: -5,
                deleted: false,
                parentDeleted: false,
            }
        ]
    },
    changes: {
        editingPost: null,
        editingComment: null,
    }
}

const mockStore = configureStore([thunk])
export const store = mockStore(testState)
export const errorStore = mockStore({ ...testState, posts: { error: 'Error message' } })

export function createStoreWithState(newState) {
    const mockSt = configureStore([thunk])(newState)
    return mockSt
}


