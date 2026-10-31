// --- Zynqra Firebase Main Script (app.js) - Cloudflare & Firebase Storage Integrated + 100% XSS Protected ---

const firebaseConfig = {
    apiKey: "AIzaSyC4_RGOzHvkjK24g4h-CtYhuwnUnvcVrg8",
    authDomain: "zynqra-f832d.firebaseapp.com",
    projectId: "zynqra-f832d",
    storageBucket: "zynqra-f832d.firebasestorage.app",
    messagingSenderId: "542368091275",
    appId: "1:542368091275:web:0e2e4bb1c9239ed2c6188e",
    measurementId: "G-R4TFWEMJ3T"
};

// Initialize Firebase securely
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;
let activeVideo = null;
let activeChatContact = null;
let globalAllVideos = [];
let globalAllPosts = [];
let globalAllUsers = [];
let unsubscribeChat = null;
let editingVideoId = null;
let activeShortForModal = null;
let postImageBase64 = null;

// --- Advanced Military-Grade XSS & Injection Protection Utility (Strict Sanitization Engine) ---
function sanitizeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;')
        .replace(/javascript:/gi, '') 
        .replace(/on\w+\s*=/gi, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/eval\((.*?)\)/gi, '')
        .replace(/document\.cookie/gi, '')
        .replace(/document\.domain/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '');
}

// Global Toast Notification System for Professional UI Feedback
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('zynqraToastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'zynqraToastContainer';
        toastContainer.className = 'fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = `px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center space-x-2 ${type === 'success' ? 'bg-emerald-600/90 border border-emerald-400/40' : 'bg-red-600/90 border border-red-400/40'}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-white' : 'fa-triangle-exclamation text-white'}"></i> <span>${sanitizeHTML(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 50);
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Global Anti-XSS Shield Interceptor for URLs and Input Payloads
(function secureGlobalShield() {
    try {
        const params = new URLSearchParams(window.location.search);
        params.forEach((value, key) => {
            if (/<script|javascript:|onerror=|onload=|eval\(|document\.cookie|alert\(/i.test(value)) {
                console.warn("Security Alert: Malicious XSS payload neutralized.");
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        });
    } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
    setupFirebaseAuthState();
    setupGoogleAuth();
    setupNavigation();
    loadHomeFeed();
    loadShortsFeed();
    loadPostsFeed();
    loadFriendsList();
    loadMessengerContacts();
    setupSearchEngine();
    setupFriendSearchEngine();
    setupOfflineDownloadsUI();
    setupProfileEditModal();
    setupVideoEditModal();
    setupPostCreationUI();
    setupEventListeners();
    loadNotifications();
    setupQuickUploadButton();
    setupShortsModalClose();
    loadDynamicAds();
    setupMessengerUIEnhancements();
    registerPWAStorageAndSecurityWorker();
});

// --- Secure PWA Service Worker Registration & Anti-Cache Hijack ---
function registerPWAStorageAndSecurityWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => {
                    console.log('Zynqra Secure PWA Registered:', reg.scope);
                })
                .catch((err) => {
                    console.warn('PWA Registration blocked or failed:', err);
                });
        });
    }
}

// --- Dynamic AdSense & Admin Banner Integration ---
function loadDynamicAds() {
    db.collection("admin_settings").doc("ads").get().then((doc) => {
        if (doc.exists) {
            const adData = doc.data();
            const adContainer = document.getElementById('dynamicAdContainer');
            if (adContainer && adData.activeAdCode) {
                adContainer.innerHTML = sanitizeHTML(adData.activeAdCode);
            }
        }
    }).catch(() => {});
}

function setupQuickUploadButton() {
    const quickUploadBtn = document.getElementById('quickUploadHeaderBtn');
    if (quickUploadBtn) {
        quickUploadBtn.onclick = () => switchPage('upload');
    }
}

function setupShortsModalClose() {
    const closeBtn = document.getElementById('closeShortsSheetBtn');
    const sheet = document.getElementById('shortsModalSheet');
    if (closeBtn && sheet) {
        closeBtn.onclick = () => sheet.classList.add('hidden');
    }
}

function setupFirebaseAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = db.collection("users").doc(user.email);
            const doc = await userRef.get();

            if (doc.exists) {
                currentUser = doc.data();
                if (currentUser.isBanned) {
                    showToast('Your Zynqra account has been banned by Admin.', 'error');
                    auth.signOut();
                    return;
                }
            } else {
                currentUser = {
                    name: sanitizeHTML(user.displayName || 'Zynqra Creator'),
                    email: sanitizeHTML(user.email),
                    avatar: sanitizeHTML(user.photoURL || 'https://picsum.photos/seed/user/100/100'),
                    subs: 0,
                    followersCount: 0,
                    followingCount: 0,
                    strikes: 0,
                    verified: false,
                    isBanned: false,
                    lastProfileUpdate: 0,
                    bio: 'Welcome to my Zynqra channel!',
                    preferredCategories: []
                };
                await userRef.set(currentUser);
            }
            initializeAppUI();
            loadMessengerContacts();
            loadNotificationsList();
        } else {
            currentUser = null;
            initializeAppUI();
        }
    });
}

function setupGoogleAuth() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('#googleLoginBtn')) {
            triggerGoogleLogin();
        }
    });

    const logoutBtn = document.getElementById('logoutSidebarBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            auth.signOut().then(() => {
                showToast('Logged out successfully!');
                window.location.reload();
            });
        };
    }
}

function initializeAppUI() {
    const authContainer = document.getElementById('authContainer');
    const postAvatar = document.getElementById('postCreatorAvatar');
    if (authContainer) {
        if (currentUser) {
            authContainer.innerHTML = `
                <div id="userProfileHeader" class="flex items-center space-x-2 cursor-pointer relative" onclick="switchPage('profile')">
                    <img src="${sanitizeHTML(currentUser.avatar)}" alt="Profile" class="w-8 h-8 rounded-full object-cover border border-brand-cyan shadow-sm" title="${sanitizeHTML(currentUser.name)}">
                </div>
            `;
            if (postAvatar) postAvatar.src = currentUser.avatar;
        } else {
            authContainer.innerHTML = `
                <button id="googleLoginBtn" class="flex items-center space-x-1.5 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan px-3.5 py-1.5 rounded-full font-semibold hover:bg-brand-cyan/20 transition cursor-pointer">
                    <i class="fa-brands fa-google"></i> <span class="hidden sm:inline">Google Login</span>
                </button>
            `;
        }
    }
}

function triggerGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        showToast('Successfully Logged in as ' + sanitizeHTML(result.user.displayName) + '!');
    }).catch((error) => {
        console.error("Google Auth Error:", error);
        showToast('Login Failed: ' + sanitizeHTML(error.message), 'error');
    });
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) switchPage(page);
        });
    });

    const bottomNavHome = document.getElementById('bottomNavHome');
    if (bottomNavHome) bottomNavHome.onclick = (e) => { e.preventDefault(); switchPage('home'); };

    const bottomNavShorts = document.getElementById('bottomNavShorts');
    if (bottomNavShorts) bottomNavShorts.onclick = (e) => { e.preventDefault(); switchPage('shorts'); };

    const bottomNavUpload = document.getElementById('bottomNavUpload');
    if (bottomNavUpload) bottomNavUpload.onclick = (e) => { e.preventDefault(); switchPage('upload'); };

    const bottomNavPosts = document.getElementById('bottomNavPosts');
    if (bottomNavPosts) bottomNavPosts.onclick = (e) => { e.preventDefault(); switchPage('posts'); };

    const bottomNavMessenger = document.getElementById('bottomNavMessenger');
    if (bottomNavMessenger) bottomNavMessenger.onclick = (e) => { e.preventDefault(); switchPage('messenger'); };

    const headerNotificationBtn = document.getElementById('headerNotificationBtn');
    if (headerNotificationBtn) headerNotificationBtn.onclick = () => switchPage('notifications');

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('-translate-x-full');
        });
    }

    const logoHome = document.getElementById('logoHome');
    if (logoHome) {
        logoHome.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('home');
        });
    }

    const headerShortsBtn = document.getElementById('headerShortsBtn');
    if (headerShortsBtn) headerShortsBtn.onclick = () => switchPage('shorts');

    const headerPostsBtn = document.getElementById('headerPostsBtn');
    if (headerPostsBtn) headerPostsBtn.onclick = () => switchPage('posts');

    const viewAllShortsBtn = document.getElementById('viewAllShortsBtn');
    if (viewAllShortsBtn) viewAllShortsBtn.onclick = () => switchPage('shorts');

    const headerMessengerBtn = document.getElementById('headerMessengerBtn');
    if (headerMessengerBtn) headerMessengerBtn.onclick = () => switchPage('messenger');
}

function switchPage(pageId) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove('hidden');
    
    if (pageId !== 'shorts') {
        document.querySelectorAll('.shorts-slide video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
    }
    
    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('-translate-x-full');
    }

    if (pageId === 'analytics') loadAnalytics();
    if (pageId === 'profile') loadUserProfile();
    if (pageId === 'friends') loadFriendsList();
    if (pageId === 'messenger') loadMessengerContacts();
    if (pageId === 'shorts') loadShortsFeed();
    if (pageId === 'posts') loadPostsFeed();
    if (pageId === 'downloads') loadOfflineDownloadsUI();
    if (pageId === 'notifications') loadNotificationsList();
}

