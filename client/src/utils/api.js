const API_AUTH = process.env.REACT_APP_AUTH
const URL = process.env.REACT_APP_URL

const authHeaders= {
    headers: { 
        'Authorization': API_AUTH,
        'Content-Type': 'application/json'
    }
}

export function fetchCategories() {
    return fetch(`${URL}/categories`, authHeaders)
            .then(res => res.json())
            .then(({categories}) => categories)
}

export function fetchPosts(category = undefined) {
    if (category) {
        return fetch(`${URL}/${category}/posts`, authHeaders)
                .then(res => res.json())
                .then(posts => posts)
    }
    return fetch(`${URL}/posts`, authHeaders)
            .then(res => res.json())
            .then(posts => posts)

}

export function fetchPost(postId) {
    return fetch(`${URL}/posts/${postId}`, authHeaders)
        .then(res => res.json())
        .then(post => post)
}

export function savePost(post) {
    if (post.id) {
        const parameters = JSON.stringify({
            title: post.title,
            body: post.body,
            deleted: false
        })
        return fetch(`${URL}/posts/${post.id}`, { ...authHeaders, method: 'PUT', body: parameters })
            .then(res => res.json())
            .then(post => post)
    } else {
        const parameters = JSON.stringify({
            id: generateUUID(),
            timestamp: Date.now(),
            title: post.title,
            body: post.body,
            author: post.author,
            category: post.category
        })
        return fetch(`${URL}/posts`, { ...authHeaders, method: 'POST', body: parameters })
            .then(res => res.json())
            .then(post => post)
    }
}

export function saveComment(comment) {
    if (comment.id) {
        const parameters = JSON.stringify({
            timestamp: Date.now(),
            body: comment.body
        })
        return fetch(`${URL}/comments/${comment.id}`, { ...authHeaders, method: 'PUT', body: parameters })
            .then(res => res.json())
            .then(comment => comment)
    } else {
        const parameters = JSON.stringify({
            id: generateUUID(),
            timestamp: Date.now(),
            body: comment.body,
            author: comment.author,
            parentId: comment.parentId
        })
        return fetch(`${URL}/comments`, { ...authHeaders, method: 'POST', body: parameters })
            .then(res => res.json())
            .then(comment => comment)
    }
}

export function deleteContent(id, type) {
    const content = type === 'COMMENT' ? 'comments' : 'posts'
    return fetch(`${URL}/${content}/${id}`, { ...authHeaders, method: 'DELETE' })
        .then(res => res.json())
        .then(content => content)
}

export function voteOn(id, type, vote) {
    const content = type === 'COMMENT' ? 'comments' : 'posts'
    return fetch(`${URL}/${content}/${id}`, { ...authHeaders, method: 'POST', body: JSON.stringify({ option: vote }) })
        .then(res => res.json())
        .then(content => content)
}

export function fetchPostComments(postId) {
    return fetch(`${URL}/posts/${postId}/comments`, authHeaders)
        .then(res => res.json())
        .then(comments => comments)
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        // eslint-disable-next-line
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
