function loadPosts() {
    fetch('http://127.0.0.1:5000/api/posts/feed')
        .then(res => res.json())
        .then(data => {
            const feedDiv = document.getElementById('feed');
            feedDiv.innerHTML = ''; 
            data.forEach(post => {
                feedDiv.innerHTML += `
                    <div class="post">
                        <div class="name">${post.first_name} ${post.last_name}</div>
                        <p>${post.content}</p>
                    </div>
                `;
            });
        });
}

function createPost() {
    const content = document.getElementById('postContent').value;
    if (!content) return; // لا تنشر إذا كان النص فارغاً

    fetch('http://127.0.0.1:5000/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content, user_id: 1 })
    })
    .then(() => {
        document.getElementById('postContent').value = ''; 
        loadPosts(); // تحديث المنشورات فوراً
    });
}

loadPosts(); // تحميل المنشورات عند أول فتح للصفحة