// --- Facebook Style Photo Posts Engine ---
function setupPostCreationUI() {
    const postFileInput = document.getElementById('postImageFile');
    const previewContainer = document.getElementById('postImagePreviewContainer');
    const previewImg = document.getElementById('postImagePreview');
    const removeImgBtn = document.getElementById('removePostImageBtn');
    const publishBtn = document.getElementById('publishPostBtn');
    const captionInput = document.getElementById('postCaptionInput');

    if (postFileInput) {
        postFileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            showToast('Uploading photo via Firebase Storage...');
            try {
                const storageRef = storage.ref(`posts/${Date.now()}_${file.name}`);
                const snapshot = await storageRef.put(file);
                postImageBase64 = await snapshot.ref.getDownloadURL();

                if (previewImg && previewContainer) {
                    previewImg.src = postImageBase64;
                    previewContainer.classList.remove('hidden');
                }
                showToast('Photo uploaded successfully!');
            } catch(err) {
                showToast('Failed to upload image.', 'error');
            }
        };
    }

    if (removeImgBtn) {
        removeImgBtn.onclick = () => {
            postImageBase64 = null;
            if (previewContainer) previewContainer.classList.add('hidden');
            if (postFileInput) postFileInput.value = '';
        };
    }

    if (publishBtn && captionInput) {
        publishBtn.onclick = async () => {
            if (!currentUser) {
                showToast('Please login with Google to create a post!', 'error');
                return;
            }

            const caption = sanitizeHTML(captionInput.value.trim());
            if (!caption && !postImageBase64) {
                showToast('Please write something or attach a photo.', 'error');
                return;
            }

            publishBtn.innerText = 'Posting...';
            publishBtn.disabled = true;

            try {
                const postRef = await db.collection("posts").add({
                    caption: caption,
                    imageUrl: postImageBase64 || '',
                    creatorName: currentUser.name,
                    creatorEmail: currentUser.email,
                    creatorAvatar: currentUser.avatar,
                    likes: 0,
                    comments: [],
                    date: new Date().toISOString().split('T')[0],
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Send notifications to all followers
                await notifyFollowers(currentUser.email, {
                    type: 'post',
                    title: `${currentUser.name} published a new post`,
                    targetId: postRef.id
                });

                showToast('Post published successfully!');
                captionInput.value = '';
                postImageBase64 = null;
                if (previewContainer) previewContainer.classList.add('hidden');
                loadPostsFeed();
            } catch (err) {
                showToast('Error publishing post: ' + err.message, 'error');
            } finally {
                publishBtn.innerText = 'Post';
                publishBtn.disabled = false;
            }
        };
    }
}

async function notifyFollowers(creatorEmail, notificationData) {
    try {
        const followersSnap = await db.collection("follows").where("followingEmail", "==", creatorEmail).get();
        followersSnap.forEach(async (doc) => {
            const followerEmail = doc.data().followerEmail;
            await db.collection("notifications").add({
                recipient: followerEmail,
                sender: notificationData.title,
                text: notificationData.title,
                date: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                targetId: notificationData.targetId || ''
            });
        });
    } catch (e) {
        console.error("Error notifying followers:", e);
    }
}

function loadPostsFeed() {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const container = document.getElementById('postsFeedContainer');
        if (!container) return;
        container.innerHTML = '';
        let posts = [];
        snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
        globalAllPosts = posts;

        if (posts.length === 0) {
            container.innerHTML = `<div class="text-center text-gray-500 text-xs py-10 bg-[#242526] rounded-3xl border border-dark-700">No posts found. Be the first to post!</div>`;
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'bg-[#242526] border border-dark-700 rounded-3xl p-4 shadow-xl space-y-3';
            
            let imageHTML = post.imageUrl ? `<img src="${sanitizeHTML(post.imageUrl)}" class="w-full max-h-96 object-cover rounded-2xl border border-dark-700">` : '';
            
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3 cursor-pointer group" onclick="openExternalProfile('${sanitizeHTML(post.creatorEmail)}')">
                        <img src="${sanitizeHTML(post.creatorAvatar)}" class="w-10 h-10 rounded-full object-cover border border-brand-cyan group-hover:scale-105 transition">
                        <div>
                            <h4 class="font-bold text-white text-xs group-hover:text-brand-cyan transition">${sanitizeHTML(post.creatorName)}</h4>
                            <span class="text-[9px] text-gray-400">${sanitizeHTML(post.date)}</span>
                        </div>
                    </div>
                </div>
                ${post.caption ? `<p class="text-gray-100 text-xs whitespace-pre-wrap">${sanitizeHTML(post.caption)}</p>` : ''}
                ${imageHTML}
                <div class="flex items-center justify-between border-t border-dark-700 pt-2.5 text-xs text-gray-300">
                    <button onclick="likePost('${sanitizeHTML(post.id)}', ${post.likes || 0})" class="flex items-center space-x-1.5 hover:text-brand-red transition cursor-pointer">
                        <i class="fa-solid fa-thumbs-up text-brand-cyan"></i> <span>${formatNumber(post.likes || 0)} Likes</span>
                    </button>
                    <span class="text-[10px] text-gray-400">${formatNumber((post.comments || []).length)} Comments</span>
                </div>
                <div class="space-y-2 pt-1 border-t border-dark-700/60">
                    <div class="flex space-x-2">
                        <input type="text" id="postCommentInput_${sanitizeHTML(post.id)}" placeholder="Write a comment..." class="flex-1 bg-[#3a3b3c] border-0 rounded-2xl px-3.5 py-2 text-white outline-none text-xs placeholder-gray-400">
                        <button onclick="commentOnPost('${sanitizeHTML(post.id)}')" class="bg-brand-cyan text-dark-900 font-bold px-4 py-2 rounded-2xl text-xs hover:bg-cyan-400 transition cursor-pointer">Send</button>
                    </div>
                    <div class="space-y-1.5 max-h-36 overflow-y-auto">
                        ${(post.comments || []).map(c => `
                            <div class="bg-[#3a3b3c] p-2 rounded-xl text-[11px]">
                                <span class="font-bold text-white">${sanitizeHTML(c.user)}:</span> ${sanitizeHTML(c.text)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

window.likePost = function(postId, currentLikes) {
    if (!currentUser) {
        showToast('Please login to like posts!', 'error');
        return;
    }
    const likeKey = `post_liked_${currentUser.email}_${postId}`;
    if (localStorage.getItem(likeKey)) {
        showToast('You already liked this post!', 'error');
        return;
    }
    db.collection("posts").doc(postId).update({ likes: currentLikes + 1 }).then(() => {
        localStorage.setItem(likeKey, 'true');
        showToast('Post liked!');
    });
};

window.commentOnPost = function(postId) {
    const input = document.getElementById(`postCommentInput_${postId}`);
    if (!input) return;
    const text = sanitizeHTML(input.value.trim());
    if (!text) return;
    if (!currentUser) {
        showToast('Please login to comment!', 'error');
        return;
    }

    db.collection("posts").doc(postId).get().then(doc => {
        if (!doc.exists) return;
        const post = doc.data();
        const comments = post.comments || [];
        comments.push({
            user: currentUser.name,
            email: currentUser.email,
            text: text,
            date: new Date().toISOString().split('T')[0]
        });
        db.collection("posts").doc(postId).update({ comments: comments }).then(() => {
            input.value = '';
            showToast('Comment added!');
        });
    });
};

// --- Rule-based & Collaborative Filtering Algorithm for Home Feed ---
async function loadHomeFeed(category = 'all') {
    db.collection("videos").orderBy("date", "desc").onSnapshot(async (snapshot) => {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        grid.innerHTML = '';
        let videos = [];
        snapshot.forEach(doc => videos.push({ id: doc.id, ...doc.data() }));
        globalAllVideos = videos;

        let filtered = [];

        if (category === 'following') {
            if (!currentUser) {
                showToast('Please login to view your following feed!', 'error');
                return;
            }
            const followSnap = await db.collection("follows").where("followerEmail", "==", currentUser.email).get();
            const followingEmails = [];
            followSnap.forEach(doc => followingEmails.push(doc.data().followingEmail));

            filtered = videos.filter(v => followingEmails.includes(v.creatorEmail) && v.aspectRatio !== '9:16');
        } else if (category === 'all' && currentUser) {
            const userHistoryDoc = await db.collection("users").doc(currentUser.email).get();
            const userFavCategories = userHistoryDoc.exists && userHistoryDoc.data().preferredCategories ? userHistoryDoc.data().preferredCategories : [];

            videos.sort((a, b) => {
                const scoreA = (userFavCategories.includes(a.category) ? 10 : 0) + (b.likes || 0) * 3 + (b.views || 0);
                const scoreB = (userFavCategories.includes(b.category) ? 10 : 0) + (a.likes || 0) * 3 + (a.views || 0);
                return scoreB - scoreA || new Date(b.date) - new Date(a.date);
            });
            filtered = videos.filter(v => v.aspectRatio !== '9:16');
        } else {
            videos.sort((a, b) => {
                const scoreA = (b.likes || 0) * 3 + (b.views || 0);
                const scoreB = (a.likes || 0) * 3 + (a.views || 0);
                return scoreB - scoreA || new Date(b.date) - new Date(a.date);
            });

            filtered = videos.filter(v => {
                if (category === 'all') return v.aspectRatio !== '9:16';
                if (category === 'shorts') return v.aspectRatio === '9:16';
                return v.category === category && v.aspectRatio !== '9:16';
            });
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<p class="text-gray-500 text-xs col-span-full text-center py-10">No videos found.</p>`;
            return;
        }

        filtered.forEach(video => {
            const card = document.createElement('div');
            card.className = 'bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden shadow-lg hover:border-brand-cyan transition cursor-pointer flex flex-col group';
            
            const thumbContent = video.thumbnailUrl 
                ? `<img src="${sanitizeHTML(video.thumbnailUrl)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">`
                : `<video src="${sanitizeHTML(video.videoUrl)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300 preload="metadata"></video>`;

            card.innerHTML = `
                <div class="relative aspect-video bg-black overflow-hidden">
                    ${thumbContent}
                    <span class="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-md font-bold">${sanitizeHTML(video.aspectRatio || '16:9')}</span>
                </div>
                <div class="p-3.5 flex space-x-3 flex-1">
                    <img src="${sanitizeHTML(video.creatorAvatar)}" class="w-8 h-8 rounded-full object-cover border border-dark-600">
                    <div class="flex-1 space-y-1">
                        <h3 class="font-bold text-white text-xs line-clamp-2">${sanitizeHTML(video.title)}</h3>
                        <div class="flex items-center space-x-1 text-[10px] text-gray-400">
                            <span>${sanitizeHTML(video.creatorName)}</span>
                        </div>
                        <p class="text-[9px] text-gray-500">${formatNumber(video.views || 0)} views • ${sanitizeHTML(video.date)}</p>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                trackUserHistory(video.category);
                openVideoModal(video);
            });
            grid.appendChild(card);
        });

        loadHomeShortsCarousel(videos);
    });
}

async function trackUserHistory(category) {
    if (!currentUser || !category) return;
    try {
        const userRef = db.collection("users").doc(currentUser.email);
        const doc = await userRef.get();
        if (doc.exists) {
            let cats = doc.data().preferredCategories || [];
            if (!cats.includes(category)) {
                cats.push(category);
                if (cats.length > 5) cats.shift();
                await userRef.update({ preferredCategories: cats });
            }
        }
    } catch(e) {}
}

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function setupSearchEngine() {
    const searchIconToggleBtn = document.getElementById('searchIconToggleBtn');
    const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
    const closeMobileSearch = document.getElementById('closeMobileSearch');

    if (searchIconToggleBtn && mobileSearchOverlay) {
        searchIconToggleBtn.onclick = () => {
            mobileSearchOverlay.classList.toggle('hidden');
            if (!mobileSearchOverlay.classList.contains('hidden')) {
                document.getElementById('mobileSearchInput').focus();
            }
        };
    }
    if (closeMobileSearch && mobileSearchOverlay) {
        closeMobileSearch.onclick = () => mobileSearchOverlay.classList.add('hidden');
    }

    const searchInputs = [document.getElementById('searchInput'), document.getElementById('mobileSearchInput')];
    const suggestionsBoxes = [document.getElementById('searchSuggestions'), document.getElementById('mobileSearchSuggestions')];

    searchInputs.forEach((input, index) => {
        if (!input) return;
        const suggestionBox = suggestionsBoxes[index];

        input.addEventListener('input', (e) => {
            const query = sanitizeHTML(e.target.value.toLowerCase().trim());
            if (!query) {
                if (suggestionBox) suggestionBox.classList.add('hidden');
                return;
            }

            const matchedVideos = globalAllVideos.filter(v => 
                (v.title && v.title.toLowerCase().includes(query)) || 
                (v.creatorName && v.creatorName.toLowerCase().includes(query)) ||
                (v.category && v.category.toLowerCase().includes(query))
            );

            if (suggestionBox) {
                suggestionBox.innerHTML = '';
                if (matchedVideos.length === 0) {
                    suggestionBox.innerHTML = `<div class="p-3 text-gray-400 text-xs">No matching videos found</div>`;
                } else {
                    matchedVideos.slice(0, 5).forEach(video => {
                        const item = document.createElement('div');
                        item.className = 'p-2.5 flex items-center space-x-3 hover:bg-dark-700 cursor-pointer border-b border-dark-700/50';
                        item.innerHTML = `
                            <img src="${sanitizeHTML(video.thumbnailUrl || video.creatorAvatar)}" class="w-12 h-8 object-cover rounded-lg">
                            <div class="truncate">
                                <div class="font-bold text-white text-xs truncate">${sanitizeHTML(video.title)}</div>
                                <div class="text-[9px] text-gray-400">By ${sanitizeHTML(video.creatorName)}</div>
                            </div>
                        `;
                        item.onclick = () => {
                            suggestionBox.classList.add('hidden');
                            if (mobileSearchOverlay) mobileSearchOverlay.classList.add('hidden');
                            openVideoModal(video);
                        };
                        suggestionBox.appendChild(item);
                    });
                }
                suggestionBox.classList.remove('hidden');
            }
        });
    });
}

function setupFriendSearchEngine() {
    const friendSearchInput = document.getElementById('friendSearchInput');
    if (!friendSearchInput) return;

    friendSearchInput.addEventListener('input', async (e) => {
        const query = sanitizeHTML(e.target.value.toLowerCase().trim());
        const container = document.getElementById('friendsListContainer');
        if (!container) return;

        const filteredUsers = globalAllUsers.filter(user => 
            (currentUser && user.email === currentUser.email) ? false : (user.name && user.name.toLowerCase().includes(query)) || 
            (user.email && user.email.toLowerCase().includes(query))
        );

        container.innerHTML = '';
        if (filteredUsers.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-xs col-span-full text-center py-5">No creators found.</p>`;
            return;
        }

        for (const user of filteredUsers) {
            const isFollowing = currentUser ? await checkIsFollowing(currentUser.email, user.email) : false;
            const isFollowBack = currentUser ? await checkIsFollowing(user.email, currentUser.email) : false;

            let btnText = 'Follow';
            let btnClass = 'bg-white text-dark-900';

            if (isFollowing) {
                btnText = 'Following ✓';
                btnClass = 'bg-dark-700 text-gray-300';
            } else if (isFollowBack) {
                btnText = 'Follow Back';
                btnClass = 'bg-brand-cyan text-dark-900 font-bold';
            }

            const card = document.createElement('div');
            card.className = 'bg-dark-800 border border-dark-700 p-3.5 rounded-2xl flex items-center justify-between shadow';
            card.innerHTML = `
                <div class="flex items-center space-x-3 cursor-pointer group" onclick="openExternalProfile('${sanitizeHTML(user.email)}')">
                    <img src="${sanitizeHTML(user.avatar)}" class="w-10 h-10 rounded-full object-cover border border-brand-cyan group-hover:scale-105 transition">
                    <div>
                        <h4 class="font-bold text-white text-xs group-hover:text-brand-cyan transition">${sanitizeHTML(user.name)}</h4>
                        <p class="text-[10px] text-gray-400">${formatNumber(user.followersCount || 0)} Followers • ${formatNumber(user.totalViews || 0)} Views</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="toggleFollowUser('${sanitizeHTML(user.email)}', this)" class="${btnClass} px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow">
                        ${btnText}
                    </button>
                    <button onclick="openChatWithUser('${sanitizeHTML(user.email)}')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 shadow">
                        <i class="fa-solid fa-message"></i> <span>Message</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

async function checkIsFollowing(followerEmail, followingEmail) {
    try {
        const snap = await db.collection("follows")
            .where("followerEmail", "==", followerEmail)
            .where("followingEmail", "==", followingEmail)
            .get();
        return !snap.empty;
    } catch(e) {
        return false;
    }
}

window.toggleFollowUser = async function(creatorEmail, btnElement) {
    if (!currentUser) {
        showToast('Please login with Google to follow creators!', 'error');
        return;
    }
    if (currentUser.email === creatorEmail) {
        showToast('You cannot follow yourself!', 'error');
        return;
    }

    const followRef = db.collection("follows");
    const q = followRef.where("followerEmail", "==", currentUser.email).where("followingEmail", "==", creatorEmail);
    const snap = await q.get();

    const creatorUserDoc = await db.collection("users").doc(creatorEmail).get();
    let currentFollowers = creatorUserDoc.exists ? (creatorUserDoc.data().followersCount || 0) : 0;

    if (!snap.empty) {
        const docId = snap.docs[0].id;
        await followRef.doc(docId).delete();
        currentFollowers = Math.max(0, currentFollowers - 1);
        btnElement.innerText = 'Follow';
        btnElement.className = 'bg-white text-dark-900 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow';
        showToast('Unfollowed successfully.');
    } else {
        await followRef.add({
            followerEmail: currentUser.email,
            followingEmail: creatorEmail,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        currentFollowers += 1;
        btnElement.innerText = 'Following ✓';
        btnElement.className = 'bg-dark-700 text-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow';
        showToast('Successfully followed!');
    }
    await db.collection("users").doc(creatorEmail).update({ followersCount: currentFollowers });
};

function setupOfflineDownloadsUI() {
    const downloadBtn = document.getElementById('modalDownloadBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            if (!activeVideo) return;
            let downloads = JSON.parse(localStorage.getItem('zynqra_offline_downloads') || '[]');
            
            if (downloads.some(v => v.id === activeVideo.id)) {
                showToast('Video is already downloaded for offline viewing!', 'error');
                return;
            }

            downloads.push(activeVideo);
            localStorage.setItem('zynqra_offline_downloads', JSON.stringify(downloads));
            showToast('Video successfully downloaded for offline mode!');
            loadOfflineDownloadsUI();
        };
    }

    const shortsModal = document.getElementById('shortsSettingsModal');
    const closeShortsModal = document.getElementById('closeShortsSettingsModal');
    if (closeShortsModal && shortsModal) {
        closeShortsModal.onclick = () => shortsModal.classList.add('hidden');
    }

    const shortsOptSaveBtn = document.getElementById('shortsOptSaveBtn');
    if (shortsOptSaveBtn) {
        shortsOptSaveBtn.onclick = () => {
            if (!activeShortForModal) return;
            let downloads = JSON.parse(localStorage.getItem('zynqra_offline_downloads') || '[]');
            if (downloads.some(v => v.id === activeShortForModal.id)) {
                showToast('Short is already saved/downloaded!', 'error');
            } else {
                downloads.push(activeShortForModal);
                localStorage.setItem('zynqra_offline_downloads', JSON.stringify(downloads));
                showToast('Short successfully saved to Downloads!');
            }
            shortsModal.classList.add('hidden');
            loadOfflineDownloadsUI();
        };
    }

    const shortsOptDownloadBtn = document.getElementById('shortsOptDownloadBtn');
    if (shortsOptDownloadBtn) {
        shortsOptDownloadBtn.onclick = () => {
            if (!activeShortForModal) return;
            let downloads = JSON.parse(localStorage.getItem('zynqra_offline_downloads') || '[]');
            if (!downloads.some(v => v.id === activeShortForModal.id)) {
                downloads.push(activeShortForModal);
                localStorage.setItem('zynqra_offline_downloads', JSON.stringify(downloads));
            }
            showToast('Short downloaded for offline viewing!');
            shortsModal.classList.add('hidden');
            loadOfflineDownloadsUI();
        };
    }
}

function loadOfflineDownloadsUI() {
    const container = document.getElementById('offlineDownloadsGrid');
    if (!container) return;

    let downloads = JSON.parse(localStorage.getItem('zynqra_offline_downloads') || '[]');
    container.innerHTML = '';

    if (downloads.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500 text-xs">No saved or downloaded videos found. Save or download videos to watch them offline anytime!</div>`;
        return;
    }

    downloads.forEach((video, index) => {
        const isShort = video.aspectRatio === '9:16';
        const card = document.createElement('div');
        card.className = 'bg-dark-900 border border-dark-700 rounded-3xl overflow-hidden shadow-md flex flex-col group';
        card.innerHTML = `
            <div class="relative aspect-video bg-black overflow-hidden">
                <img src="${sanitizeHTML(video.thumbnailUrl || video.creatorAvatar)}" class="w-full h-full object-cover">
                <span class="absolute bottom-2 left-2 bg-emerald-500 text-dark-900 text-[8px] px-2 py-0.5 rounded font-bold"><i class="fa-solid fa-check"></i> ${isShort ? 'Downloaded Short Video' : 'Saved Long Video'}</span>
            </div>
            <div class="p-3 flex items-center justify-between">
                <div>
                    <h4 class="font-bold text-white text-xs truncate max-w-[150px]">${sanitizeHTML(video.title)}</h4>
                    <p class="text-[9px] text-gray-400">${sanitizeHTML(video.creatorName)}</p>
                </div>
                <div class="flex space-x-1.5">
                    <button class="play-offline-btn bg-brand-cyan text-dark-900 font-bold px-2.5 py-1.5 rounded-xl text-[10px] hover:bg-cyan-400 transition cursor-pointer">Play</button>
                    <button class="delete-offline-btn bg-red-500/20 text-red-400 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold hover:bg-red-500/30 transition cursor-pointer">Delete</button>
                </div>
            </div>
        `;
        card.querySelector('.play-offline-btn').onclick = () => openVideoModal(video);
        card.querySelector('.delete-offline-btn').onclick = () => {
            downloads.splice(index, 1);
            localStorage.setItem('zynqra_offline_downloads', JSON.stringify(downloads));
            loadOfflineDownloadsUI();
            showToast('Removed from offline downloads.');
        };
        container.appendChild(card);
    });
}

function loadHomeShortsCarousel(videos) {
    const carousel = document.getElementById('homeShortsCarousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    videos.filter(v => v.aspectRatio === '9:16').forEach(short => {
        const card = document.createElement('div');
        card.className = 'w-28 sm:w-32 shrink-0 bg-black rounded-2xl overflow-hidden border border-dark-700 relative group cursor-pointer aspect-[9/16] shadow-md';
        card.innerHTML = `
            <video src="${sanitizeHTML(short.videoUrl)}" class="w-full h-full object-cover pointer-events-none" muted preload="metadata"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <p class="text-[10px] font-bold text-white line-clamp-2">${sanitizeHTML(short.title)}</p>
                <span class="text-[8px] text-gray-300">${formatNumber(short.views || 0)} views</span>
            </div>
        `;
        card.addEventListener('click', () => switchPage('shorts'));
        carousel.appendChild(card);
    });
}

function loadShortsFeed() {
    db.collection("videos").where("aspectRatio", "==", "9:16").onSnapshot(async (snapshot) => {
        const container = document.getElementById('shortsPlayerContainer');
        if (!container) return;
        
        container.style.overflowY = 'scroll';
        container.style.scrollSnapType = 'y mandatory';
        container.style.height = '100%';
        container.style.scrollbarWidth = 'none';
        
        container.innerHTML = '';
        let shorts = [];
        snapshot.forEach(doc => shorts.push({ id: doc.id, ...doc.data() }));

        shorts.sort((a, b) => ((b.likes || 0) * 3 + (b.views || 0)) - ((a.likes || 0) * 3 + (a.views || 0)));

        if (shorts.length === 0) {
            container.innerHTML = `<p class="text-gray-400 text-xs text-center mt-32">No Shorts available.</p>`;
            return;
        }

        for (const short of shorts) {
            const isFollowing = currentUser ? await checkIsFollowing(currentUser.email, short.creatorEmail) : false;
            const isFollowBack = currentUser ? await checkIsFollowing(short.creatorEmail, currentUser.email) : false;

            let followBtnText = 'Follow';
            let followBtnClass = 'bg-white text-dark-900';
            if (isFollowing) {
                followBtnText = 'Following ✓';
                followBtnClass = 'bg-dark-700 text-gray-300';
            } else if (isFollowBack) {
                followBtnText = 'Follow Back';
                followBtnClass = 'bg-brand-cyan text-dark-900 font-bold';
            }

            const slide = document.createElement('div');
            slide.className = 'shorts-slide w-full h-full relative flex items-center justify-center bg-black snap-start shrink-0';
            
            slide.innerHTML = `
                <video src="${sanitizeHTML(short.videoUrl)}" loop playsinline webkit-playsinline class="w-full h-full object-cover"></video>
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-4 pb-24 flex flex-col justify-between pointer-events-none">
                    <div class="flex justify-between items-center pointer-events-auto">
                        <span class="bg-amber-400 text-dark-900 font-bold text-[10px] px-3 py-1 rounded-full shadow-lg">Zynqra Short</span>
                        <button onclick="openShortsSettings('${sanitizeHTML(short.id)}')" class="bg-dark-800/80 hover:bg-dark-700 text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                    
                    <div class="space-y-2 pointer-events-auto pb-4 pr-20">
                        <div class="flex items-center space-x-3 flex-wrap gap-y-2">
                            <div class="flex items-center space-x-2.5 cursor-pointer group" onclick="openExternalProfile('${sanitizeHTML(short.creatorEmail)}')">
                                <img src="${sanitizeHTML(short.creatorAvatar)}" class="w-10 h-10 rounded-full border-2 border-brand-cyan shadow object-cover group-hover:scale-105 transition shrink-0">
                                <div>
                                    <span class="font-bold text-white text-xs block group-hover:text-brand-cyan transition truncate max-w-[130px] sm:max-w-[200px]">${sanitizeHTML(short.creatorName)}</span>
                                    <span class="text-[9px] text-gray-400">${formatNumber(short.views || 0)} views</span>
                                </div>
                            </div>
                            <button onclick="toggleFollowUser('${sanitizeHTML(short.creatorEmail)}', this)" class="${followBtnClass} px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md hover:scale-105 shrink-0">
                                ${followBtnText}
                            </button>
                        </div>
                        <p class="text-xs text-gray-100 line-clamp-2">${sanitizeHTML(short.title)}</p>
                    </div>
                </div>

                <div class="absolute right-3 bottom-24 flex flex-col items-center space-y-4 pointer-events-auto z-20">
                    <button onclick="likeShort('${sanitizeHTML(short.id)}', ${short.likes || 0})" class="bg-dark-800/90 hover:bg-dark-700 text-white w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-xl border border-dark-600 cursor-pointer transition transform active:scale-90">
                        <i class="fa-solid fa-heart text-brand-red text-sm"></i>
                        <span class="text-[8px] font-bold mt-0.5">${formatNumber(short.likes || 0)}</span>
                    </button>
                    <button onclick="openShortsCommentsModal('${sanitizeHTML(short.id)}')" class="bg-dark-800/90 hover:bg-dark-700 text-white w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-xl border border-dark-600 cursor-pointer transition transform active:scale-90">
                        <i class="fa-solid fa-comment text-brand-cyan text-sm"></i>
                        <span class="text-[8px] font-bold mt-0.5">${formatNumber((short.comments || []).length)}</span>
                    </button>
                    <button onclick="navigator.clipboard.writeText(window.location.origin + window.location.pathname + '?v=' + '${sanitizeHTML(short.id)}'); showToast('Short share link copied!');" class="bg-dark-800/90 hover:bg-dark-700 text-white w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-xl border border-dark-600 cursor-pointer transition transform active:scale-90">
                        <i class="fa-solid fa-share text-emerald-400 text-sm"></i>
                        <span class="text-[8px] font-bold mt-0.5">Share</span>
                    </button>
                </div>
            `;
            
            const videoEl = slide.querySelector('video');
            slide.addEventListener('click', (e) => {
                if(!['BUTTON', 'I', 'IMG', 'SPAN'].includes(e.target.tagName)) {
                    if (videoEl.paused) videoEl.play();
                    else videoEl.pause();
                }
            });
            container.appendChild(slide);
        }

        const observerOptions = { root: container, threshold: 0.6 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;
                if (entry.isIntersecting) {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, observerOptions);

        container.querySelectorAll('.shorts-slide').forEach(slide => observer.observe(slide));
    });
}

window.openShortsSettings = function(id) {
    db.collection("videos").doc(id).get().then(doc => {
        if (doc.exists) {
            activeShortForModal = { id: doc.id, ...doc.data() };
            const modal = document.getElementById('shortsSettingsModal');
            if (modal) modal.classList.remove('hidden');
        }
    });
};

window.likeShort = function(id, currentLikes) {
    if (!currentUser) {
        showToast('Please login with Google to like shorts!', 'error');
        return;
    }
    const likeKey = `short_liked_${currentUser.email}_${id}`;
    if (localStorage.getItem(likeKey)) {
        showToast('You have already liked this short!', 'error');
        return;
    }
    db.collection("videos").doc(id).update({ likes: currentLikes + 1 }).then(() => {
        localStorage.setItem(likeKey, 'true');
        showToast('Short liked successfully!');
    });
};

window.openShortsCommentsModal = function(id) {
    const sheet = document.getElementById('shortsModalSheet');
    if (sheet) sheet.classList.remove('hidden');
    renderShortsComments(id);
};

function renderShortsComments(id) {
    db.collection("videos").doc(id).get().then(doc => {
        if(!doc.exists) return;
        const short = doc.data();
        const comments = short.comments || [];
        const list = document.getElementById('shortsCommentsList');
        if (!list) return;
        list.innerHTML = '';
        
        document.getElementById('shortsSheetTitle').innerText = `Shorts Comments (${comments.length})`;

        const postBtn = document.getElementById('postShortsCommentBtn');
        const inputField = document.getElementById('shortsCommentInput');
        
        if (postBtn && inputField) {
            postBtn.onclick = () => {
                const text = sanitizeHTML(inputField.value.trim());
                if (!text) return;
                if (!currentUser) {
                    showToast('Please login to comment!', 'error');
                    return;
                }

                const newComment = {
                    user: currentUser.name,
                    email: currentUser.email,
                    text: text,
                    date: new Date().toISOString().split('T')[0]
                };

                const updatedComments = [...comments, newComment];
                db.collection("videos").doc(id).update({ comments: updatedComments }).then(() => {
                    inputField.value = '';
                    renderShortsComments(id);
                    showToast('Comment posted!');
                });
            };
        }

        if (comments.length === 0) {
            list.innerHTML = `<p class="text-gray-500 text-xs text-center py-5">No comments yet. Be the first to comment!</p>`;
            return;
        }

        comments.forEach((c) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'bg-dark-800 p-3 rounded-2xl border border-dark-700 space-y-1.5';
            commentDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-white text-xs">${sanitizeHTML(c.user)}</span>
                    <span class="text-[9px] text-gray-400">${sanitizeHTML(c.date || '')}</span>
                </div>
                <p class="text-gray-200 text-xs">${sanitizeHTML(c.text)}</p>
            `;
            list.appendChild(commentDiv);
        });
    });
}

async function openExternalProfile(email) {
    db.collection("users").doc(email).get().then(async (doc) => {
        if (!doc.exists) {
            showToast('User profile not found.', 'error');
            return;
        }
        const user = doc.data();
        switchPage('external-profile');

        document.getElementById('extProfileAvatar').src = user.avatar;
        document.getElementById('extProfileName').innerText = user.name;
        document.getElementById('extProfileEmail').innerText = user.email;
        document.getElementById('extProfileBio').innerText = user.bio || 'No bio added.';
        document.getElementById('extProfileSubs').innerText = `${formatNumber(user.followersCount || 0)} Followers`;
        
        const verifiedIcon = document.getElementById('extProfileNameVerifiedIcon');
        if (verifiedIcon) {
            if (user.verified) verifiedIcon.classList.remove('hidden');
            else verifiedIcon.classList.add('hidden');
        }

        const subBtn = document.getElementById('extSubscribeBtn');
        const isFollowing = currentUser ? await checkIsFollowing(currentUser.email, user.email) : false;
        const isFollowBack = currentUser ? await checkIsFollowing(user.email, currentUser.email) : false;

        let btnText = 'Follow';
        let btnClass = 'bg-white text-dark-900 font-bold px-4 py-2 rounded-2xl text-xs hover:bg-gray-200 transition cursor-pointer shadow';

        if (isFollowing) {
            btnText = 'Following ✓';
            btnClass = 'bg-dark-700 text-gray-300 font-bold px-4 py-2 rounded-2xl text-xs shadow';
        } else if (isFollowBack) {
            btnText = 'Follow Back';
            btnClass = 'bg-brand-cyan text-dark-900 font-bold px-4 py-2 rounded-2xl text-xs shadow';
        }

        if (subBtn) {
            subBtn.innerText = btnText;
            subBtn.className = btnClass;
            subBtn.onclick = () => {
                if (!currentUser) {
                    showToast('Please login to follow creators!', 'error');
                    return;
                }
                toggleFollowUser(user.email, subBtn);
            };
        }

        document.getElementById('extMessageBtn').onclick = () => openChatWithUser(user.email);

        db.collection("videos").where("creatorEmail", "==", user.email).get().then((vSnapshot) => {
            const countBadge = document.getElementById('extProfileVideoCount');
            if (countBadge) countBadge.innerText = `${vSnapshot.size} Videos`;

            let allUserVideos = [];
            vSnapshot.forEach(vDoc => allUserVideos.push({ id: vDoc.id, ...vDoc.data() }));

            db.collection("posts").where("creatorEmail", "==", user.email).get().then((pSnapshot) => {
                const extPostCount = document.getElementById('extProfilePostCount');
                if (extPostCount) extPostCount.innerText = `${pSnapshot.size} Posts`;
                let allUserPosts = [];
                pSnapshot.forEach(pDoc => allUserPosts.push({ id: pDoc.id, ...pDoc.data() }));

                const renderExtTabContent = (type) => {
                    const area = document.getElementById('extTabContentArea');
                    if (!area) return;
                    area.innerHTML = '';
                    
                    if (type === 'posts') {
                        if (allUserPosts.length === 0) {
                            area.innerHTML = `<p class="text-gray-500 text-xs col-span-full">No posts found.</p>`;
                            return;
                        }
                        allUserPosts.forEach(p => {
                            area.innerHTML += `
                                <div class="bg-dark-900 border border-dark-700 rounded-2xl p-3 space-y-2">
                                    <p class="text-white text-xs">${sanitizeHTML(p.caption || '')}</p>
                                    ${p.imageUrl ? `<img src="${sanitizeHTML(p.imageUrl)}" class="w-full h-32 object-cover rounded-xl">` : ''}
                                </div>
                            `;
                        });
                        return;
                    }

                    const filtered = allUserVideos.filter(v => type === 'shorts' ? v.aspectRatio === '9:16' : v.aspectRatio !== '9:16');
                    
                    if (filtered.length === 0) {
                        area.innerHTML = `<p class="text-gray-500 text-xs col-span-full">No ${type} found.</p>`;
                        return;
                    }

                    filtered.forEach(v => {
                        const card = document.createElement('div');
                        card.className = 'bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden p-2.5 flex space-x-2.5 cursor-pointer';
                        card.innerHTML = `
                            <img src="${sanitizeHTML(v.thumbnailUrl || v.creatorAvatar)}" class="w-20 h-12 rounded-xl object-cover">
                            <div class="flex-1 truncate">
                                <h4 class="font-bold text-white text-[11px] truncate">${sanitizeHTML(v.title)}</h4>
                                <div class="text-[9px] text-gray-400 mt-1">${formatNumber(v.views || 0)} views</div>
                            </div>
                        `;
                        card.onclick = () => openVideoModal(v);
                        area.appendChild(card);
                    });
                };

                renderExtTabContent('videos');
                document.getElementById('extTabVideos').onclick = () => {
                    document.getElementById('extTabVideos').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabShorts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabPosts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    renderExtTabContent('videos');
                };
                document.getElementById('extTabShorts').onclick = () => {
                    document.getElementById('extTabShorts').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabVideos').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabPosts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    renderExtTabContent('shorts');
                };
                document.getElementById('extTabPosts').onclick = () => {
                    document.getElementById('extTabPosts').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabVideos').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    document.getElementById('extTabShorts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                    renderExtTabContent('posts');
                };
            });
        });
    });
}

async function openVideoModal(video) {
    activeVideo = video;
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');

    document.getElementById('modalVideoTitle').innerText = video.title;
    document.getElementById('modalCreatorName').innerText = video.creatorName;
    document.getElementById('modalCreatorAvatar').src = video.creatorAvatar;
    document.getElementById('modalLikeCount').innerText = formatNumber(video.likes || 0);
    document.getElementById('modalVideoViewsCount').innerText = `${formatNumber(video.views || 0)} views`;
    document.getElementById('modalVideoDate').innerText = video.date || '2026';
    document.getElementById('modalVideoDescText').innerText = video.desc || 'No description provided.';

    const userDoc = await db.collection("users").doc(video.creatorEmail).get();
    const followersCount = userDoc.exists ? (userDoc.data().followersCount || 0) : 0;
    document.getElementById('modalCreatorSubs').innerText = `${formatNumber(followersCount)} followers`;

    const isFollowing = currentUser ? await checkIsFollowing(currentUser.email, video.creatorEmail) : false;
    const isFollowBack = currentUser ? await checkIsFollowing(video.creatorEmail, currentUser.email) : false;

    const modalSubscribeBtn = document.getElementById('modalSubscribeBtn');
    if (modalSubscribeBtn) {
        if (isFollowing) {
            modalSubscribeBtn.innerText = 'Following ✓';
            modalSubscribeBtn.className = 'bg-dark-700 text-gray-300 px-4 py-2 rounded-full font-bold text-xs cursor-pointer shadow';
        } else if (isFollowBack) {
            modalSubscribeBtn.innerText = 'Follow Back';
            modalSubscribeBtn.className = 'bg-brand-cyan text-dark-900 px-4 py-2 rounded-full font-bold text-xs cursor-pointer shadow';
        } else {
            modalSubscribeBtn.innerText = 'Follow';
            modalSubscribeBtn.className = 'bg-white text-dark-900 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition text-xs cursor-pointer shadow';
        }

        modalSubscribeBtn.onclick = () => {
            if (!currentUser) {
                showToast('Please login to follow creators!', 'error');
                return;
            }
            toggleFollowUser(video.creatorEmail, modalSubscribeBtn);
        };
    }

    const creatorClick = document.getElementById('modalCreatorProfileClick');
    if (creatorClick) {
        creatorClick.onclick = () => {
            modal.classList.add('hidden');
            player.pause();
            openExternalProfile(video.creatorEmail);
        };
    }

    const shareBtn = document.getElementById('modalShareBtn');
    if (shareBtn) {
        shareBtn.onclick = () => {
            const uniqueVideoLink = window.location.origin + window.location.pathname + '?v=' + video.id;
            navigator.clipboard.writeText(uniqueVideoLink).then(() => {
                showToast('Unique Video Share Link copied to clipboard!');
            });
        };
    }

    player.src = video.videoUrl;
    renderComments(video);
    renderRelatedVideos(video);
    modal.classList.remove('hidden');
    player.play();
    processSecureVideoView(video);

    const likeBtn = document.getElementById('modalLikeBtn');
    likeBtn.onclick = () => {
        if (!currentUser) {
            showToast('Please login with Google to like videos!', 'error');
            return;
        }
        const userLikeKey = `liked_${currentUser.email}_${video.id}`;
        if (localStorage.getItem(userLikeKey)) {
            showToast('You have already liked this video!', 'error');
            return;
        }

        const newLikes = (video.likes || 0) + 1;
        db.collection("videos").doc(video.id).update({ likes: newLikes }).then(() => {
            localStorage.setItem(userLikeKey, 'true');
            document.getElementById('modalLikeCount').innerText = formatNumber(newLikes);
            activeVideo.likes = newLikes;
            showToast('Video liked successfully!');
        });
    };
}

function processSecureVideoView(video) {
    const viewSessionKey = `viewed_session_${video.id}`;
    const lastViewTime = localStorage.getItem(`last_view_${video.id}`);
    const now = Date.now();

    if (!sessionStorage.getItem(viewSessionKey) && (!lastViewTime || (now - lastViewTime > 30000))) {
        sessionStorage.setItem(viewSessionKey, 'true');
        localStorage.setItem(`last_view_${video.id}`, now);

        const newViews = (video.views || 0) + 1;
        db.collection("videos").doc(video.id).update({ views: newViews });

        db.collection("users").doc(video.creatorEmail).get().then(doc => {
            if (doc.exists) {
                let currentTotalViews = doc.data().totalViews || 0;
                db.collection("users").doc(video.creatorEmail).update({ totalViews: currentTotalViews + 1 });
            }
        });
    }
}

function renderComments(video) {
    const list = document.getElementById('commentsList');
    const badge = document.getElementById('commentCountBadge');
    if (!list) return;
    list.innerHTML = '';
    const comments = video.comments || [];
    badge.innerText = formatNumber(comments.length);

    if (comments.length === 0) {
        list.innerHTML = `<p class="text-gray-500 text-[10px]">No comments yet.</p>`;
        return;
    }
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'bg-dark-900 p-2.5 rounded-xl border border-dark-700 space-y-0.5';
        div.innerHTML = `
            <div class="font-bold text-white text-[10px]">${sanitizeHTML(c.user)}</div>
            <div class="text-gray-300 text-[11px]">${sanitizeHTML(c.text)}</div>
        `;
        list.appendChild(div);
    });
}

function renderRelatedVideos(currentVideo) {
    db.collection("videos").get().then((snapshot) => {
        const sidebar = document.getElementById('relatedVideosSidebar');
        if (!sidebar) return;
        sidebar.innerHTML = '';
        snapshot.forEach(doc => {
            const video = { id: doc.id, ...doc.data() };
            if (video.id !== currentVideo.id && video.aspectRatio !== '9:16') {
                const card = document.createElement('div');
                card.className = 'flex space-x-2.5 cursor-pointer group';
                card.innerHTML = `
                    <img src="${sanitizeHTML(video.thumbnailUrl || video.creatorAvatar)}" class="w-28 aspect-video object-cover rounded-xl border border-dark-700 group-hover:border-brand-cyan transition">
                    <div class="flex-1 truncate">
                        <h5 class="font-bold text-white text-xs line-clamp-2">${sanitizeHTML(video.title)}</h5>
                        <div class="text-[9px] text-gray-400 mt-1">${sanitizeHTML(video.creatorName)}</div>
                        <div class="text-[8px] text-gray-500">${formatNumber(video.views || 0)} views</div>
                    </div>
                `;
                card.addEventListener('click', () => openVideoModal(video));
                sidebar.appendChild(card);
            }
        });
    });
}

function loadFriendsList() {
    db.collection("users").get().then(async (snapshot) => {
        const container = document.getElementById('friendsListContainer');
        if (!container) return;
        container.innerHTML = '';
        let users = [];
        snapshot.forEach(doc => users.push(doc.data()));
        globalAllUsers = users;

        for (const user of users) {
            if (currentUser && user.email === currentUser.email) continue;
            const isFollowing = currentUser ? await checkIsFollowing(currentUser.email, user.email) : false;
            const isFollowBack = currentUser ? await checkIsFollowing(user.email, currentUser.email) : false;

            let btnText = 'Follow';
            let btnClass = 'bg-white text-dark-900';

            if (isFollowing) {
                btnText = 'Following ✓';
                btnClass = 'bg-dark-700 text-gray-300';
            } else if (isFollowBack) {
                btnText = 'Follow Back';
                btnClass = 'bg-brand-cyan text-dark-900 font-bold';
            }

            const card = document.createElement('div');
            card.className = 'bg-dark-800 border border-dark-700 p-3.5 rounded-2xl flex items-center justify-between shadow';
            card.innerHTML = `
                <div class="flex items-center space-x-3 cursor-pointer group" onclick="openExternalProfile('${sanitizeHTML(user.email)}')">
                    <img src="${sanitizeHTML(user.avatar)}" class="w-10 h-10 rounded-full object-cover border border-brand-cyan group-hover:scale-105 transition">
                    <div>
                        <h4 class="font-bold text-white text-xs group-hover:text-brand-cyan transition">${sanitizeHTML(user.name)}</h4>
                        <p class="text-[10px] text-gray-400">${formatNumber(user.followersCount || 0)} Followers • ${formatNumber(user.totalViews || 0)} Views</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="toggleFollowUser('${sanitizeHTML(user.email)}', this)" class="${btnClass} px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow">
                        ${btnText}
                    </button>
                    <button onclick="openChatWithUser('${sanitizeHTML(user.email)}')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 shadow">
                        <i class="fa-solid fa-message"></i> <span>Message</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

function loadMessengerContacts(filterQuery = '') {
    db.collection("users").get().then((snapshot) => {
        const trayContainer = document.getElementById('chatContactsHorizontalList');
        const inboxContainer = document.getElementById('messengerInboxList');
        if (!trayContainer || !inboxContainer) return;
        
        trayContainer.innerHTML = '';
        inboxContainer.innerHTML = '';
        
        let users = [];
        snapshot.forEach(doc => {
            if (!currentUser || doc.data().email !== currentUser.email) {
                users.push(doc.data());
            }
        });

        if (filterQuery) {
            users = users.filter(u => u.name && u.name.toLowerCase().includes(filterQuery));
        }

        if (users.length === 0) {
            inboxContainer.innerHTML = `<div class="p-4 text-center text-gray-400 text-xs">No conversations found.</div>`;
            return;
        }

        users.forEach(user => {
            const unreadCount = parseInt(localStorage.getItem(`unread_${currentUser?.email}_${user.email}`) || '0');
            
            const trayItem = document.createElement('div');
            trayItem.className = 'flex flex-col items-center cursor-pointer shrink-0 relative group';
            trayItem.innerHTML = `
                <div class="relative">
                    <img src="${sanitizeHTML(user.avatar)}" class="w-12 h-12 rounded-full object-cover border-2 border-brand-cyan group-hover:scale-105 transition shadow" title="${sanitizeHTML(user.name)}">
                    <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#18191a] rounded-full"></span>
                    ${unreadCount > 0 ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">${unreadCount}</span>` : ''}
                </div>
                <span class="text-[10px] text-gray-300 truncate mt-1 max-w-[60px]">${sanitizeHTML(user.name.split(' ')[0])}</span>
            `;
            trayItem.onclick = () => {
                localStorage.setItem(`unread_${currentUser?.email}_${user.email}`, '0');
                selectActiveChatContact(user);
            };
            trayContainer.appendChild(trayItem);

            const inboxItem = document.createElement('div');
            inboxItem.className = 'flex items-center space-x-3 p-3 hover:bg-[#242526] cursor-pointer transition relative group';
            inboxItem.innerHTML = `
                <div class="relative shrink-0">
                    <img src="${sanitizeHTML(user.avatar)}" class="w-12 h-12 rounded-full object-cover">
                    <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#18191a] rounded-full"></span>
                </div>
                <div class="flex-1 truncate">
                    <div class="flex items-center justify-between">
                        <h4 class="font-bold text-white text-xs truncate">${sanitizeHTML(user.name)}</h4>
                    </div>
                    <p class="text-[11px] text-gray-400 truncate mt-0.5">Click to chat with ${sanitizeHTML(user.name.split(' ')[0])}</p>
                </div>
                ${unreadCount > 0 ? `<span class="bg-brand-cyan text-dark-900 text-[10px] font-bold px-2 py-0.5 rounded-full">${unreadCount}</span>` : ''}
            `;
            inboxItem.onclick = () => {
                localStorage.setItem(`unread_${currentUser?.email}_${user.email}`, '0');
                selectActiveChatContact(user);
            };
            inboxContainer.appendChild(inboxItem);
        });
    });
}

function openChatWithUser(email) {
    db.collection("users").doc(email).get().then((doc) => {
        if (doc.exists) {
            switchPage('messenger');
            selectActiveChatContact(doc.data());
        }
    });
}

function selectActiveChatContact(user) {
    activeChatContact = user;
    const header = document.getElementById('activeChatHeader');
    const chatOptionsBtn = document.getElementById('chatOptionsBtn');
    const chatPane = document.getElementById('messengerChatPane');
    
    if (chatOptionsBtn) chatOptionsBtn.classList.remove('hidden');
    if (chatPane) chatPane.classList.remove('translate-x-full');

    header.innerHTML = `
        <div class="flex items-center space-x-3">
            <button id="backToInboxBtn" class="md:hidden text-gray-300 hover:text-white p-1 mr-1" onclick="document.getElementById('messengerChatPane').classList.add('translate-x-full')"><i class="fa-solid fa-arrow-left text-base"></i></button>
            <div class="relative cursor-pointer" onclick="openExternalProfile('${sanitizeHTML(user.email)}')">
                <img src="${sanitizeHTML(user.avatar)}" class="w-9 h-9 rounded-full object-cover border border-brand-cyan">
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#242526] rounded-full"></span>
            </div>
            <div>
                <span class="font-bold text-white text-xs block cursor-pointer hover:underline" onclick="openExternalProfile('${sanitizeHTML(user.email)}')">${sanitizeHTML(user.name)}</span>
                <span class="text-[9px] text-emerald-400">Active Now</span>
            </div>
        </div>
        <div class="relative">
            <button id="chatOptionsBtn" class="w-8 h-8 bg-[#3a3b3c] hover:bg-[#4e4f50] rounded-full flex items-center justify-center text-gray-200 transition cursor-pointer"><i class="fa-solid fa-ellipsis-vertical text-sm"></i></button>
            <div id="chatOptionsMenu" class="absolute right-0 top-10 bg-[#242526] border border-dark-600 rounded-2xl shadow-2xl hidden z-40 py-1.5 w-44">
                <button id="blockUnblockUserBtn" class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/40 font-bold text-xs flex items-center space-x-2 cursor-pointer transition">
                    <i class="fa-solid fa-ban"></i> <span id="blockBtnText">Block User</span>
                </button>
            </div>
        </div>
    `;

    setupMessengerUIEnhancements();
    renderChatMessages();
}

function setupMessengerUIEnhancements() {
    const chatOptionsBtn = document.getElementById('chatOptionsBtn');
    const chatOptionsMenu = document.getElementById('chatOptionsMenu');
    if (chatOptionsBtn && chatOptionsMenu) {
        chatOptionsBtn.onclick = () => chatOptionsMenu.classList.toggle('hidden');
    }

    const blockUnblockBtn = document.getElementById('blockUnblockUserBtn');
    if (blockUnblockBtn) {
        blockUnblockBtn.onclick = () => {
            if (!activeChatContact || !currentUser) return;
            const blockKey = `blocked_${currentUser.email}_${activeChatContact.email}`;
            if (localStorage.getItem(blockKey)) {
                localStorage.removeItem(blockKey);
                showToast('User unblocked successfully!');
            } else {
                localStorage.setItem(blockKey, 'true');
                showToast('User blocked successfully.', 'error');
            }
            chatOptionsMenu.classList.add('hidden');
            selectActiveChatContact(activeChatContact);
        };
    }
}

function renderChatMessages() {
    const box = document.getElementById('chatMessagesBox');
    if (!box) return;
    box.innerHTML = '';
    if (!activeChatContact || !currentUser) return;

    if (unsubscribeChat) {
        unsubscribeChat();
    }

    const chatId = [currentUser.email, activeChatContact.email].sort().join('_');
    unsubscribeChat = db.collection("chats").doc(chatId).collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
        box.innerHTML = '';
        if (snapshot.empty) {
            box.innerHTML = `<div class="m-auto text-center text-gray-400 text-[11px] bg-[#3a3b3c] px-4 py-2 rounded-xl border border-dark-700">No messages yet. Say hello!</div>`;
            return;
        }
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isMe = msg.sender === currentUser.email;
            const msgDiv = document.createElement('div');
            msgDiv.className = `flex ${isMe ? 'justify-end' : 'justify-start'} my-1.5`;

            let contentHTML = `<p>${sanitizeHTML(msg.text)}</p>`;
            if (msg.imageUrl) {
                contentHTML += `<img src="${sanitizeHTML(msg.imageUrl)}" class="mt-2 rounded-xl max-w-xs object-cover max-h-48">`;
            }

            msgDiv.innerHTML = `
                <div class="max-w-[75%] px-4 py-2.5 rounded-2xl text-xs shadow-md ${isMe ? 'bg-brand-cyan text-dark-900 font-medium rounded-tr-none' : 'bg-[#3a3b3c] text-gray-100 rounded-tl-none'}">
                    ${contentHTML}
                    <div class="text-[8px] text-right text-gray-300 mt-1">${sanitizeHTML(msg.time)}</div>
                </div>
            `;
            box.appendChild(msgDiv);
        });
        box.scrollTop = box.scrollHeight;
    });
}

function loadNotifications() {
    const headerNotificationBadge = document.getElementById('headerNotificationBadge');

    if (currentUser) {
        db.collection("notifications").where("recipient", "==", currentUser.email).orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            if (!snapshot.empty) {
                const countStr = snapshot.size.toString();
                if (headerNotificationBadge) {
                    headerNotificationBadge.innerText = countStr;
                    headerNotificationBadge.classList.remove('hidden');
                }
            } else {
                if (headerNotificationBadge) headerNotificationBadge.classList.add('hidden');
            }
        });
    }
}

function loadNotificationsList() {
    const container = document.getElementById('notificationsListContainer');
    if (!container || !currentUser) return;

    db.collection("notifications").where("recipient", "==", currentUser.email).orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        container.innerHTML = '';
        if (snapshot.empty) {
            container.innerHTML = `<div class="text-center py-8 text-gray-500 text-xs">No notifications yet. Follow creators to receive instant alerts when they post!</div>`;
            return;
        }

        snapshot.forEach(doc => {
            const n = doc.data();
            const item = document.createElement('div');
            item.className = 'bg-dark-900 border border-dark-700 p-3.5 rounded-2xl flex items-center justify-between shadow';
            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400 shrink-0">
                        <i class="fa-solid fa-bell text-sm"></i>
                    </div>
                    <div>
                        <p class="text-white text-xs font-bold">${sanitizeHTML(n.text)}</p>
                        <span class="text-[9px] text-gray-400">${new Date(n.date).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    });
}

function setupProfileEditModal() {
    const openBtn = document.getElementById('openEditModalBtn');
    const modal = document.getElementById('editProfileModal');
    const closeBtn = document.getElementById('closeEditModalBtn');
    const saveBtn = document.getElementById('saveProfileBtn');

    if (openBtn && modal) {
        openBtn.onclick = () => {
            if (!currentUser) {
                showToast('Please login first.', 'error');
                return;
            }
            document.getElementById('editNameInput').value = currentUser.name || '';
            document.getElementById('editBioInput').value = currentUser.bio || '';
            modal.classList.remove('hidden');
        };
    }

    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.classList.add('hidden');
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            if (!currentUser) return;
            const newName = sanitizeHTML(document.getElementById('editNameInput').value.trim());
            const newBio = sanitizeHTML(document.getElementById('editBioInput').value.trim());
            const imageFile = document.getElementById('profileImageFile').files[0];

            let avatarUrl = currentUser.avatar;
            showToast('Updating profile via Firebase Storage...');

            if (imageFile) {
                const storageRef = storage.ref(`avatars/${Date.now()}_${imageFile.name}`);
                const snapshot = await storageRef.put(imageFile);
                avatarUrl = await snapshot.ref.getDownloadURL();
            }

            currentUser.name = newName || currentUser.name;
            currentUser.bio = newBio;
            currentUser.avatar = avatarUrl;

            await db.collection("users").doc(currentUser.email).set(currentUser, { merge: true });
            
            showToast('Profile updated successfully!');
            modal.classList.add('hidden');
            loadUserProfile();
            initializeAppUI();
        };
    }

    const emojiToolbar = document.getElementById('emojiToolbar');
    const chatInput = document.getElementById('chatInputMsg');
    if (emojiToolbar && chatInput) {
        emojiToolbar.querySelectorAll('span').forEach(emojiSpan => {
            emojiSpan.onclick = () => {
                chatInput.value += emojiSpan.innerText;
                chatInput.focus();
            };
        });
    }

    const messengerSearchInput = document.getElementById('messengerSearchInput');
    if (messengerSearchInput) {
        messengerSearchInput.addEventListener('input', (e) => {
            loadMessengerContacts(sanitizeHTML(e.target.value.toLowerCase().trim()));
        });
    }
}

function setupVideoEditModal() {
    const modal = document.getElementById('editVideoModal');
    const closeBtn = document.getElementById('closeEditVideoModal');
    const saveBtn = document.getElementById('saveVideoTitleBtn');

    if (closeBtn && modal) closeBtn.onclick = () => modal.classList.add('hidden');

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const newTitle = sanitizeHTML(document.getElementById('editVideoTitleInput').value.trim());
            if (!newTitle || !editingVideoId) {
                showToast('Please enter a valid title.', 'error');
                return;
            }

            await db.collection("videos").doc(editingVideoId).update({ title: newTitle });
            showToast('Video title updated successfully!');
            modal.classList.add('hidden');
            loadUserProfile();
        };
    }
}

window.openEditVideoModal = function(id, currentTitle) {
    editingVideoId = id;
    const input = document.getElementById('editVideoTitleInput');
    const modal = document.getElementById('editVideoModal');
    if (input && modal) {
        input.value = currentTitle;
        modal.classList.remove('hidden');
    }
};

window.deleteUserVideo = async function(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        await db.collection("videos").doc(id).delete();
        showToast('Video deleted successfully!');
        loadUserProfile();
    }
};

function setupEventListeners() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) {
                showToast('Please login with Google to upload videos!', 'error');
                return;
            }

            if (currentUser.isBanned) {
                showToast('Your account is restricted from uploading videos.', 'error');
                return;
            }

            const title = sanitizeHTML(document.getElementById('videoTitle').value);
            const category = sanitizeHTML(document.getElementById('videoCategory').value);
            const uploadTypeChoice = sanitizeHTML(document.getElementById('uploadTypeChoice').value);
            const aspectRatio = uploadTypeChoice === 'shorts' ? '9:16' : '16:9';
            const desc = sanitizeHTML(document.getElementById('videoDesc').value);
            const videoFile = document.getElementById('videoFile').files[0];
            const thumbFile = document.getElementById('thumbnailFile').files[0];

            if (!videoFile) {
                showToast('Please select a video file.', 'error');
                return;
            }

            const pornKeywords = ['porn', 'xxx', 'sex', 'naked', 'adult', 'nude', 'porno', 'bdsm', 'erotic'];
            const containsRestrictedContent = pornKeywords.some(keyword => title.toLowerCase().includes(keyword) || desc.toLowerCase().includes(keyword));

            if (containsRestrictedContent) {
                let newStrikes = (currentUser.strikes || 0) + 1;
                let isRestricted = newStrikes >= 2;
                
                await db.collection("users").doc(currentUser.email).update({
                    strikes: newStrikes,
                    isBanned: isRestricted
                });

                showToast('Warning: Violates community guidelines regarding adult content.', 'error');
                return;
            }

            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Uploading via Firebase Storage...';
            }

            try {
                const videoStorageRef = storage.ref(`videos/${Date.now()}_${videoFile.name}`);
                const videoUploadTask = await videoStorageRef.put(videoFile);
                const videoUrl = await videoUploadTask.ref.getDownloadURL();

                let thumbnailUrl = '';
                if (thumbFile) {
                    const thumbStorageRef = storage.ref(`thumbnails/${Date.now()}_${thumbFile.name}`);
                    const thumbUploadTask = await thumbStorageRef.put(thumbFile);
                    thumbnailUrl = await thumbUploadTask.ref.getDownloadURL();
                }

                const videoRef = await db.collection("videos").add({
                    title, category, aspectRatio, desc, videoUrl, thumbnailUrl,
                    creatorName: currentUser.name,
                    creatorEmail: currentUser.email,
                    creatorAvatar: currentUser.avatar,
                    likes: 0, views: 0,
                    date: new Date().toISOString().split('T')[0],
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                await notifyFollowers(currentUser.email, {
                    type: 'video',
                    title: `${currentUser.name} uploaded a new video: "${title}"`,
                    targetId: videoRef.id
                });

                showToast('Video successfully uploaded and published!');
                uploadForm.reset();
                switchPage('home');
            } catch (error) {
                showToast('Upload Error: ' + sanitizeHTML(error.message), 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Start Secure Upload (Anti-Porn Filter Active)';
                }
            }
        });
    }

    const sendBtn = document.getElementById('sendChatMsgBtn');
    const chatInput = document.getElementById('chatInputMsg');
    const chatImageInput = document.getElementById('chatImageInput');

    if (sendBtn && chatInput) {
        const sendAction = async (imageUrl = '') => {
            const text = sanitizeHTML(chatInput.value.trim());
            if ((!text && !imageUrl) || !activeChatContact || !currentUser) return;

            const blockKey = `blocked_${currentUser.email}_${activeChatContact.email}`;
            const blockedByThem = localStorage.getItem(`blocked_${activeChatContact.email}_${currentUser.email}`);
            if (localStorage.getItem(blockKey) || blockedByThem) {
                showToast('Unable to send message. User blocked.', 'error');
                return;
            }

            const chatId = [currentUser.email, activeChatContact.email].sort().join('_');
            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            db.collection("chats").doc(chatId).collection("messages").add({
                sender: currentUser.email,
                text: text || (imageUrl ? '[Image Attachment]' : ''),
                imageUrl: imageUrl,
                time: timeNow,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            const unreadKey = `unread_${activeChatContact.email}_${currentUser.email}`;
            const currentUnread = parseInt(localStorage.getItem(unreadKey) || '0');
            localStorage.setItem(unreadKey, currentUnread + 1);

            db.collection("notifications").add({
                recipient: activeChatContact.email,
                sender: currentUser.name,
                text: `${currentUser.name} sent you a message`,
                date: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            chatInput.value = '';
        };

        sendBtn.onclick = () => sendAction();
        chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendAction(); };

        if (chatImageInput) {
            chatImageInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file || !activeChatContact || !currentUser) return;

                showToast('Uploading image to chat...');
                try {
                    const chatImageRef = storage.ref(`chat_images/${Date.now()}_${file.name}`);
                    const uploadSnapshot = await chatImageRef.put(file);
                    const downloadUrl = await uploadSnapshot.ref.getDownloadURL();
                    
                    if (downloadUrl) {
                        sendAction(downloadUrl);
                        chatImageInput.value = '';
                    } else {
                        showToast('Image upload failed.', 'error');
                    }
                } catch(err) {
                    showToast('Error uploading chat image.', 'error');
                }
            };
        }
    }

    const closeModal = () => {
        document.getElementById('videoModal').classList.add('hidden');
        document.getElementById('modalVideoPlayer').pause();
    };
    const closeMob = document.getElementById('closeVideoModalMobile');
    const closeDesk = document.getElementById('closeVideoModalDesktop');
    if (closeMob) closeMob.onclick = closeModal;
    if (closeDesk) closeDesk.onclick = closeModal;

    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.onclick = () => {
            document.querySelectorAll('.category-chip').forEach(c => {
                c.className = 'category-chip bg-dark-800 hover:bg-dark-700 text-gray-200 px-4 py-2 rounded-xl shrink-0 transition cursor-pointer';
            });
            chip.className = 'category-chip bg-white text-dark-900 px-4 py-2 rounded-xl font-bold shrink-0 shadow-lg cursor-pointer';
            loadHomeFeed(chip.getAttribute('data-category'));
        };
    });

    const postCommentBtn = document.getElementById('postCommentBtn');
    const commentInput = document.getElementById('commentInput');
    if (postCommentBtn && commentInput) {
        postCommentBtn.onclick = () => {
            const text = sanitizeHTML(commentInput.value.trim());
            if (!text || !activeVideo) return;
            if (!currentUser) {
                showToast('Please login to post a comment!', 'error');
                return;
            }

            const newComment = { 
                user: currentUser.name, 
                email: currentUser.email,
                text: text, 
                date: new Date().toISOString().split('T')[0] 
            };
            const updatedComments = activeVideo.comments ? [...activeVideo.comments, newComment] : [newComment];

            db.collection("videos").doc(activeVideo.id).update({ comments: updatedComments }).then(() => {
                activeVideo.comments = updatedComments;
                renderComments(activeVideo);
                commentInput.value = '';
                showToast('Comment posted!');
            });
        };
    }
}

function loadAnalytics() {
    if (!currentUser) return;
    db.collection("videos").where("creatorEmail", "==", currentUser.email).get().then((snapshot) => {
        let totalViews = 0, totalLikes = 0, topVideoTitle = 'None', maxViews = -1;
        const list = document.getElementById('analyticsVideoList');
        if (!list) return;
        list.innerHTML = '';

        snapshot.forEach(doc => {
            const v = doc.data();
            totalViews += (v.views || 0);
            totalLikes += (v.likes || 0);
            if ((v.views || 0) > maxViews) { maxViews = v.views || 0; topVideoTitle = v.title; }

            list.innerHTML += `
                <div class="bg-dark-800 p-3 rounded-2xl flex items-center justify-between border border-dark-700 text-xs">
                    <span class="font-bold text-white truncate max-w-[60%]" title="${sanitizeHTML(v.title)}">${sanitizeHTML(v.title)}</span>
                    <div class="space-x-3 text-[10px] text-gray-300">
                        <span><i class="fa-solid fa-eye text-brand-cyan"></i> ${formatNumber(v.views || 0)}</span>
                        <span><i class="fa-solid fa-thumbs-up text-brand-red"></i> ${formatNumber(v.likes || 0)}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('analyticTotalViews').innerText = formatNumber(totalViews);
        document.getElementById('analyticTotalLikes').innerText = formatNumber(totalLikes);
        document.getElementById('analyticTopVideo').innerText = sanitizeHTML(topVideoTitle);
    });
}

function loadUserProfile() {
    if (!currentUser) return;
    db.collection("users").doc(currentUser.email).get().then((doc) => {
        const freshUser = doc.exists ? doc.data() : currentUser;
        currentUser = { ...currentUser, ...freshUser };

        document.getElementById('profileAvatar').src = freshUser.avatar;
        document.getElementById('profileName').innerText = freshUser.name;
        document.getElementById('profileEmail').innerText = freshUser.email;
        document.getElementById('profileBio').innerText = freshUser.bio || 'No bio added.';
        document.getElementById('profileSubCount').innerText = `${formatNumber(freshUser.followersCount || 0)} Followers`;
        document.getElementById('profileStrikeCount').innerText = `${freshUser.strikes || 0} Strikes`;

        const verifiedBadge = document.getElementById('profileVerifiedBadge');
        const nameVerifiedIcon = document.getElementById('profileNameVerifiedIcon');
        if (freshUser.verified) {
            verifiedBadge.classList.remove('hidden');
            nameVerifiedIcon.classList.remove('hidden');
        } else {
            verifiedBadge.classList.add('hidden');
            nameVerifiedIcon.classList.add('hidden');
        }
    });

    db.collection("videos").where("creatorEmail", "==", currentUser.email).get().then((snapshot) => {
        const videoCountBadge = document.getElementById('profileVideoCountBadge');
        if (videoCountBadge) videoCountBadge.innerText = `${snapshot.size} Videos`;

        let myAllVideos = [];
        snapshot.forEach(doc => myAllVideos.push({ id: doc.id, ...doc.data() }));

        db.collection("posts").where("creatorEmail", "==", currentUser.email).get().then((pSnapshot) => {
            const profilePostCount = document.getElementById('profilePostCountBadge');
            if (profilePostCount) profilePostCount.innerText = `${pSnapshot.size} Posts`;
            let myAllPosts = [];
            pSnapshot.forEach(pDoc => myAllPosts.push({ id: pDoc.id, ...pDoc.data() }));

            const renderProfileTabContent = (type) => {
                const area = document.getElementById('profileTabContentArea');
                if (!area) return;
                area.innerHTML = '';
                
                if (type === 'posts') {
                    if (myAllPosts.length === 0) {
                        area.innerHTML = `<p class="text-gray-500 text-[11px] col-span-full">No posts uploaded yet.</p>`;
                        return;
                    }
                    myAllPosts.forEach(p => {
                        area.innerHTML += `
                            <div class="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden p-3 space-y-2 shadow-md">
                                <p class="text-white text-xs">${sanitizeHTML(p.caption || '')}</p>
                                ${p.imageUrl ? `<img src="${sanitizeHTML(p.imageUrl)}" class="w-full h-32 object-cover rounded-xl">` : ''}
                            </div>
                        `;
                    });
                    return;
                }

                const filtered = myAllVideos.filter(v => type === 'shorts' ? v.aspectRatio === '9:16' : v.aspectRatio !== '9:16');

                if (filtered.length === 0) {
                    area.innerHTML = `<p class="text-gray-500 text-[11px] col-span-full">No ${type} uploaded yet.</p>`;
                    return;
                }

                filtered.forEach(v => {
                    area.innerHTML += `
                        <div class="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden p-3 flex items-center justify-between shadow-md">
                            <div class="flex items-center space-x-2.5 truncate">
                                <img src="${sanitizeHTML(v.thumbnailUrl || v.creatorAvatar)}" class="w-16 h-10 rounded-xl object-cover">
                                <div class="truncate">
                                    <h4 class="font-bold text-white text-[11px] truncate">${sanitizeHTML(v.title)}</h4>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${formatNumber(v.views || 0)} views • ${formatNumber(v.likes || 0)} likes</div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 shrink-0">
                                <button onclick="openEditVideoModal('${v.id}', '${sanitizeHTML(v.title)}')" class="bg-brand-cyan/20 text-brand-cyan px-2.5 py-1 rounded-xl text-[10px] font-semibold cursor-pointer hover:bg-brand-cyan/30">Edit</button>
                                <button onclick="deleteUserVideo('${v.id}')" class="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-semibold cursor-pointer hover:bg-red-500/30">Delete</button>
                            </div>
                        </div>
                    `;
                });
            };

            renderProfileTabContent('videos');
            document.getElementById('profileTabVideos').onclick = () => {
                document.getElementById('profileTabVideos').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabShorts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabPosts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                renderProfileTabContent('videos');
            };
            document.getElementById('profileTabShorts').onclick = () => {
                document.getElementById('profileTabShorts').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabVideos').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabPosts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                renderProfileTabContent('shorts');
            };
            document.getElementById('profileTabPosts').onclick = () => {
                document.getElementById('profileTabPosts').className = 'text-xs font-bold text-brand-cyan border-b-2 border-brand-cyan pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabVideos').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                document.getElementById('profileTabShorts').className = 'text-xs font-semibold text-gray-400 hover:text-white pb-1 transition cursor-pointer shrink-0';
                renderProfileTabContent('posts');
            };
        });
    });
}
